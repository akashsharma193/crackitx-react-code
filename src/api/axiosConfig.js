import axios from 'axios';

const pendingRequests = new Map();

const generateRequestKey = (config) => {
    const { method, url, data, params } = config;
    return `${method}:${url}:${JSON.stringify(data || {})}:${JSON.stringify(params || {})}`;
};

const apiClient = axios.create({
    baseURL: 'https://tomarbros.in/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
        'Accept-Charset': 'utf-8',
        'encDisabled': 'false'
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const encodeBase64 = (data) => {
    // Use proper Unicode encoding for base64
    const jsonString = JSON.stringify(data);
    // Convert to UTF-8 bytes first, then to base64
    return btoa(unescape(encodeURIComponent(jsonString)));
};

const decodeBase64 = (encodedData) => {
    try {
        // Decode from base64 to UTF-8 bytes, then parse
        const jsonString = decodeURIComponent(escape(atob(encodedData)));
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error decoding base64 data:', error);
        // Fallback to original method if new method fails
        try {
            return JSON.parse(atob(encodedData));
        } catch (fallbackError) {
            console.error('Fallback decode also failed:', fallbackError);
            throw fallbackError;
        }
    }
};

apiClient.interceptors.request.use(
    (config) => {
        const requestKey = generateRequestKey(config);
        
        if (pendingRequests.has(requestKey)) {
            console.log('Duplicate request detected, returning existing promise:', requestKey);
            return pendingRequests.get(requestKey);
        }

        const token = localStorage.getItem('authToken');
        const deviceId = localStorage.getItem('deviceId');

        if (!config.url.includes('/user-open/')) {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (deviceId) {
            config.headers['deviceId'] = deviceId;
        }

        config.headers['encDisabled'] = 'false';
        config.headers['Content-Type'] = 'application/json; charset=utf-8';
        config.headers['Accept'] = 'application/json; charset=utf-8';
        config.headers['Accept-Charset'] = 'utf-8';

        if (config.method === 'get' || config.method === 'delete') {
            if (!config.data) {
                config.data = {
                    encPayload: encodeBase64({})
                };
            }
        }

        if (config.data && !config.data.encPayload && !config._skipEncoding) {
            console.log('Encoding request data:', config.data);
            config.data = {
                encPayload: encodeBase64(config.data)
            };
            console.log('Encoded request data:', config.data);
        } else if (config.data && config.data.encPayload) {
            console.log('Request already has encPayload, skipping encoding');
        }

        console.log('API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
            requestKey
        });

        config._requestKey = requestKey;
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        const requestKey = response.config._requestKey;
        if (requestKey) {
            pendingRequests.delete(requestKey);
        }

        if (response.data && response.data.encPayloadRes) {
            response.data = decodeBase64(response.data.encPayloadRes);
        }

        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
            requestKey
        });

        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const requestKey = originalRequest?._requestKey;

        if (requestKey) {
            pendingRequests.delete(requestKey);
        }

        console.error('API Error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            message: error.message,
            requestKey
        });

        if (error.response?.data?.encPayloadRes) {
            error.response.data = decodeBase64(error.response.data.encPayloadRes);
        }

        if (error.response?.status === 409 && !originalRequest._retry) {
            if (originalRequest.url.includes('/user-open/login')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    const freshRequest = {
                        ...originalRequest,
                        headers: {
                            ...originalRequest.headers,
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json; charset=utf-8',
                            'Accept-Charset': 'utf-8'
                        },
                        _skipEncoding: true
                    };
                    delete freshRequest._retry;
                    return apiClient(freshRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (!refreshToken || !userId) {
                console.log('No refresh token or userId found, logging out...');
                handleLogout('Session expired. Please login again.');
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token...');

                const refreshResponse = await axios.post(
                    `${apiClient.defaults.baseURL}user-open/refreshToken`,
                    {
                        encPayload: encodeBase64({
                            refreshToken: refreshToken,
                            userId: userId
                        })
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json; charset=utf-8',
                            'Accept-Charset': 'utf-8',
                            'encDisabled': 'false'
                        }
                    }
                );

                console.log('Refresh token response:', refreshResponse.data);

                let responseData = refreshResponse.data;

                if (responseData.encPayloadRes) {
                    responseData = decodeBase64(responseData.encPayloadRes);
                }

                if (responseData && responseData.success && responseData.data) {
                    const { token: newToken, refreshToken: newRefreshToken, userId: newUserId } = responseData.data;

                    if (newToken) {
                        localStorage.setItem('authToken', newToken);

                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        if (newUserId) {
                            localStorage.setItem('userId', newUserId);
                        }

                        console.log('Token refreshed successfully');

                        const retryRequest = {
                            ...originalRequest,
                            headers: {
                                ...originalRequest.headers,
                                'Authorization': `Bearer ${newToken}`,
                                'Content-Type': 'application/json; charset=utf-8',
                                'Accept': 'application/json; charset=utf-8',
                                'Accept-Charset': 'utf-8'
                            },
                            _skipEncoding: true
                        };

                        delete retryRequest._retry;

                        console.log('Retrying original request after token refresh:', {
                            url: retryRequest.url,
                            method: retryRequest.method,
                            data: retryRequest.data,
                            skipEncoding: retryRequest._skipEncoding
                        });

                        processQueue(null, newToken);

                        return apiClient(retryRequest);
                    } else {
                        throw new Error('No access token in refresh response');
                    }
                } else {
                    throw new Error('Invalid refresh token response structure');
                }

            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);

                processQueue(refreshError, null);

                if (refreshError.response?.status === 401 ||
                    refreshError.response?.status === 403 ||
                    refreshError.response?.status === 400) {
                    handleLogout('Session expired. Please login again.');
                } else if (refreshError.response?.status >= 500) {
                    handleLogout('Server error. Please try logging in again.');
                } else {
                    handleLogout('Authentication failed. Please login again.');
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const handleLogout = (message = 'Session expired. Please login again.') => {
    console.log('Logging out user:', message);

    pendingRequests.clear();

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('deviceId');

    alert(message);

    window.location.href = '/';
};

export const checkTokenValidity = () => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');

    console.log('Current auth state:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUserId: !!userId,
        token: token ? token.substring(0, 20) + '...' : null,
        refreshToken: refreshToken,
        userId: userId
    });

    return {
        isAuthenticated: !!(token && refreshToken && userId),
        token,
        refreshToken,
        userId
    };
};

export const clearPendingRequests = () => {
    pendingRequests.clear();
};

export default apiClient;