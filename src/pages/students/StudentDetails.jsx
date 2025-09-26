import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, BookOpen, Clock, Award, Eye, CheckCircle, XCircle, MinusCircle, Timer } from 'lucide-react';
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
                    Loading User Details...
                </div>
            </div>
        </div>
    );
};

const QuizResultsPage = ({ resultData, onBack, handleSidebarTabChange }) => {
    const { answerList, subjectName, teacherName, startTime, endTime } = resultData;

    const totalQuestions = answerList.length;
    const correctAnswers = answerList.filter(item => item.userAnswer === item.correctAnswer).length;
    const wrongAnswers = answerList.filter(item => item.userAnswer && item.userAnswer !== item.correctAnswer).length;
    const skippedAnswers = answerList.filter(item => !item.userAnswer).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === null || timeInSeconds === undefined) return 'N/A';
        if (timeInSeconds === 0) return '0s';

        if (timeInSeconds < 60) {
            return `${timeInSeconds}s`;
        } else {
            const minutes = Math.floor(timeInSeconds / 60);
            const remainingSeconds = timeInSeconds % 60;
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
        <div className="h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent
                    activeTab="Students"
                    setActiveTab={handleSidebarTabChange}
                />

                <div className="flex-1 flex flex-col bg-gray-50">
                    <div className="bg-[#7966F1] text-white !px-6 !py-4 flex-shrink-0">
                        <div className="flex items-center gap-4">
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
                                <h1 className="text-xl font-bold">Quiz Results - {subjectName}</h1>
                                <p className="text-sm opacity-90">Conducted by: {teacherName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto !px-6 !py-8">
                        <div className="max-w-6xl !mx-auto">
                            <div className="bg-white rounded-lg !p-8 shadow-md !mb-8">
                                <div className="flex flex-col lg:flex-row items-center gap-8">
                                    <div className="flex justify-center">
                                        <PieChart
                                            correct={correctAnswers}
                                            wrong={wrongAnswers}
                                            skipped={skippedAnswers}
                                            total={totalQuestions}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !mb-6">
                                            <div className="text-center !p-4 bg-green-50 rounded-lg">
                                                <div className="flex items-center justify-center !mb-2">
                                                    <CheckCircle className="text-green-600" size={24} />
                                                </div>
                                                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                                                <div className="text-sm text-green-700">Correct</div>
                                            </div>

                                            <div className="text-center !p-4 bg-red-50 rounded-lg">
                                                <div className="flex items-center justify-center !mb-2">
                                                    <XCircle className="text-red-600" size={24} />
                                                </div>
                                                <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                                                <div className="text-sm text-red-700">Wrong</div>
                                            </div>

                                            <div className="text-center !p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-center !mb-2">
                                                    <MinusCircle className="text-gray-600" size={24} />
                                                </div>
                                                <div className="text-2xl font-bold text-gray-600">{skippedAnswers}</div>
                                                <div className="text-sm text-gray-700">Skipped</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>Start: {new Date(startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span>End: {new Date(endTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-800 !mb-4">Question Review</h2>

                                {answerList.map((item, index) => {
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
                                                                                    Your Answer
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
            </div>
        </div>
    );
};

const StudentDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [userExams, setUserExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    const fetchUserExams = async () => {
        try {
            setLoading(true);
            setError(null);

            const requestBody = {
                userId: userId
            };

            const response = await apiClient.post('/report/getAllExamByUserId', requestBody);

            if (response.data.success && response.data.data) {
                setUserExams(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch user exam data');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch user exam data');
            console.error('Error fetching user exam data:', err);
            toast.error('Failed to fetch user exam data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserExams();
        }

        if (location.state && location.state.student) {
            setUserInfo(location.state.student);
        }
    }, [userId, location]);

    const handleBack = () => {
        navigate('/home', {
            state: { activeTab: 'Students' },
            replace: false
        });
    };

    const handleSidebarTabChange = (newTab) => {
        navigate('/home', {
            state: { activeTab: newTab },
            replace: false
        });
    };

    const handleViewExamDetails = async (exam) => {
        const loadingKey = exam.questionId;

        try {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

            if (exam.answerList && exam.answerList.length > 0) {
                setCurrentResults(exam);
                setShowResults(true);
            } else {
                toast.error('No answer details found for this exam');
            }
        } catch (error) {
            console.error('Error displaying exam details:', error);
            toast.error('Failed to display exam details');
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const handleBackFromResults = () => {
        setShowResults(false);
        setCurrentResults(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPerformanceColor = (correctAnswers, totalQuestions) => {
        if (totalQuestions === 0) return 'text-gray-600 bg-gray-100';
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 80) return 'text-green-600 bg-green-100';
        if (percentage >= 60) return 'text-blue-600 bg-blue-100';
        if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getPerformanceLabel = (correctAnswers, totalQuestions) => {
        if (totalQuestions === 0) return 'No Data';
        const percentage = (correctAnswers / totalQuestions) * 100;
        if (percentage >= 80) return 'Excellent';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Average';
        return 'Needs Improvement';
    };

    const calculateStats = () => {
        if (userExams.length === 0) return { totalExams: 0, avgScore: 0, totalMarks: 0 };

        const totalExams = userExams.length;
        const totalMarksObtained = userExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
        const avgScore = totalMarksObtained / totalExams;

        return { totalExams, avgScore: avgScore.toFixed(1), totalMarks: totalMarksObtained };
    };

    const stats = calculateStats();

    if (showResults && currentResults) {
        return <QuizResultsPage resultData={currentResults} onBack={handleBackFromResults} handleSidebarTabChange={handleSidebarTabChange} />;
    }

    return (
        <div className="h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent
                    activeTab="Students"
                    setActiveTab={handleSidebarTabChange}
                />

                <div className="flex-1 flex flex-col bg-gray-50">
                    <div className="flex items-center justify-between text-white bg-[#7966F1] !px-6 !py-5 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <ArrowLeft className="cursor-pointer" size={20} onClick={handleBack} />
                            <h2 className="text-lg font-semibold">
                                User Details - {userInfo?.name || userId}
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
                                {userInfo && (
                                    <div className="bg-white rounded-xl shadow-md !p-6 !mb-6 border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#7966F1] bg-opacity-10 !p-4 rounded-full">
                                                <User className="text-[#7966F1]" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{userInfo.name}</h3>
                                                <p className="text-gray-600">{userInfo.email}</p>
                                                <p className="text-gray-600">{userInfo.mobile}</p>
                                                <p className="text-gray-600">Batch: {userInfo.batch}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {userExams.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !mb-8">
                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Total Exams</p>
                                                    <p className="text-3xl font-bold text-gray-900">{stats.totalExams}</p>
                                                </div>
                                                <div className="bg-[#7966F1] bg-opacity-10 !p-3 rounded-full">
                                                    <BookOpen className="text-[#7966F1]" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Average Score</p>
                                                    <p className="text-3xl font-bold text-blue-600">{stats.avgScore}</p>
                                                </div>
                                                <div className="bg-blue-100 !p-3 rounded-full">
                                                    <Award className="text-blue-600" size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-md !p-6 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-600 text-sm font-medium">Total Marks</p>
                                                    <p className="text-3xl font-bold text-green-600">{stats.totalMarks}</p>
                                                </div>
                                                <div className="bg-green-100 !p-3 rounded-full">
                                                    <Award className="text-green-600" size={24} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                    <div className="bg-[#7966F1] !px-6 !py-4">
                                        <h2 className="text-xl font-bold text-white">Exam History</h2>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Sr.No.</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Subject Name</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Teacher</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Start Date</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">End Date</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Total Questions</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Total Marks</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">Performance</th>
                                                    <th className="!px-6 !py-4 font-semibold text-gray-900">View</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userExams.length > 0 ? (
                                                    userExams.map((exam, index) => (
                                                        <tr key={exam.questionId || index} className="border-b hover:bg-gray-50 transition-colors">
                                                            <td className="!px-6 !py-4 font-medium text-gray-900">{index + 1}</td>
                                                            <td className="!px-6 !py-4 text-gray-900 font-medium">{exam.subjectName || 'N/A'}</td>
                                                            <td className="!px-6 !py-4 text-gray-600">{exam.teacherName || 'N/A'}</td>
                                                            <td className="!px-6 !py-4 text-gray-600">
                                                                <div>
                                                                    <div>{formatDate(exam.startTime)}</div>
                                                                    <div className="text-xs text-gray-500">{formatTime(exam.startTime)}</div>
                                                                </div>
                                                            </td>
                                                            <td className="!px-6 !py-4 text-gray-600">
                                                                <div>
                                                                    <div>{formatDate(exam.endTime)}</div>
                                                                    <div className="text-xs text-gray-500">{formatTime(exam.endTime)}</div>
                                                                </div>
                                                            </td>
                                                            <td className="!px-6 !py-4 text-center text-gray-600 font-semibold">{exam.totalQuestion || 0}</td>
                                                            <td className="!px-6 !py-4 text-center text-gray-900 font-bold text-lg">{exam.totalMarks || 0}</td>
                                                            <td className="!px-6 !py-4">
                                                                <span className={`!px-3 !py-1 rounded-full text-sm font-medium ${getPerformanceColor(exam.correctAnswer, exam.totalQuestion)}`}>
                                                                    {getPerformanceLabel(exam.correctAnswer, exam.totalQuestion)}
                                                                </span>
                                                            </td>
                                                            <td className="!px-6 !py-4">
                                                                <div className="relative group inline-block">
                                                                    <button
                                                                        onClick={() => handleViewExamDetails(exam)}
                                                                        disabled={loadingStates[exam.questionId]}
                                                                        className={`transition-colors ${loadingStates[exam.questionId]
                                                                            ? 'text-gray-400 cursor-not-allowed'
                                                                            : 'text-[#7966F1] hover:text-[#5a4bcc] cursor-pointer'
                                                                            }`}
                                                                    >
                                                                        {loadingStates[exam.questionId] ? (
                                                                            <div className="w-5 h-5 border-2 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <Eye size={20} />
                                                                        )}
                                                                    </button>
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                                        View Details
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="!px-6 !py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <BookOpen className="text-gray-300" size={48} />
                                                                <div>
                                                                    <p className="text-lg font-medium">No exam data found</p>
                                                                    <p className="text-sm">This user has not taken any exams yet.</p>
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

export default StudentDetails;