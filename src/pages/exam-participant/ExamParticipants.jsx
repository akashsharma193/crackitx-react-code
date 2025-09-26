import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Trophy, Target, Eye, Clock, CheckCircle, XCircle, MinusCircle, Timer } from 'lucide-react';
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

const StudentResultsPage = ({ resultData, onBack, studentName }) => {
    const { finalResult, totalQuestion, correctAnswer, incorrectAnswer, totalMarks, unAttempted } = resultData;

    const score = totalQuestion > 0 ? Math.round((correctAnswer / totalQuestion) * 100) : 0;

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds || timeInSeconds === 0) return '0s';
        const seconds = Math.round(timeInSeconds);
        if (seconds < 60) {
            return `${seconds}s`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
    };

    const PieChart = ({ correct, wrong, skipped, total }) => {
        const correctPercentage = (correct / total) * 100;
        const wrongPercentage = (wrong / total) * 100;
        const skippedPercentage = (skipped / total) * 100;

        const correctAngle = (correctPercentage / 100) * 360;
        const wrongAngle = (wrongPercentage / 100) * 360;
        const skippedAngle = (skippedPercentage / 100) * 360;

        const radius = 80;
        const circumference = 2 * Math.PI * radius;

        const correctStrokeDasharray = `${(correctAngle / 360) * circumference} ${circumference}`;
        const wrongStrokeDasharray = `${(wrongAngle / 360) * circumference} ${circumference}`;
        const skippedStrokeDasharray = `${(skippedAngle / 360) * circumference} ${circumference}`;

        const correctOffset = 0;
        const wrongOffset = -((correctAngle / 360) * circumference);
        const skippedOffset = -(((correctAngle + wrongAngle) / 360) * circumference);

        return (
            <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                    />

                    {correct > 0 && (
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray={correctStrokeDasharray}
                            strokeDashoffset={correctOffset}
                            strokeLinecap="round"
                        />
                    )}

                    {wrong > 0 && (
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                            strokeDasharray={wrongStrokeDasharray}
                            strokeDashoffset={wrongOffset}
                            strokeLinecap="round"
                        />
                    )}

                    {skipped > 0 && (
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="20"
                            strokeDasharray={skippedStrokeDasharray}
                            strokeDashoffset={skippedOffset}
                            strokeLinecap="round"
                        />
                    )}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#7966F1]">{score}%</div>
                        <div className="text-sm text-gray-600">Score</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between text-white bg-[#7966F1] !px-6 !py-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 !px-3 !py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm">Back</span>
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold">Student Results - {studentName}</h1>
                        <p className="text-sm opacity-90">Exam Performance Report</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto !p-6">
                <div className="max-w-6xl !mx-auto">
                    <div className="bg-white rounded-lg !p-8 shadow-md !mb-8">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex justify-center">
                                <PieChart
                                    correct={correctAnswer}
                                    wrong={incorrectAnswer}
                                    skipped={unAttempted}
                                    total={totalQuestion}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !mb-6">
                                    <div className="text-center !p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center justify-center !mb-2">
                                            <CheckCircle className="text-green-600" size={24} />
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">{correctAnswer}</div>
                                        <div className="text-sm text-green-700">Correct</div>
                                    </div>

                                    <div className="text-center !p-4 bg-red-50 rounded-lg">
                                        <div className="flex items-center justify-center !mb-2">
                                            <XCircle className="text-red-600" size={24} />
                                        </div>
                                        <div className="text-2xl font-bold text-red-600">{incorrectAnswer}</div>
                                        <div className="text-sm text-red-700">Wrong</div>
                                    </div>

                                    <div className="text-center !p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-center !mb-2">
                                            <MinusCircle className="text-gray-600" size={24} />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-600">{unAttempted}</div>
                                        <div className="text-sm text-gray-700">Skipped</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={16} />
                                        <span>Total Questions: {totalQuestion}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />
                                        <span>Total Marks: {totalMarks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 !mb-4">Question Review</h2>

                        {finalResult.map((item, index) => {
                            const isCorrect = item.userAnswer === item.correctAnswer;
                            const isSkipped = !item.userAnswer;

                            return (
                                <div key={index} className="bg-white rounded-lg !p-6 shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect
                                                ? 'bg-green-500 text-white'
                                                : isSkipped
                                                    ? 'bg-gray-500 text-white'
                                                    : 'bg-red-500 text-white'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between !mb-4">
                                                <h3 className="font-semibold text-gray-800 flex-1">{item.question}</h3>
                                                <div className="flex items-center gap-1 !ml-4 bg-blue-50 !px-3 !py-1 rounded-lg">
                                                    <Timer size={14} className="text-blue-600" />
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {formatTime(item.timeTaken)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {item.options.map((option, optionIndex) => {
                                                    const isCorrectOption = option === item.correctAnswer;
                                                    const isUserAnswer = option === item.userAnswer;

                                                    let bgColor = 'bg-gray-50';
                                                    let textColor = 'text-gray-700';
                                                    let borderColor = 'border-gray-200';

                                                    if (isCorrectOption) {
                                                        bgColor = 'bg-green-100';
                                                        textColor = 'text-green-800';
                                                        borderColor = 'border-green-300';
                                                    } else if (isUserAnswer && !isCorrectOption) {
                                                        bgColor = 'bg-red-100';
                                                        textColor = 'text-red-800';
                                                        borderColor = 'border-red-300';
                                                    }

                                                    return (
                                                        <div
                                                            key={optionIndex}
                                                            className={`!p-3 border rounded-lg ${bgColor} ${textColor} ${borderColor}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                                                                        {String.fromCharCode(65 + optionIndex)}
                                                                    </span>
                                                                    <span className="flex-1">{option}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {isCorrectOption && (
                                                                        <span className="text-xs font-semibold text-green-600 bg-green-200 !px-2 !py-1 rounded flex items-center gap-1">
                                                                            <CheckCircle size={12} />
                                                                            Correct
                                                                        </span>
                                                                    )}
                                                                    {isUserAnswer && !isCorrectOption && (
                                                                        <span className="text-xs font-semibold text-red-600 bg-red-200 !px-2 !py-1 rounded flex items-center gap-1">
                                                                            <XCircle size={12} />
                                                                            User Answer
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {isSkipped && (
                                                <div className="!mt-3 text-sm text-gray-500 bg-gray-100 !p-3 rounded flex items-center gap-2">
                                                    <MinusCircle size={16} />
                                                    This question was not answered
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
    const [loadingStates, setLoadingStates] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);
    const [currentStudentName, setCurrentStudentName] = useState('');

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

    const handleViewClick = async (participant) => {
        const loadingKey = participant.userId;

        try {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

            const requestBody = {
                userId: participant.userId,
                questionId: id
            };

            const response = await apiClient.post('/answerPaper/getStudentResult', requestBody);

            if (response.data.success && response.data.data) {
                setCurrentResults(response.data.data);
                setCurrentStudentName(participant.name);
                setShowResults(true);
            } else {
                throw new Error(response.data.message || 'Failed to fetch student result');
            }
        } catch (err) {
            console.error('Error fetching student result:', err);
            
            if (err.response) {
                const status = err.response.status;
                const errorData = err.response.data;
                
                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'Failed to fetch student result';

                if (status === 400) {
                    toast.error(errorMessage);
                } else if (status === 401) {
                    toast.error(errorMessage || 'Unauthorized access');
                } else if (status === 404) {
                    toast.error(errorMessage || 'Student result not found');
                } else if (status === 422) {
                    toast.error(errorMessage || 'Validation error - Please check your input');
                } else if (status >= 500) {
                    toast.error('Server error. Please try again later');
                } else {
                    toast.error(errorMessage);
                }
            } else if (err.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const handleBackFromResults = () => {
        setShowResults(false);
        setCurrentResults(null);
        setCurrentStudentName('');
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

    if (showResults && currentResults) {
        return (
            <div className="h-screen flex flex-col">
                <HeaderComponent />
                <div className="flex flex-1 overflow-hidden">
                    <SidebarComponent
                        activeTab={sourceTab}
                        setActiveTab={handleSidebarTabChange}
                    />
                    <div className="flex-1 bg-gray-50 flex flex-col">
                        <StudentResultsPage 
                            resultData={currentResults} 
                            onBack={handleBackFromResults}
                            studentName={currentStudentName}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent
                    activeTab={sourceTab}
                    setActiveTab={handleSidebarTabChange}
                />

                <div className="flex-1 bg-gray-50 flex flex-col">
                    <div className="flex items-center justify-between text-white bg-[#7966F1] !px-6 !py-5 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <ArrowLeft className="cursor-pointer" size={20} onClick={handleBack} />
                            <h2 className="text-lg font-semibold">
                                Exam Participants
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto !p-6">
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
                                                                        <button
                                                                            onClick={() => handleViewClick(participant)}
                                                                            disabled={loadingStates[participant.userId]}
                                                                            className={`transition-colors ${loadingStates[participant.userId]
                                                                                    ? 'text-gray-400 cursor-not-allowed'
                                                                                    : 'text-[#7966F1] hover:text-[#5a4bcc] cursor-pointer'
                                                                                }`}
                                                                        >
                                                                            {loadingStates[participant.userId] ? (
                                                                                <div className="w-5 h-5 border-2 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                                                                            ) : (
                                                                                <Eye size={20} />
                                                                            )}
                                                                        </button>
                                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                                            View Results
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