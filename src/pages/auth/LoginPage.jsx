import React, { useState } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        hasMinLength: false
    });

    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    const checkAdminRole = (token) => {
        try {
            const decodedToken = decodeJWT(token);

            if (!decodedToken) {
                console.error('Failed to decode token');
                return false;
            }

            localStorage.setItem('userRole', decodedToken.Roles);
            return decodedToken.Roles === 'Admin';
        } catch (error) {
            console.error('Error checking admin role:', error);
            return false;
        }
    };

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    };

    const validatePassword = (password) => {
        const validation = {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            hasMinLength: password.length >= 8
        };
        setPasswordValidation(validation);
    };

    const isPasswordValid = () => {
        return Object.values(passwordValidation).every(condition => condition);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Real-time password validation
        if (name === 'password') {
            validatePassword(value);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Enhanced password validation for login
        if (!isPasswordValid()) {
            toast.error('Password must meet all security requirements');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const deviceId = getDeviceId();

        const requestData = {
            email: formData.email.trim(),
            password: formData.password.trim()
        };

        const requestHeaders = {
            'deviceId': deviceId,
            'Content-Type': 'application/json'
        };

        try {
            const response = await apiClient.post('/user-open/login', requestData, {
                headers: requestHeaders
            });

            if (response.data && response.status === 200) {
                toast.success('Login successful!');

                if (response.data.data.token) {
                    localStorage.setItem('authToken', response.data.data.token);
                }
                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }

                if (response.data.data.user) {
                    const userData = response.data.data.user;

                    console.log('Login Response User Data:', userData);

                    localStorage.setItem('userData', JSON.stringify(userData));

                    const userId = userData.userId || userData.id || userData.user_id || userData.ID;
                    if (userId) {
                        localStorage.setItem('userId', userId.toString());
                        console.log('Stored User ID:', userId);
                    } else {
                        console.warn('No userId found in user data:', userData);
                    }
                }

                const token = localStorage.getItem('authToken');

                const decodedToken = decodeJWT(token);
                if (decodedToken) {
                    console.log('Decoded Token:', decodedToken);

                    const tokenUserId = decodedToken.userId || decodedToken.id || decodedToken.user_id || decodedToken.sub;
                    if (tokenUserId && !localStorage.getItem('userId')) {
                        localStorage.setItem('userId', tokenUserId.toString());
                        console.log('Stored User ID from token:', tokenUserId);
                    }
                }

                checkAdminRole(token);

                // Clear form and reset validation
                setFormData({
                    email: '',
                    password: ''
                });
                setPasswordValidation({
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumber: false,
                    hasSpecial: false,
                    hasMinLength: false
                });

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
                    toast.error(message);
                } else if (status === 401) {
                    toast.error(message || 'Invalid email or password');
                } else if (status === 404) {
                    toast.error(message || 'User not found');
                } else if (status === 422) {
                    toast.error(message || 'Please check your input and try again');
                } else if (status >= 500) {
                    toast.error('Server error. Please try again later');
                } else {
                    toast.error(message);
                }
            } else if (error.request) {
                toast.error('Network error. Please check your connection');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            <WelcomeComponent />

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
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '48px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    disabled={isLoading}
                                    className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed"
                                    style={{ paddingRight: '16px' }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>

                            {/* Password Validation Indicators - Only show when password is being typed */}
                            {formData.password && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</div>
                                    <div className="space-y-1">
                                        <div className={`flex items-center text-xs ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`mr-2 ${passwordValidation.hasMinLength ? '✓' : '○'}`}>
                                                {passwordValidation.hasMinLength ? '✓' : '○'}
                                            </span>
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`mr-2 ${passwordValidation.hasUppercase ? '✓' : '○'}`}>
                                                {passwordValidation.hasUppercase ? '✓' : '○'}
                                            </span>
                                            One uppercase letter (A-Z)
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`mr-2 ${passwordValidation.hasLowercase ? '✓' : '○'}`}>
                                                {passwordValidation.hasLowercase ? '✓' : '○'}
                                            </span>
                                            One lowercase letter (a-z)
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`mr-2 ${passwordValidation.hasNumber ? '✓' : '○'}`}>
                                                {passwordValidation.hasNumber ? '✓' : '○'}
                                            </span>
                                            One number (0-9)
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`mr-2 ${passwordValidation.hasSpecial ? '✓' : '○'}`}>
                                                {passwordValidation.hasSpecial ? '✓' : '○'}
                                            </span>
                                            One special character (!@#$%^&*)
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-[#5E48EF] transition-colors bg-transparent border-none cursor-pointer"
                                    style={{ fontSize: '14px' }}
                                >
                                    Forgot Password?
                                </Link>
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