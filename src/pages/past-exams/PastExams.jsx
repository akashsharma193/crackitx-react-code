import React from 'react';
import { Eye, Download, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pastExamData = Array.from({ length: 10 }, (_, i) => ({
    srNo: i + 1,
    testName: 'Cell text',
    batch: 'Cell text',
    conductedBy: 'Cell text',
    examDuration: 'Cell text',
    studentCount: 'Cell text',
}));

const PastExams = () => {
    const navigate = useNavigate();

    const handleViewClick = (examId) => {
        navigate(`/past-exam-details/${examId}`);
    };
    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Header Bar */}
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 mt-0">
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
                    <div className="relative min-w-[80px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter"
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Clear Button */}
                    <button className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer">
                        <X size={16} className="text-gray-500" />
                        Clear
                    </button>
                </div>

                {/* Right Buttons */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
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
                            <th className="!px-6 !py-4">Test Name</th>
                            <th className="!px-6 !py-4">Batch</th>
                            <th className="!px-6 !py-4">Conducted By</th>
                            <th className="!px-6 !py-4">Exam Duration</th>
                            <th className="!px-6 !py-4">Student Count</th>
                            <th className="!px-6 !py-4">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastExamData.map((exam, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="!px-6 !py-4">{exam.srNo}</td>
                                <td className="!px-6 !py-4">{exam.testName}</td>
                                <td className="!px-6 !py-4">{exam.batch}</td>
                                <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                <td className="!px-6 !py-4">{exam.examDuration}</td>
                                <td className="!px-6 !py-4">{exam.studentCount}</td>
                                <td className="!px-6 !py-4">
                                    <Eye className="text-[#7966F1] cursor-pointer" size={20} onClick={() => handleViewClick(exam.id)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PastExams;
