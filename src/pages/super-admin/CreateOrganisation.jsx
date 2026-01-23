import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CreateOrganization = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        examHistory: false,
        examStrat: false,
        examComplete: false,
        bannerOngointTest: false
    });
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        setIsLoadingOrganizations(true);
        try {
            const response = await apiClient.get('/user-open/getAllOrganization');
            if (response.data && response.data.success && response.data.data) {
                setOrganizations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to load organizations');
        } finally {
            setIsLoadingOrganizations(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSwitchChange = (name) => {
        setFormData(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const requestBody = {
                name: formData.name,
                description: formData.description,
                examHistory: formData.examHistory,
                examStrat: formData.examStrat,
                examComplete: formData.examComplete,
                bannerOngointTest: formData.bannerOngointTest
            };

            const response = await apiClient.post('/organization/createOrganization', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Organization created successfully!');

                setFormData({
                    name: '',
                    description: '',
                    examHistory: false,
                    examStrat: false,
                    examComplete: false,
                    bannerOngointTest: false
                });

                fetchOrganizations();
            }
        } catch (error) {
            console.error('Error creating organization:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'An error occurred while creating the organization';
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
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <h2 className="text-lg font-semibold">Create Organization</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <div className="w-full max-w-6xl space-y-6">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">Organization Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                            Organization Name <span className="text-red-500">*</span>
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
                                            placeholder="Enter organization name"
                                            disabled={loading}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs !mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className={`w-full border rounded-md !px-4 !py-2 outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${errors.description
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                            placeholder="Enter organization description"
                                            rows={4}
                                            disabled={loading}
                                        />
                                        {errors.description && <p className="text-red-500 text-xs !mt-1">{errors.description}</p>}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 !mb-4">Configuration</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                    <div className="flex items-center justify-between border border-gray-200 rounded-md !px-4 !py-3">
                                        <label className="text-sm text-gray-700 font-medium">
                                            Exam History
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchChange('examHistory')}
                                            disabled={loading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.examHistory ? 'bg-[#7966F1]' : 'bg-gray-300'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.examHistory ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between border border-gray-200 rounded-md !px-4 !py-3">
                                        <label className="text-sm text-gray-700 font-medium">
                                            Exam Start
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchChange('examStrat')}
                                            disabled={loading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.examStrat ? 'bg-[#7966F1]' : 'bg-gray-300'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.examStrat ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between border border-gray-200 rounded-md !px-4 !py-3">
                                        <label className="text-sm text-gray-700 font-medium">
                                            Exam Complete
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchChange('examComplete')}
                                            disabled={loading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.examComplete ? 'bg-[#7966F1]' : 'bg-gray-300'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.examComplete ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between border border-gray-200 rounded-md !px-4 !py-3">
                                        <label className="text-sm text-gray-700 font-medium">
                                            Banner Ongoing Test
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleSwitchChange('bannerOngointTest')}
                                            disabled={loading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.bannerOngointTest ? 'bg-[#7966F1]' : 'bg-gray-300'
                                                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.bannerOngointTest ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
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
                                        {loading ? 'Creating...' : 'Create Organization'}
                                    </button>
                                </div>
                            </form>

                            <div className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10 !mt-4">
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">Existing Organizations</h3>

                                {isLoadingOrganizations ? (
                                    <div className="text-center !py-8 text-gray-500">
                                        Loading organizations...
                                    </div>
                                ) : organizations.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Name</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Description</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Exam History</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Exam Start</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Exam Complete</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Banner Test</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {organizations.map((org) => (
                                                    <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="!px-4 !py-3 text-sm text-gray-800">{org.name}</td>
                                                        <td className="!px-4 !py-3 text-sm text-gray-600">{org.description}</td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${org.examHistory
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {org.examHistory ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${org.examStrat
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {org.examStrat ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${org.examComplete
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {org.examComplete ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${org.bannerOngointTest
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {org.bannerOngointTest ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${org.isActive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {org.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center !py-8 text-gray-500">
                                        No organizations found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrganization;