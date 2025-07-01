import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://online-examination-secured.onrender.com',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // config.headers.Authorization = `Bearer ${token}`;
            config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJUZW5hbnQiOiItY3JhY2tpdHgiLCJSb2xlcyI6IlVzZXIiLCJJZCI6IjY4NWVjMDQyNzgzNGRlMGVhNzIzMzViZiIsInN1YiI6ImtzaHM5NjY5OTU3MDE3IiwiaWF0IjoxNzUxMzU3NzAwLCJleHAiOjE3NTE0NDQxMDB9.ouipJ5QVX0NwikLKFQERasCfcX9tir4Gc9zoTHnIkgc`;
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
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            // window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default apiClient;