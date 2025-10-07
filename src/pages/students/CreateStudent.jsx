import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';
import apiClient from '../../api/axiosConfig';

const CreateStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        batch: '',
        password: '',
        isAdmin: false
    });
    const [batches, setBatches] = useState([]);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
    const [batchSearchTerm, setBatchSearchTerm] = useState('');
    const batchDropdownRef = useRef(null);

    useEffect(() => {
        const orgCode = localStorage.getItem('orgCode');
        if (orgCode) {
            fetchBatches(orgCode);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target)) {
                setBatchDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBatches = async (organizationName) => {
        setIsLoadingBatches(true);
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

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, batch: batch.name }));
        setBatchSearchTerm(batch.name);
        setBatchDropdownOpen(false);
        if (errors.batch) {
            setErrors(prev => ({
                ...prev,
                batch: ''
            }));
        }
    };

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
        batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase())
    );

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobile = (mobile) => {
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(mobile);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!validateMobile(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be exactly 10 digits';
        }

        if (!formData.batch.trim()) {
            newErrors.batch = 'Batch is required';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must contain at least 8 characters with one uppercase, one lowercase, one number, and one special character';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        navigate(-1);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'mobile') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const orgCode = localStorage.getItem('orgCode');

            if (!orgCode) {
                toast.error('Organization code not found. Please login again.');
                setLoading(false);
                return;
            }

            const requestBody = {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                batch: formData.batch,
                password: formData.password,
                orgCode: orgCode,
                isAdmin: formData.isAdmin
            };

            const response = await apiClient.post('/admin-secured/registration', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Student created successfully!');

                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    batch: '',
                    password: '',
                    isAdmin: false
                });
                setBatchSearchTerm('');

                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating student:', error);

            if (error.response) {
                const errorData = error.response.data;

                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'An error occurred while creating the student';

                console.log('API Error Response:', errorData);
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />

            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent activeTab="Students" setActiveTab={() => { }} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <ArrowLeft
                            className="cursor-pointer text-white"
                            size={20}
                            onClick={handleBack}
                        />
                        <h2 className="text-lg font-semibold">Create Student</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white border border-[#d9d9f3] rounded-xl shadow-md w-full max-w-4xl !px-8 !py-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-[#7966F1] focus:ring-[#7966F1]'
                                            }`}
                                        placeholder="Enter full name"
                                        disabled={loading}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs !mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-[#7966F1] focus:ring-[#7966F1]'
                                            }`}
                                        placeholder="Enter email address"
                                        disabled={loading}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value="+91"
                                            disabled
                                            className="w-[80px] border border-[#7966F1] rounded-md !px-2 !py-2 !h-[42px] text-gray-700 bg-gray-100 cursor-not-allowed"
                                            placeholder="+91"
                                        />
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            className={`flex-1 border rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.mobile
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                            placeholder="Phone Number"
                                            disabled={loading}
                                        />
                                    </div>
                                    {errors.mobile && <p className="text-red-500 text-xs !mt-1">{errors.mobile}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Batch <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={batchDropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Search Batch"
                                            value={batchSearchTerm}
                                            onChange={(e) => setBatchSearchTerm(e.target.value)}
                                            onFocus={() => setBatchDropdownOpen(true)}
                                            disabled={loading || isLoadingBatches}
                                            className={`w-full border rounded-md !px-4 !py-2 !pr-10 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.batch
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '12px', pointerEvents: 'none' }}>
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                        {batchDropdownOpen && (
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
                                    {errors.batch && <p className="text-red-500 text-xs mt-1">{errors.batch}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full border rounded-md !px-4 !py-2 !pr-12 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.password
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                            placeholder="Enter password"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div className="flex items-center justify-start !pt-6">
                                    <label className="text-gray-700 font-medium !mr-4">Is Admin?</label>
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 accent-[#7966F1] cursor-pointer"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer ${loading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:opacity-90'
                                        }`}
                                >
                                    {loading ? 'Creating...' : 'Create Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStudent;