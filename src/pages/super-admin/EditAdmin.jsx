import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import apiClient from '../../api/axiosConfig';
import SuperAdminSidebarComponent from '../../components/AdminSidebarComponent';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-green-600 text-xl font-bold !mb-3">{title}</h2>
                    <p className="text-gray-800 !mb-6">{message}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer"
                        >
                            {cancelText || 'Cancel'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer"
                        >
                            {confirmText || 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const adminData = location.state?.admin;

    const [form, setForm] = useState({
        id: '',
        name: '',
        email: '',
        mobile: '',
        orgCode: '',
        isActive: false,
        isAdmin: true,
    });

    const [organizations, setOrganizations] = useState([]);
    const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showBackDialog, setShowBackDialog] = useState(false);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [orgSearchTerm, setOrgSearchTerm] = useState('');
    const orgDropdownRef = useRef(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (adminData) {
            setForm({
                id: adminData.id || '',
                name: adminData.name || '',
                email: adminData.email || '',
                mobile: adminData.mobile || '',
                orgCode: adminData.orgCode || '',
                isActive: adminData.isActive || false,
                isAdmin: true,
            });
            setOrgSearchTerm(adminData.orgCode || '');
            setInitialLoading(false);
        } else if (id) {
            fetchAdminData(id);
        } else {
            navigate('/home', { state: { activeTab: 'Create Admin' } });
        }
    }, [adminData, id, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
                setOrgDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const fetchAdminData = async (adminId) => {
        try {
            setInitialLoading(true);
            const response = await apiClient.get(`/admin-secured/getUser/${adminId}`);

            if (response.data.success) {
                const data = response.data.data;
                setForm({
                    id: data.id || '',
                    name: data.name || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    orgCode: data.orgCode || '',
                    isActive: data.isActive || false,
                    isAdmin: true,
                });
                setOrgSearchTerm(data.orgCode || '');
            } else {
                toast.error('Failed to fetch admin data');
                navigate('/home', { state: { activeTab: 'Create Admin' } });
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to fetch admin data');
            navigate('/home', { state: { activeTab: 'Create Admin' } });
        } finally {
            setInitialLoading(false);
        }
    };

    const handleOrgSelect = (org) => {
        setForm(prev => ({ ...prev, orgCode: org.name }));
        setOrgSearchTerm(org.name);
        setOrgDropdownOpen(false);
    };

    const filteredOrganizations = organizations.filter(org =>
        org.name.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
        (org.description && org.description.toLowerCase().includes(orgSearchTerm.toLowerCase()))
    );

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSwitch = (field) => {
        setForm({ ...form, [field]: !form[field] });
    };

    const handleBackClick = () => {
        setShowBackDialog(true);
    };

    const confirmBack = () => {
        setShowBackDialog(false);
        navigate('/home', { state: { activeTab: 'Create Admin' } });
    };

    const handleSidebarTabChange = (newTab) => {
        navigate('/home', {
            state: { activeTab: newTab },
            replace: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!form.email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!form.mobile.trim()) {
            toast.error('Mobile number is required');
            return;
        }
        if (!form.orgCode.trim()) {
            toast.error('Organization is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(form.mobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);

            const requestBody = {
                id: form.id,
                name: form.name.trim(),
                email: form.email.trim(),
                mobile: form.mobile.trim(),
                batch: form.orgCode.trim(),
                isActive: form.isActive,
                isAdmin: true
            };

            const response = await apiClient.post('/superAdmin/updtaeUser', requestBody);

            if (response.data.success) {
                toast.success('Admin updated successfully!');
                setTimeout(() => {
                    navigate('/home', { state: { activeTab: 'Create Admin' } });
                }, 1500);
            } else {
                throw new Error(response.data.message || 'Failed to update admin');
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update admin. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderComponent />
                <div className="flex flex-1 overflow-hidden">
                    <SuperAdminSidebarComponent activeTab="Create Admin" setActiveTab={handleSidebarTabChange} />
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                        <div className="text-[#7966F1] text-lg font-semibold">
                            Loading Admin Data...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />

            <div className="flex flex-1 overflow-hidden">
                <SuperAdminSidebarComponent activeTab="Create Admin" setActiveTab={handleSidebarTabChange} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <ArrowLeft
                            className="cursor-pointer text-white"
                            size={20}
                            onClick={handleBackClick}
                        />
                        <h2 className="text-lg font-semibold">Edit Admin Details</h2>
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
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter full name"
                                        required
                                    />
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
                                            value={form.mobile}
                                            onChange={handleChange}
                                            className="flex-1 border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                            placeholder="Phone Number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">Organization <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={orgDropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Search Organization"
                                            value={orgSearchTerm}
                                            onChange={(e) => setOrgSearchTerm(e.target.value)}
                                            onFocus={() => setOrgDropdownOpen(true)}
                                            disabled={loading || isLoadingOrganizations}
                                            className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !pr-10 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '12px', pointerEvents: 'none' }}>
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                        {orgDropdownOpen && (
                                            <div className="absolute w-full !mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                                {isLoadingOrganizations ? (
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
                                                            {org.description && <div className="text-sm text-gray-500">{org.description}</div>}
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
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 !mb-8">
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-700 font-medium">Is Active?</label>
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={() => toggleSwitch('isActive')}
                                        className="w-5 h-5 accent-[#7966F1] cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                >
                                    {loading && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showBackDialog}
                onClose={() => setShowBackDialog(false)}
                onConfirm={confirmBack}
                title="Go Back?"
                message="Are you sure you want to go back? Any unsaved changes will be lost."
                confirmText="Yes, Go Back"
                cancelText="Cancel"
            />
        </div>
    );
};

export default EditAdmin;