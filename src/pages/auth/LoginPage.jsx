import React, { useState } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/home');
        console.log('Login attempt:', formData);
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Username Field */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all"
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
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all"
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
                                    className="text-[#5E48EF] transition-colors bg-transparent border-none cursor-pointer"
                                    style={{ fontSize: '14px' }}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full rounded-xl text-white font-semibold transition-all hover:opacity-90 focus:outline-none cursor-pointer"
                                style={{
                                    background: 'linear-gradient(135deg, #735FF1 0%, #624CEF 100%)',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    fontSize: '16px'
                                }}
                            >
                                Login
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;