import React, { useState, useEffect, useRef } from 'react';
import WelcomeComponent from '../../components/auth/WelcomeComponent';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Users, Building, Lock, CheckCircle, Eye, EyeOff, ChevronDown } from 'lucide-react';

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

    const [organizations, setOrganizations] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        hasMinLength: false
    });

    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
    const [orgSearchTerm, setOrgSearchTerm] = useState('');
    const [batchSearchTerm, setBatchSearchTerm] = useState('');

    const orgDropdownRef = useRef(null);
    const batchDropdownRef = useRef(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
                setOrgDropdownOpen(false);
            }
            if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target)) {
                setBatchDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchOrganizations = async () => {
        setIsLoadingOrgs(true);
        try {
            const response = await apiClient.get('/user-open/getAllOrganization');
            if (response.data && response.data.success && response.data.data) {
                setOrganizations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to load organizations');
        } finally {
            setIsLoadingOrgs(false);
        }
    };

    const fetchBatches = async (organizationName) => {
        setIsLoadingBatches(true);
        setBatches([]);
        setFormData(prev => ({ ...prev, batch: '' }));
        setBatchSearchTerm('');
        try {
            const response = await apiClient.post('/user-open/getAllBatchByOrganization', {
                organization: organizationName
            });
            if (response.data && response.data.success && response.data.data) {
                setBatches(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            toast.error('Failed to load batches');
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const handleOrgSelect = (org) => {
        setFormData(prev => ({ ...prev, orgCode: org.name }));
        setOrgSearchTerm(org.name);
        setOrgDropdownOpen(false);
        fetchBatches(org.name);
    };

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, batch: batch.name }));
        setBatchSearchTerm(batch.name);
        setBatchDropdownOpen(false);
    };

    const filteredOrganizations = organizations.filter(org =>
        org.name.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
        org.description.toLowerCase().includes(orgSearchTerm.toLowerCase())
    );

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
        batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'number') {
            const numericValue = value.replace(/\D/g, '');
            setFormData({
                ...formData,
                [name]: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        if (name === 'password') {
            validatePassword(value);
        }
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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

        if (!formData.orgCode.trim()) {
            toast.error('Please select an organization');
            return false;
        }

        if (!formData.batch.trim()) {
            toast.error('Please select a batch');
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

        if (!isPasswordValid()) {
            toast.error('Password must meet all security requirements');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
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

            if (response.data && (response.status === 200 || response.status === 201)) {
                toast.success('Email is sent Please activate your account');

                setFormData({
                    name: '',
                    number: '',
                    email: '',
                    batch: '',
                    orgCode: '',
                    password: '',
                    confirmPassword: ''
                });

                setOrgSearchTerm('');
                setBatchSearchTerm('');
                setBatches([]);

                setPasswordValidation({
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumber: false,
                    hasSpecial: false,
                    hasMinLength: false
                });

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

                switch (status) {
                    case 400:
                        toast.error(errorMessage);
                        break;
                    case 401:
                        toast.error(errorMessage);
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
                console.log('Network error:', error.request);
                toast.error('Network error. Please check your internet connection and try again.');
            } else {
                console.log('Other error:', error.message);
                toast.error('An unexpected error occurred. Please try again.');
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
                            REGISTER
                        </h1>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                                    inputMode="numeric"
                                    pattern="[0-9]*"
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

                            <div className="relative" ref={orgDropdownRef}>
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px', zIndex: 10 }}>
                                    <Building className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Organization"
                                    value={orgSearchTerm}
                                    onChange={(e) => setOrgSearchTerm(e.target.value)}
                                    onFocus={() => setOrgDropdownOpen(true)}
                                    disabled={isLoading || isLoadingOrgs}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '48px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '16px' }}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                                {orgDropdownOpen && (
                                    <div className="absolute w-full !mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                        {isLoadingOrgs ? (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                Loading organizations...
                                            </div>
                                        ) : filteredOrganizations.length > 0 ? (
                                            filteredOrganizations.map((org) => (
                                                <div
                                                    key={org.id}
                                                    onClick={() => handleOrgSelect(org)}
                                                    className="!px-4 !py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-medium text-gray-900">{org.name}</div>
                                                    <div className="text-sm text-gray-500">{org.description}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                No organizations found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={batchDropdownRef}>
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px', zIndex: 10 }}>
                                    <Users className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Batch"
                                    value={batchSearchTerm}
                                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                                    onFocus={() => setBatchDropdownOpen(true)}
                                    disabled={isLoading || isLoadingBatches || !formData.orgCode}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '48px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        fontSize: '16px'
                                    }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '16px' }}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                                {batchDropdownOpen && formData.orgCode && (
                                    <div className="absolute w-full !mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                        {isLoadingBatches ? (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                Loading batches...
                                            </div>
                                        ) : filteredBatches.length > 0 ? (
                                            filteredBatches.map((batch) => (
                                                <div
                                                    key={batch.id}
                                                    onClick={() => handleBatchSelect(batch)}
                                                    className="!px-4 !py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-medium text-gray-900">{batch.name}</div>
                                                    <div className="text-sm text-gray-500">{batch.description}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                No batches found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

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
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
                                    className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{ paddingRight: '16px' }}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>

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

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center" style={{ paddingLeft: '16px' }}>
                                    <CheckCircle className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
                                    onClick={toggleConfirmPasswordVisibility}
                                    disabled={isLoading}
                                    className="absolute inset-y-0 right-0 flex items-center bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{ paddingRight: '16px' }}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>

                            {formData.confirmPassword && (
                                <div className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </div>
                            )}

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