import React from 'react';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const PastExamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/home', { state: { activeTab: 'Past Exams' } });
    };

    const examDetails = {
        subjectName: 'xyz@gmail.com',
        teacherName: 'Xyz Ljosfjow',
        orgCode: 'AN123',
        batch: 'Contentive',
        startTime: '08:00 PM, 22 May',
        endTime: '08:20 PM, 22 May',
        duration: '60 mins',
        studentCount: 12,
    };

    const resultData = Array.from({ length: 3 }, () => ({
        ranking: 'Cell text',
        name: 'Cell text',
        marks: 'Cell text',
    }));

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent activeTab="Past Exams" setActiveTab={() => { }} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <div className="flex items-center gap-3">
                            <ArrowLeft className="cursor-pointer" size={20} onClick={handleBack} />
                            <h2 className="text-lg font-semibold">Exam Details</h2>
                        </div>
                        <button className="text-white bg-white/10 hover:bg-white hover:text-[#7966F1] !p-2 rounded-full">
                            <Download size={20} />
                        </button>
                    </div>

                    {/* Main Content Centered */}
                    <div className="flex flex-col items-center justify-center w-full !px-4 !py-8">
                        {/* Exam Info */}
                        <div className="w-full max-w-5xl bg-white border border-[#d9d9f3] rounded-lg shadow-md !px-8 !py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(examDetails).map(([label, value], index) => (
                                    <div key={index}>
                                        <label className="block text-sm text-[#7966F1] font-semibold !mb-1 capitalize">
                                            {label.replace(/([A-Z])/g, ' $1')}
                                        </label>
                                        <div className="border border-[#7966F1] rounded-md !px-4 !py-2 bg-gray-50">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result Table */}
                        <div className="w-full max-w-5xl !mt-8 bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1]">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-white text-[#7966F1] font-bold border-b">
                                    <tr>
                                        <th className="!px-6 !py-4">Ranking</th>
                                        <th className="!px-6 !py-4">Student Name</th>
                                        <th className="!px-6 !py-4">Marks Obtained</th>
                                        <th className="!px-6 !py-4">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultData.map((row, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{row.ranking}</td>
                                            <td className="!px-6 !py-4">{row.name}</td>
                                            <td className="!px-6 !py-4">{row.marks}</td>
                                            <td className="!px-6 !py-4">
                                                <Eye className="text-[#7966F1] cursor-pointer" size={20} onClick={() => navigate(`/past-exam/student-view/123`)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastExamDetails;
