import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';
import apiClient from '../../api/axiosConfig';

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

const EditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const studentData = location.state?.student;

    const [form, setForm] = useState({
        id: '',
        name: '',
        email: '',
        mobile: '',
        batch: '',
        isActive: false,
        isAdmin: false,
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showBackDialog, setShowBackDialog] = useState(false);

    useEffect(() => {
        if (studentData) {
            setForm({
                id: studentData.id || '',
                name: studentData.name || '',
                email: studentData.email || '',
                mobile: studentData.mobile || '',
                batch: studentData.batch || '',
                isActive: studentData.isActive || false,
                isAdmin: studentData.isAdmin || false,
            });
            setInitialLoading(false);
        } else if (id) {
            fetchStudentData(id);
        } else {
            navigate('/home', { state: { activeTab: 'Students' } });
        }
    }, [studentData, id, navigate]);

    const fetchStudentData = async (studentId) => {
        try {
            setInitialLoading(true);
            const response = await apiClient.get(`/admin-secured/getUser/${studentId}`);

            if (response.data.success) {
                const data = response.data.data;
                setForm({
                    id: data.id || '',
                    name: data.name || '',
                    email: data.email || '',
                    mobile: data.mobile || '',
                    batch: data.batch || '',
                    isActive: data.isActive || false,
                    isAdmin: data.isAdmin || false,
                });
            } else {
                toast.error('Failed to fetch student data');
                navigate('/home', { state: { activeTab: 'Students' } });
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            toast.error('Failed to fetch student data');
            navigate('/home', { state: { activeTab: 'Students' } });
        } finally {
            setInitialLoading(false);
        }
    };

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
        navigate('/home', { state: { activeTab: 'Students' } });
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
        if (!form.batch.trim()) {
            toast.error('Batch is required');
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
                batch: form.batch.trim(),
                isActive: form.isActive,
                isAdmin: form.isAdmin
            };

            const response = await apiClient.post('/admin-secured/updtaeUser', requestBody);

            if (response.data.success) {
                toast.success('User updated successfully!');
                setTimeout(() => {
                    navigate('/home', { state: { activeTab: 'Students' } });
                }, 1500);
            } else {
                throw new Error(response.data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update user. Please try again.');
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
                    <SidebarComponent activeTab="Students" setActiveTab={() => { }} />
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                        <div className="text-[#7966F1] text-lg font-semibold">
                            Loading Student Data...
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
                <SidebarComponent activeTab="Students" setActiveTab={() => { }} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <ArrowLeft
                            className="cursor-pointer text-white"
                            size={20}
                            onClick={handleBackClick}
                        />
                        <h2 className="text-lg font-semibold">Edit User Details</h2>
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
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                        Batch <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={form.batch}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter batch name"
                                        required
                                    />
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
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-700 font-medium">Is Admin?</label>
                                    <input
                                        type="checkbox"
                                        checked={form.isAdmin}
                                        onChange={() => toggleSwitch('isAdmin')}
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

export default EditStudent;