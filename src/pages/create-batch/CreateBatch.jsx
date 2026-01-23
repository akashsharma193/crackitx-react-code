import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';
import apiClient from '../../api/axiosConfig';

const CreateBatch = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        organization: ''
    });
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const orgCode = localStorage.getItem('orgCode');
        if (orgCode) {
            setFormData(prev => ({ ...prev, organization: orgCode }));
        }
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        setIsLoadingBatches(true);
        try {
            const response = await apiClient.post('/user-open/getAllBatchByOrganization', {
                organization: localStorage.getItem('orgCode') || ''
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Batch name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.organization.trim()) {
            newErrors.organization = 'Organization is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        navigate(-1);
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
                organization: formData.organization
            };

            const response = await apiClient.post('/batch/createBatch', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Batch created successfully!');

                setFormData({
                    name: '',
                    description: '',
                    organization: localStorage.getItem('orgCode') || ''
                });

                fetchBatches();

                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating batch:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'An error occurred while creating the batch';
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
                        <h2 className="text-lg font-semibold">Create Batch</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <div className="w-full max-w-6xl space-y-6">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">Batch Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                            Batch Name <span className="text-red-500">*</span>
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
                                            placeholder="Enter batch name"
                                            disabled={loading}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs !mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                            Organization <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleInputChange}
                                            className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] text-gray-700 bg-gray-100 cursor-not-allowed"
                                            placeholder="Enter organization name"
                                            disabled={true}
                                        />
                                        {errors.organization && <p className="text-red-500 text-xs !mt-1">{errors.organization}</p>}
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
                                            placeholder="Enter batch description"
                                            rows={4}
                                            disabled={loading}
                                        />
                                        {errors.description && <p className="text-red-500 text-xs !mt-1">{errors.description}</p>}
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
                                        {loading ? 'Creating...' : 'Create Batch'}
                                    </button>
                                </div>
                            </form>

                            <div className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10 !mt-4">
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">Existing Batches</h3>

                                {isLoadingBatches ? (
                                    <div className="text-center !py-8 text-gray-500">
                                        Loading batches...
                                    </div>
                                ) : batches.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Name</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Description</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Organization</th>
                                                    <th className="text-left !px-4 !py-3 text-sm font-semibold text-gray-700">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {batches.map((batch) => (
                                                    <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="!px-4 !py-3 text-sm text-gray-800">{batch.name}</td>
                                                        <td className="!px-4 !py-3 text-sm text-gray-600">{batch.description}</td>
                                                        <td className="!px-4 !py-3 text-sm text-gray-600">{batch.organization}</td>
                                                        <td className="!px-4 !py-3">
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${batch.isActive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {batch.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center !py-8 text-gray-500">
                                        No batches found
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

export default CreateBatch;