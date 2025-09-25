import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tomarbros.in/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
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
    return btoa(JSON.stringify(data));
};

const decodeBase64 = (encodedData) => {
    return JSON.parse(atob(encodedData));
};

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        const deviceId = localStorage.getItem('deviceId');

        // Add Authorization header for all requests except login/register endpoints
        if (!config.url.includes('/user-open/')) {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Add deviceId header if available
        if (deviceId) {
            config.headers['deviceId'] = deviceId;
        }

        // Set required headers
        config.headers['encDisabled'] = 'false';
        config.headers['Content-Type'] = 'application/json';

        // Handle GET and DELETE requests (add empty payload if no data)
        if (config.method === 'get' || config.method === 'delete') {
            if (!config.data) {
                config.data = {
                    encPayload: encodeBase64({})
                };
            }
        }

        // Only encode if not already encoded and not marked as processed
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
            data: config.data
        });

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Decode encrypted response if present
        if (response.data && response.data.encPayloadRes) {
            response.data = decodeBase64(response.data.encPayloadRes);
        }

        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error('API Error:', {
            url: originalRequest?.url,
            status: error.response?.status,
            message: error.message
        });

        // Decode encrypted error response if present
        if (error.response?.data?.encPayloadRes) {
            error.response.data = decodeBase64(error.response.data.encPayloadRes);
        }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 409 && !originalRequest._retry) {
            // Don't try to refresh token for login requests
            if (originalRequest.url.includes('/user-open/login')) {
                return Promise.reject(error);
            }

            // If already refreshing, queue the request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    // Create fresh request with new token but preserve original data
                    const freshRequest = {
                        ...originalRequest,
                        headers: {
                            ...originalRequest.headers,
                            'Authorization': `Bearer ${token}`
                        },
                        _skipEncoding: true // Mark to skip encoding since data is already encoded
                    };
                    delete freshRequest._retry;
                    return apiClient(freshRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            // Mark request as retried and start refresh process
            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            // If no refresh token or userId, logout immediately
            if (!refreshToken || !userId) {
                console.log('No refresh token or userId found, logging out...');
                handleLogout('Session expired. Please login again.');
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token...');

                // Call refresh token API with correct endpoint and encoded payload
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
                            'Content-Type': 'application/json',
                            'encDisabled': 'false'
                        }
                    }
                );

                console.log('Refresh token response:', refreshResponse.data);

                let responseData = refreshResponse.data;

                // Decode response if encrypted
                if (responseData.encPayloadRes) {
                    responseData = decodeBase64(responseData.encPayloadRes);
                }

                // Check if refresh was successful
                if (responseData && responseData.success && responseData.data) {
                    const { token: newToken, refreshToken: newRefreshToken, userId: newUserId } = responseData.data;

                    if (newToken) {
                        // Store new tokens
                        localStorage.setItem('authToken', newToken);

                        if (newRefreshToken) {
                            localStorage.setItem('refreshToken', newRefreshToken);
                        }

                        if (newUserId) {
                            localStorage.setItem('userId', newUserId);
                        }

                        console.log('Token refreshed successfully');

                        // Create fresh request with new token and skip encoding
                        const retryRequest = {
                            ...originalRequest,
                            headers: {
                                ...originalRequest.headers,
                                'Authorization': `Bearer ${newToken}`
                            },
                            _skipEncoding: true // Important: Skip encoding since data is already encoded
                        };

                        // Remove the _retry flag to avoid infinite loops
                        delete retryRequest._retry;

                        console.log('Retrying original request after token refresh:', {
                            url: retryRequest.url,
                            method: retryRequest.method,
                            data: retryRequest.data,
                            skipEncoding: retryRequest._skipEncoding
                        });

                        // Process queued requests
                        processQueue(null, newToken);

                        // Retry original request
                        return apiClient(retryRequest);
                    } else {
                        throw new Error('No access token in refresh response');
                    }
                } else {
                    throw new Error('Invalid refresh token response structure');
                }

            } catch (refreshError) {
                console.error('Refresh token error:', refreshError);

                // Process failed queue
                processQueue(refreshError, null);

                // Handle specific refresh token errors
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

        // For all other errors, just reject
        return Promise.reject(error);
    }
);

// Logout function
const handleLogout = (message = 'Session expired. Please login again.') => {
    console.log('Logging out user:', message);

    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('deviceId');

    // Show message to user (you might want to use a toast notification here)
    alert(message);

    // Redirect to login page
    window.location.href = '/';
};

// Optional: Add a function to manually check token validity
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

export default apiClient;