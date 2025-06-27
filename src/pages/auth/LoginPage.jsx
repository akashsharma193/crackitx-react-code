import React, { useState } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        var deviceId = getDeviceId();
        try {
            const response = await apiClient.post('/user-open/login', {
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'deviceId': deviceId,
                    'Content-Type': 'application/json'
                }
            });

            const clearNavigationHistory = () => {
                window.history.replaceState(null, '', '/home');

                const currentLength = window.history.length;
                window.history.go(-currentLength + 1);

                window.history.pushState(null, '', window.location.href);
                window.addEventListener('popstate', (event) => {
                    window.history.pushState(null, '', window.location.href);
                });
            };

            if (response.data && response.status === 200) {
                toast.success('Login successful!');
                if (response.data.data.token) {
                    localStorage.setItem('authToken', response.data.data.token);
                }
                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }
                navigate('/home', { replace: true });
            }

        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    error.response.data?.detail ||
                    'Login failed';

                if (status === 400) {
                    toast.error(message || 'Bad request. Please check your input.');
                } else if (status === 401) {
                    toast.error('Invalid email or password');
                } else if (status === 404) {
                    toast.error('User not found');
                } else if (status === 422) {
                    toast.error('Please check your input and try again');
                } else if (status >= 500) {
                    toast.error('Server error. Please try again later');
                } else {
                    toast.error(message);
                }
            } else if (error.request) {
                // Network error
                toast.error('Network error. Please check your connection');
            } else {
                // Other error
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Welcome Section */}
            <WelcomeComponent />

            {/* Login Form */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center" style={{ padding: '64px' }}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl" style={{ padding: '48px 40px' }}>
                        <h1 className="text-xl font-bold text-gray-900 text-center" style={{ marginBottom: '40px' }}>
                            LOGIN
                        </h1>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Email Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '16px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '16px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-[#5E48EF] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ fontSize: '14px' }}
                                    disabled={isLoading}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl text-white font-semibold transition-all hover:opacity-90 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #735FF1 0%, #624CEF 100%)',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    fontSize: '16px'
                                }}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                            {/* Register Link */}
                            <div className="text-center">
                                <span className="text-gray-600" style={{ fontSize: '14px' }}>
                                    Don't have an account?{' '}
                                </span>
                                <Link to="/register"
                                    className="text-gray-900 font-semibold hover:text-[#5E48EF] transition-colors bg-transparent border-none cursor-pointer"
                                    style={{ fontSize: '14px' }}
                                >
                                    Register
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;