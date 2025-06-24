import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const EditStudent = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: 'Xyz Abcdef',
        email: 'xyz@gmail.com',
        phone: '9835475170',
        batch: 'Contentive',
        countryCode: '+91',
        isActive: false,
        isAdmin: false,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSwitch = (field) => {
        setForm({ ...form, [field]: !form[field] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Data:', form);
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
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none"
                                    />
                                </div>

                                {/* Phone with Code */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">Phone</label>
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
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="flex-1 border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none"
                                    />
                                </div>

                                {/* Batch */}
                                <div>
                                    <label className="block text-sm text-gray-700 !mb-1 font-medium">Batch</label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={form.batch}
                                        onChange={handleChange}
                                        className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none"
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
                                    className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md hover:opacity-90 transition-all"
                                >
                                    Save Changes
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