import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const pieData = [
    { name: 'Correct Answer', value: 7, color: '#22c55e' },
    { name: 'Wrong Answer', value: 3, color: '#ef4444' },
    { name: 'Not Attempted', value: 0, color: '#9ca3af' },
];

const question = {
    question: 'Which country recently became the largest exporter of wheat?',
    options: ['India', 'Russia', 'India', 'Russia'],
    timeTaken: '1:28',
};

const PastExamStudentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const correctPercentage = ((pieData[0].value / 10) * 100).toFixed(1);

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />

            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent activeTab="Exam History" setActiveTab={() => { }} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    {/* Top Header */}
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-6">
                        <ArrowLeft className="cursor-pointer text-white" size={20} onClick={() => navigate(-1)} />
                        <h2 className="text-lg font-semibold">Test 5 - 05-10-2025</h2>
                    </div>

                    {/* Main Content Container */}
                    <div className="!p-6">
                        {/* Stats + PieChart Section */}
                        <div className="bg-white rounded-lg shadow-sm !p-6 !mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                {/* Left Side - Stats */}
                                <div className="flex-1">
                                    <p className="text-gray-600 !mb-4">Total question: 10, Attempted: 10, Not Attempted: 0</p>
                                    <p className="text-lg font-semibold">Total Score: <span className="text-black">7/10</span></p>
                                </div>

                                {/* Right Side - Chart and Legend */}
                                <div className="flex items-center gap-8">
                                    {/* Pie Chart */}
                                    <div className="relative">
                                        <PieChart width={180} height={180}>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={75}
                                                labelLine={false}
                                                strokeWidth={0}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                                            <p className="text-xl font-bold text-[#22c55e]">{correctPercentage}%</p>
                                            <p className="text-sm text-gray-500">Passed</p>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex flex-col gap-3">
                                        {pieData.map((entry, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }}></span>
                                                <span className="text-sm text-gray-700 font-medium">{entry.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question Block */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 !p-6">
                            <div className="flex items-start justify-between !mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex-1 !pr-4">{question.question}</h3>
                                <div className="flex items-center gap-2 text-sm text-white bg-[#7966F1] !px-3 !py-1 rounded-full flex-shrink-0">
                                    <Clock size={14} />
                                    {question.timeTaken}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-300 rounded-lg shadow-sm !px-4 !py-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            className="accent-[#7966F1] w-4 h-4"
                                            disabled
                                        />
                                        <label className="text-sm font-medium text-gray-700 cursor-pointer">{opt}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastExamStudentView;