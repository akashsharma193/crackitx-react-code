import React from 'react';
import { Eye, Pencil, Download, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const studentData = Array.from({ length: 10 }, (_, i) => ({
    srNo: i + 1,
    name: 'Cell text',
    email: 'Cell text',
    phone: 'Cell text',
    batch: 'Cell text',
}));

const Students = () => {
    const navigate = useNavigate();

    const handleEditClick = (studentId) => {
        navigate(`/edit-user/${studentId}`);
    };
    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Blue Header Bar */}
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 mt-0 shadow-md">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search Input */}
                    <div className="relative min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Filter Input */}
                    <div className="relative min-w-[80px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter"
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Clear Button with Icon */}
                    <button className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer">
                        <X size={16} className="text-gray-500" />
                        Clear
                    </button>
                </div>

                {/* Right-Side Buttons */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button className="bg-white text-[#7966F1] font-semibold !px-4 !py-2 rounded-md cursor-pointer">
                        Create Student
                    </button>
                    <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1] !m-8">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-white text-[#7966F1] font-bold border-b">
                        <tr>
                            <th className="!px-6 !py-4">Sr.no.</th>
                            <th className="!px-6 !py-4">Name</th>
                            <th className="!px-6 !py-4">Email Id</th>
                            <th className="!px-6 !py-4">Phone Number</th>
                            <th className="!px-6 !py-4">Batch</th>
                            <th className="!px-6 !py-4">View</th>
                            <th className="!px-6 !py-4">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.map((student, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="!px-6 !py-4">{student.srNo}</td>
                                <td className="!px-6 !py-4">{student.name}</td>
                                <td className="!px-6 !py-4">{student.email}</td>
                                <td className="!px-6 !py-4">{student.phone}</td>
                                <td className="!px-6 !py-4">{student.batch}</td>
                                <td className="!px-6 !py-4">
                                    <Eye className="text-[#7966F1] cursor-pointer" size={20} />
                                </td>
                                <td className="!px-6 !py-4">
                                    <Pencil className="text-[#7966F1] cursor-pointer" size={20} onClick={() => handleEditClick(student.srNo)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Students;
