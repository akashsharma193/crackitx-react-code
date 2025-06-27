import React, { useState } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Users, Building, Lock, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        email: '',
        batch: '',
        orgCode: '',
        password: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }

        if (!formData.number.trim()) {
            toast.error('Please enter your mobile number');
            return false;
        }

        if (!formData.email.trim()) {
            toast.error('Please enter your email');
            return false;
        }

        if (!formData.batch.trim()) {
            toast.error('Please enter your batch');
            return false;
        }

        if (!formData.orgCode.trim()) {
            toast.error('Please enter organization code');
            return false;
        }

        if (!formData.password) {
            toast.error('Please enter a password');
            return false;
        }

        if (!formData.confirmPassword) {
            toast.error('Please confirm your password');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.number)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const registrationData = {
                name: formData.name.trim(),
                mobile: formData.number.trim(),
                email: formData.email.trim().toLowerCase(),
                batch: formData.batch.trim(),
                password: formData.password,
                orgCode: formData.orgCode.trim()
            };

            console.log('Sending registration data:', { ...registrationData, password: '[HIDDEN]' });

            const response = await apiClient.post('/user-open/registration', registrationData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000,
                retry: 3,
                retryDelay: 1000
            });

            console.log('Registration response:', response);

            // Check for successful response
            if (response.data && (response.status === 200 || response.status === 201)) {
                toast.success('Registration successful! Please login to continue.');

                // Clear form
                setFormData({
                    name: '',
                    number: '',
                    email: '',
                    batch: '',
                    orgCode: '',
                    password: '',
                    confirmPassword: ''
                });

                // Navigate after a short delay
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
            } else {
                toast.error('Unexpected response from server. Please try again.');
            }

        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 'ECONNABORTED') {
                toast.error('Request timeout. Please check your connection and try again.');
            } else if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                console.log('Error response:', { status, data });

                let errorMessage = 'Registration failed';

                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data?.message) {
                    errorMessage = data.message;
                } else if (data?.error) {
                    errorMessage = data.error;
                } else if (data?.detail) {
                    errorMessage = data.detail;
                } else if (data?.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(', ');
                }

                // Handle specific status codes
                switch (status) {
                    case 400:
                        toast.error(errorMessage || 'Bad request. Please check your input.');
                        break;
                    case 401:
                        toast.error('Unauthorized. Please check your credentials.');
                        break;
                    case 403:
                        toast.error('Access forbidden. Please check your organization code.');
                        break;
                    case 409:
                        toast.error('User already exists with this email or mobile number.');
                        break;
                    case 422:
                        toast.error(errorMessage || 'Please check your input and try again.');
                        break;
                    case 429:
                        toast.error('Too many requests. Please wait and try again later.');
                        break;
                    case 500:
                        toast.error('Server error. Please try again later.');
                        break;
                    case 502:
                        toast.error('Bad gateway. Server is temporarily unavailable.');
                        break;
                    case 503:
                        toast.error('Service unavailable. Please try again later.');
                        break;
                    case 504:
                        toast.error('Gateway timeout. Please try again.');
                        break;
                    default:
                        toast.error(errorMessage || `Server error (${status}). Please try again.`);
                }
            } else if (error.request) {
                // Network error
                console.log('Network error:', error.request);
                toast.error('Network error. Please check your internet connection and try again.');
            } else {
                // Other errors
                console.log('Other error:', error.message);
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Welcome Section */}
            <WelcomeComponent />

            {/* Registration Form */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center" style={{ padding: '64px' }}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl" style={{ padding: '48px 40px' }}>
                        <h1 className="text-xl font-bold text-gray-900 text-center" style={{ marginBottom: '40px' }}>
                            REGISTER
                        </h1>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Name Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
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

                            {/* Mobile Number Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Phone className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="number"
                                    placeholder="Mobile Number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    maxLength="10"
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

                            {/* Email Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
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

                            {/* Batch Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Users className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="batch"
                                    placeholder="Batch"
                                    value={formData.batch}
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

                            {/* Organization Code Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Building className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="orgCode"
                                    placeholder="Organization Code"
                                    value={formData.orgCode}
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

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <CheckCircle className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
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

                            {/* Register Button */}
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
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </button>

                            {/* Login Link */}
                            <div className="text-center">
                                <span className="text-gray-600" style={{ fontSize: '14px' }}>
                                    Already have an account?{' '}
                                </span>
                                <Link to='/' 
                                    className="text-gray-900 font-semibold hover:text-[#5E48EF] transition-colors bg-transparent border-none cursor-pointer"
                                    style={{ fontSize: '14px' }}
                                >
                                    Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;