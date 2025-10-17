import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import SuperAdminSidebarComponent from '../../components/AdminSidebarComponent';
import apiClient from '../../api/axiosConfig';

const SendNotification = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        orgCode: '',
        batchCode: '',
        title: '',
        body: ''
    });
    const [organizations, setOrganizations] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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
            toast.error(error.response?.data?.message || 'Failed to load organizations');
        } finally {
            setIsLoadingOrgs(false);
        }
    };

    const fetchBatches = async (organizationCode) => {
        setIsLoadingBatches(true);
        try {
            const response = await apiClient.post('/user-open/getAllBatchByOrganization', {
                organization: organizationCode
            });
            if (response.data && response.data.success && response.data.data) {
                setBatches(response.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load batches');
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const handleOrgSelect = (org) => {
        setFormData(prev => ({ ...prev, orgCode: org.code, batchCode: '' }));
        setOrgSearchTerm(org.name);
        setBatchSearchTerm('');
        setOrgDropdownOpen(false);
        fetchBatches(org.code);
        if (errors.orgCode) {
            setErrors(prev => ({ ...prev, orgCode: '' }));
        }
    };

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, batchCode: batch.name }));
        setBatchSearchTerm(batch.name);
        setBatchDropdownOpen(false);
        if (errors.batchCode) {
            setErrors(prev => ({ ...prev, batchCode: '' }));
        }
    };

    const filteredOrganizations = organizations.filter(org =>
        org?.name?.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
        org?.code?.toLowerCase().includes(orgSearchTerm.toLowerCase())
    );

    const filteredBatches = batches.filter(batch =>
        batch?.name?.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
        (batch?.description && batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase()))
    );

    const validateForm = () => {
        const newErrors = {};

        if (!formData.orgCode.trim()) {
            newErrors.orgCode = 'Organization is required';
        }

        if (!formData.batchCode.trim()) {
            newErrors.batchCode = 'Batch is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.body.trim()) {
            newErrors.body = 'Message body is required';
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
                orgCode: formData.orgCode,
                batchCode: formData.batchCode,
                title: formData.title,
                body: formData.body
            };

            const response = await apiClient.post('/pushNotification/sendNotification', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Notification sent successfully!');

                setFormData({
                    orgCode: '',
                    batchCode: '',
                    title: '',
                    body: ''
                });
                setOrgSearchTerm('');
                setBatchSearchTerm('');
                setBatches([]);

                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'An error occurred while sending notification';
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

    const handleSidebarTabChange = (newTab) => {
        navigate('/home', {
            state: { activeTab: newTab },
            replace: false
        });
    };

    return (
        <div className="min-h-screen flex flex-col">

            <div className="flex flex-1 overflow-hidden">

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <h2 className="text-lg font-semibold">Send Notification</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white border border-[#d9d9f3] rounded-xl shadow-md w-full max-w-4xl !px-8 !py-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Organization <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={orgDropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Search Organization"
                                            value={orgSearchTerm}
                                            onChange={(e) => setOrgSearchTerm(e.target.value)}
                                            onFocus={() => setOrgDropdownOpen(true)}
                                            disabled={loading || isLoadingOrgs}
                                            className={`w-full border rounded-md !px-4 !py-2 !pr-10 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.orgCode
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '12px', pointerEvents: 'none' }}>
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
                                                            <div className="text-sm text-gray-500">{org.code}</div>
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
                                    {errors.orgCode && <p className="text-red-500 text-xs !mt-1">{errors.orgCode}</p>}
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
                                            disabled={loading || isLoadingBatches || !formData.orgCode}
                                            className={`w-full border rounded-md !px-4 !py-2 !pr-10 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.batchCode
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                } ${!formData.orgCode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '12px', pointerEvents: 'none' }}>
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
                                                            <div className="font-medium text-gray-900">{batch.name || 'Unnamed Batch'}</div>
                                                            <div className="text-sm text-gray-500">{batch.description || 'No description'}</div>
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
                                    {errors.batchCode && <p className="text-red-500 text-xs !mt-1">{errors.batchCode}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full border rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-opacity-50 ${errors.title
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-[#7966F1] focus:ring-[#7966F1]'
                                            }`}
                                        placeholder="Enter notification title"
                                        disabled={loading}
                                    />
                                    {errors.title && <p className="text-red-500 text-xs !mt-1">{errors.title}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="body"
                                        value={formData.body}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className={`w-full border rounded-md !px-4 !py-2 outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${errors.body
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-[#7966F1] focus:ring-[#7966F1]'
                                            }`}
                                        placeholder="Enter notification message"
                                        disabled={loading}
                                    />
                                    {errors.body && <p className="text-red-500 text-xs !mt-1">{errors.body}</p>}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 ${loading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:opacity-90'
                                        }`}
                                >
                                    <Send size={18} />
                                    {loading ? 'Sending...' : 'Send Notification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendNotification;