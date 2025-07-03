import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1); // Go back to previous screen
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get orgCode from localStorage
            const orgCode = localStorage.getItem('orgCode');

            if (!orgCode) {
                toast.error('Organization code not found. Please login again.');
                setLoading(false);
                return;
            }

            // Prepare the request body
            const requestBody = {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                batch: formData.batch,
                password: formData.password,
                orgCode: orgCode,
                isAdmin: formData.isAdmin
            };

            // Make API call
            const response = await apiClient.post('/admin-secured/registration', requestBody);

            // Handle success
            if (response.status === 200 || response.status === 201) {
                toast.success('Student created successfully!');

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    batch: '',
                    password: '',
                    isAdmin: false
                });

                // Optional: Navigate back after successful creation
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    'Failed to create student';
                toast.error(errorMessage);
            } else if (error.request) {
                // Network error
                toast.error('Network error. Please check your connection and try again.');
            } else {
                // Other errors
                toast.error('An unexpected error occurred. Please try again.');
            }
            console.error('Error creating student:', error);
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
                    {/* Top Title Bar */}
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <ArrowLeft
                            className="cursor-pointer text-white"
                            size={20}
                            onClick={handleBack}
                        />
                        <h2 className="text-lg font-semibold">Create Student</h2>
                    </div>

                    {/* Centered Card */}
                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white border border-[#d9d9f3] rounded-xl shadow-md w-full max-w-4xl !px-8 !py-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter full name"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter email address"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Phone with Code */}
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
                                            className="flex-1 border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                            placeholder="Phone Number"
                                            maxLength="10"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Batch */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Batch <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleInputChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter batch name"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter password"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Is Admin */}
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

                            {/* Submit */}
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