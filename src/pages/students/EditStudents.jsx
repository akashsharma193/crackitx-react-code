import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';
import apiClient from '../../api/axiosConfig';

const EditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get student ID from URL params
    const location = useLocation();
    const studentData = location.state?.student; // Get student data from navigation state

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

    // Initialize form with student data
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

    // Fetch student data by ID (fallback if data not passed through navigation)
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Mobile validation (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(form.mobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);

            // Prepare request body with only necessary fields
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
                // Navigate back to students page after a short delay
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

    // Show loading spinner while fetching initial data
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
                    {/* Top Title Bar */}
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <ArrowLeft
                            className="cursor-pointer text-white"
                            size={20}
                            onClick={() => navigate('/home', { state: { activeTab: 'Students' } })}
                        />
                        <h2 className="text-lg font-semibold">Edit User Details</h2>
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
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                        placeholder="Enter full name"
                                        required
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
                                            value={form.mobile}
                                            onChange={handleChange}
                                            className="flex-1 border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                            placeholder="Phone Number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
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

                                {/* Batch */}
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

                            {/* Toggles */}
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

                            {/* Submit */}
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
        </div>
    );
};

export default EditStudent;