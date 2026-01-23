import React, { useState } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { Mail, Lock, LockOpen, Eye, EyeOff } from 'lucide-react';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        tempPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isResetLoading, setIsResetLoading] = useState(false);
    const [tempSent, setTempSent] = useState(false);
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        hasMinLength: false
    });

    const validateEmail = (email) => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const validatePassword = (password) => {
        const validation = {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasMinLength: password.length >= 8
        };
        setPasswordValidation(validation);
        return validation;
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

        if (name === 'newPassword') {
            validatePassword(value);
        }
    };

    const sendTempPassword = async () => {
        const email = formData.email.trim();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiClient.post('/user-open/sendTempPassword', {
                id: email
            });

            if (response.data && response.status === 200) {
                setTempSent(true);
                toast.success('Temporary password sent. Check your email.');
            }
        } catch (error) {
            console.error('Send temp password error:', error);

            if (error.response) {
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    'Failed to send temporary password';
                toast.error(message);
            } else if (error.request) {
                toast.error('Network error. Please check your connection');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        const { email, tempPassword, newPassword, confirmPassword } = formData;

        if (!email.trim() || !tempPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!isPasswordValid()) {
            toast.error('Password must meet all security requirements');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        setIsResetLoading(true);

        try {
            const response = await apiClient.post('/user-open/resetPassword', {
                email: email.trim(),
                tempPassword: tempPassword.trim(),
                password: newPassword.trim()
            });

            if (response.data && response.status === 200) {
                toast.success('Password reset successfully');
                setTempSent(false);
                setFormData({
                    email: '',
                    tempPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setPasswordValidation({
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumber: false,
                    hasSpecial: false,
                    hasMinLength: false
                });
                navigate('/login');
            }
        } catch (error) {
            console.error('Reset password error:', error);

            if (error.response) {
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    'Failed to reset password';
                toast.error(message);
            } else if (error.request) {
                toast.error('Network error. Please check your connection');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsResetLoading(false);
        }
    };

    const resendTempPassword = () => {
        setTempSent(false);
        setFormData(prev => ({
            ...prev,
            tempPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));
        setPasswordValidation({
            hasUppercase: false,
            hasLowercase: false,
            hasNumber: false,
            hasSpecial: false,
            hasMinLength: false
        });
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            <WelcomeComponent />

            <div className="flex-1 bg-gray-50 flex items-center justify-center" style={{ padding: '64px' }}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl" style={{ padding: '48px 40px' }}>
                        <h1 className="text-xl font-bold text-gray-900 text-center" style={{ marginBottom: '40px' }}>
                            FORGOT PASSWORD
                        </h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <Mail className="w-5 h-5 text-[#7460F1]" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading || tempSent}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7460F1] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '16px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={sendTempPassword}
                                disabled={isLoading || tempSent}
                                className="w-full rounded-xl text-white font-semibold transition-all hover:opacity-90 focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: tempSent ? '#9ca3af' : 'linear-gradient(135deg, #735FF1 0%, #624CEF 100%)',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    fontSize: '16px'
                                }}
                            >
                                {isLoading ? 'Sending...' : tempSent ? 'Temporary Password Sent' : 'Send Temporary Password'}
                            </button>

                            {tempSent && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                            <LockOpen className="w-5 h-5 text-[#7460F1]" />
                                        </div>
                                        <input
                                            type={showTempPassword ? "text" : "password"}
                                            name="tempPassword"
                                            placeholder="Temporary Password"
                                            value={formData.tempPassword}
                                            onChange={handleInputChange}
                                            disabled={isResetLoading}
                                            className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7460F1] focus:bg-white transition-all disabled:cursor-not-allowed"
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
                                            onClick={() => setShowTempPassword(!showTempPassword)}
                                            disabled={isResetLoading}
                                            className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed"
                                            style={{ paddingRight: '16px' }}
                                        >
                                            {showTempPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                            <Lock className="w-5 h-5 text-[#7460F1]" />
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="New Password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            disabled={isResetLoading}
                                            className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7460F1] focus:bg-white transition-all disabled:cursor-not-allowed"
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
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            disabled={isResetLoading}
                                            className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed"
                                            style={{ paddingRight: '16px' }}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                            <Lock className="w-5 h-5 text-[#7460F1]" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={isResetLoading}
                                            className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7460F1] focus:bg-white transition-all disabled:cursor-not-allowed"
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isResetLoading}
                                            className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed"
                                            style={{ paddingRight: '16px' }}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                            )}
                                        </button>
                                    </div>

                                    {formData.newPassword && (
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

                                    <button
                                        type="button"
                                        onClick={resetPassword}
                                        disabled={!tempSent || isResetLoading}
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
                                        {isResetLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={resendTempPassword}
                                            disabled={isResetLoading}
                                            className="text-[#7460F1] transition-colors bg-transparent border-none cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                            style={{ fontSize: '14px' }}
                                        >
                                            Resend Temporary Password
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="text-center">
                                <span className="text-gray-600" style={{ fontSize: '14px' }}>
                                    Remember your password?{' '}
                                </span>
                                <Link to="/login"
                                    className="text-gray-900 font-semibold hover:text-[#7460F1] transition-colors bg-transparent border-none cursor-pointer"
                                    style={{ fontSize: '14px' }}
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;