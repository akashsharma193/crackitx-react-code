import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://online-examination-secured.onrender.com',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
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

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        const deviceId = localStorage.getItem('deviceId');

        if (!config.url.includes('/user-open/')) {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

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

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (originalRequest.url.includes('/user-open/login')) {
                return Promise.reject(error);
            }

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
                handleLogout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${apiClient.defaults.baseURL}/user-open/refresh-token`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data && response.data.data && response.data.data.token) {
                    const newToken = response.data.data.token;
                    const newRefreshToken = response.data.data.refreshToken;

                    localStorage.setItem('authToken', newToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    processQueue(null, newToken);

                    return apiClient(originalRequest);
                } else {
                    throw new Error('Invalid refresh token response');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);

                if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                    handleLogout();
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    window.location.href = '/';
};

export default apiClient;