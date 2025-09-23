import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Target, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Participants...
                </div>
            </div>
        </div>
    );
};

const ExamParticipants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sourceTab, setSourceTab] = useState('Active Exam');

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            setError(null);

            const requestBody = {
                id: id
            };

            const response = await apiClient.post('/report/getAllUserByExamId', requestBody);

            if (response.data.success && response.data.data) {
                const transformedData = response.data.data.map((participant, index) => ({
                    srNo: index + 1,
                    userId: participant.userId,
                    name: participant.name,
                    email: participant.email,
                    mobile: participant.mobile,
                    batch: participant.batch,
                    marks: participant.marks,
                    totalMarks: participant.totalMarks,
                    percentage: participant.totalMarks > 0
                        ? ((participant.marks / participant.totalMarks) * 100).toFixed(1)
                        : '0.0'
                }));

                setParticipants(transformedData);
            } else {
                throw new Error(response.data.message || 'Failed to fetch participants data');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch participants data');
            console.error('Error fetching participants data:', err);
            toast.error('Failed to fetch participants data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchParticipants();
        }

        const determineSourceTab = () => {
            if (location.state && location.state.sourceTab) {
                return location.state.sourceTab;
            }

            const referrer = document.referrer;
            if (referrer) {
                if (referrer.includes('past-exam') || referrer.includes('exam-history')) {
                    return 'Exam History';
                } else if (referrer.includes('active-exam') || referrer.includes('home')) {
                    return 'Active Exam';
                }
            }
            return 'Active Exam';
        };

        const detectedSourceTab = determineSourceTab();
        setSourceTab(detectedSourceTab);

        sessionStorage.setItem('examParticipantsSource', detectedSourceTab);
    }, [id, location]);

    const handleBack = () => {
        navigate('/home', {
            state: { activeTab: sourceTab },
            replace: false
        });
    };

    const handleSidebarTabChange = (newTab) => {
        navigate('/home', {
            state: { activeTab: newTab },
            replace: false
        });
    };

    const handleViewClick = (participant) => {
        navigate(`/user-details/${participant.userId}`, {
            state: { 
                student: {
                    name: participant.name,
                    email: participant.email,
                    mobile: participant.mobile,
                    batch: participant.batch,
                    userId: participant.userId
                }
            },
            replace: false
        });
    };

    const getPerformanceColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600 bg-green-100';
        if (percentage >= 60) return 'text-blue-600 bg-blue-100';
        if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getPerformanceLabel = (percentage) => {
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Average';
        return 'Needs Improvement';
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent
                    activeTab={sourceTab}
                    setActiveTab={handleSidebarTabChange}
                />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center justify-between text-white bg-[#7966F1] !px-6 !py-5">
                        <div className="flex items-center gap-3">
                            <ArrowLeft className="cursor-pointer" size={20} onClick={handleBack} />
                            <h2 className="text-lg font-semibold">
                                Exam Participants
                            </h2>
                        </div>
                    </div>

                    <div className="!p-6">
                        {loading && <CircularLoader />}

                        {!loading && error && (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-red-500 text-lg">Error: {error}</div>
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {participants.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !mb-8">
                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                                                    <p className="text-3xl font-bold text-gray-900">{participants.length}</p>
                                                </div>
                                                <div className="bg-[#7966F1] bg-opacity-10 !p-3 rounded-full">
                                                    <User className="text-[#7966F1]" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Highest Score</p>
                                                    <p className="text-3xl font-bold text-green-600">
                                                        {Math.max(...participants.map(p => parseFloat(p.percentage)))}%
                                                    </p>
                                                </div>
                                                <div className="bg-green-100 !p-3 rounded-full">
                                                    <Trophy className="text-green-600" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Average Score</p>
                                                    <p className="text-3xl font-bold text-blue-600">
                                                        {participants.length > 0
                                                            ? (participants.reduce((sum, p) => sum + parseFloat(p.percentage), 0) / participants.length).toFixed(1)
                                                            : '0.0'
                                                        }%
                                                    </p>
                                                </div>
                                                <div className="bg-blue-100 !p-3 rounded-full">
                                                    <Target className="text-blue-600" size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                    <div className="bg-[#7966F1] !px-6 !py-4">
                                        <h2 className="text-xl font-bold text-white">Participants List</h2>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Sr.No.</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">User ID</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Name</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Marks Obtained</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Total Marks</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Percentage</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Performance</th>
                                                    <th className="!px-6 !py-4">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {participants.length > 0 ? (
                                                    participants
                                                        .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
                                                        .map((participant, index) => (
                                                            <tr key={participant.userId} className="border-b hover:bg-gray-50 transition-colors">
                                                                <td className="!px-6 !py-4 font-medium text-gray-900">{index + 1}</td>
                                                                <td className="!px-6 !py-4">
                                                                    <span className="text-gray-600 font-mono text-xs bg-gray-100 rounded !px-2 !py-1 inline-block">
                                                                        {participant.userId}
                                                                    </span>
                                                                </td>
                                                                <td className="!px-6 !py-4 text-gray-900 font-medium">{participant.name}</td>
                                                                <td className="!px-6 !py-4 text-gray-600 text-center font-semibold">
                                                                    {participant.marks}
                                                                </td>
                                                                <td className="!px-6 !py-4 text-gray-600 text-center font-semibold">
                                                                    {participant.totalMarks}
                                                                </td>
                                                                <td className="!px-6 !py-4 text-center">
                                                                    <span className="font-bold text-lg text-gray-900">
                                                                        {participant.percentage}%
                                                                    </span>
                                                                </td>
                                                                <td className="!px-6 !py-4">
                                                                    <span className={`!px-3 !py-1 rounded-full text-sm font-medium ${getPerformanceColor(parseFloat(participant.percentage))}`}>
                                                                        {getPerformanceLabel(parseFloat(participant.percentage))}
                                                                    </span>
                                                                </td>
                                                                <td className="!px-6 !py-4">
                                                                    <div className="relative group inline-block">
                                                                        <Eye
                                                                            className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                                            size={20}
                                                                            onClick={() => handleViewClick(participant)}
                                                                        />
                                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                                            View Details
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="!px-6 !py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <User className="text-gray-300" size={48} />
                                                                <div>
                                                                    <p className="text-lg font-medium">No participants found</p>
                                                                    <p className="text-sm">There are no participants for this exam yet.</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamParticipants;