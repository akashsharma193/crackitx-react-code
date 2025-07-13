import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://online-examination-secured.onrender.com',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a flag to track if we're already handling token refresh
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

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        const deviceId = localStorage.getItem('deviceId');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add deviceId if it exists and not already present
        if (deviceId && !config.headers.deviceId) {
            config.headers.deviceId = deviceId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors for token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Check if this is a login request - don't try to refresh token for login
            if (originalRequest.url.includes('/user-open/login')) {
                return Promise.reject(error);
            }

            // If we're already refreshing, add this request to the queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token available, redirect to login
                console.log('No refresh token available, redirecting to login');
                handleLogout();
                return Promise.reject(error);
            }

            try {
                console.log('Attempting to refresh token...');

                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/user-open/refresh-token`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                            // Removed deviceId from here as well
                        }
                    }
                );

                if (response.data && response.data.data && response.data.data.token) {
                    const newToken = response.data.data.token;
                    const newRefreshToken = response.data.data.refreshToken;

                    // Update stored tokens
                    localStorage.setItem('authToken', newToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    console.log('Token refreshed successfully');

                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Process the queued requests
                    processQueue(null, newToken);

                    // Retry the original request
                    return apiClient(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // Process the queued requests with error
                processQueue(refreshError, null);

                // Only logout if refresh token is invalid or expired
                if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                    handleLogout();
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For other errors, don't remove tokens
        return Promise.reject(error);
    }
);

const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    window.location.href = '/';
};

export default apiClient;