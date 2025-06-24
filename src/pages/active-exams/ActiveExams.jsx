import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Search, X, Download } from 'lucide-react';

const activeExamData = Array.from({ length: 10 }, (_, i) => ({
    srNo: i + 1,
    testName: 'Cell text',
    conductedBy: 'Cell text',
    startTime: 'Cell text',
    endTime: 'Cell text',
    isVisible: i % 2 === 0, 
}));

const ActiveExams = () => {
    const navigate = useNavigate();
    const [examData, setExamData] = useState(activeExamData);

    const handleViewClick = (examId) => {
        navigate(`/edit-exam/${examId}`);
    };

    const handleToggleVisibility = (index) => {
        setExamData(prevData =>
            prevData.map((exam, i) =>
                i === index ? { ...exam, isVisible: !exam.isVisible } : exam
            )
        );
    };

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Header */}
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search */}
                    <div className="relative min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative min-w-[100px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter"
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Clear Button */}
                    <button className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2">
                        <X size={16} className="text-gray-500" />
                        Clear
                    </button>
                </div>

                {/* Download Button */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition">
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
                            <th className="!px-6 !py-4">Test Name</th>
                            <th className="!px-6 !py-4">Test Conducted By</th>
                            <th className="!px-6 !py-4">Start Time</th>
                            <th className="!px-6 !py-4">End Time</th>
                            <th className="!px-6 !py-4">Test Visibility</th>
                            <th className="!px-6 !py-4">View</th>
                            <th className="!px-6 !py-4">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.map((exam, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="!px-6 !py-4">{exam.srNo}</td>
                                <td className="!px-6 !py-4">{exam.testName}</td>
                                <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                <td className="!px-6 !py-4">{exam.startTime}</td>
                                <td className="!px-6 !py-4">{exam.endTime}</td>
                                <td className="!px-6 !py-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={exam.isVisible}
                                            onChange={() => handleToggleVisibility(index)}
                                        />
                                        <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${exam.isVisible ? 'bg-[#7966F1]' : 'bg-gray-200'
                                            }`}>
                                            <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${exam.isVisible ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                        </div>
                                    </label>
                                </td>
                                <td className="!px-6 !py-4">
                                    <Eye className="text-[#7966F1] cursor-pointer" size={20} onClick={() => handleViewClick(exam.srNo)} />
                                </td>
                                <td className="!px-6 !py-4">
                                    <Trash2 className="text-[#ef4444] cursor-pointer" size={20} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveExams;