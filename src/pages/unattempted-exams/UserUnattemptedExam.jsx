import React, { useState, useEffect } from 'react';
import { Eye, Search, X, Download, ChevronLeft, ChevronRight, ArrowLeft, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Unattempted Exams...
                </div>
            </div>
        </div>
    );
};

const QuizResultsPage = ({ resultData, onBack }) => {
    const { questionList, subjectName, teacherName, startTime, endTime } = resultData;

    const totalQuestions = questionList.length;
    const mockAnswerList = questionList.map(question => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: null
    }));

    const correctAnswers = 0;
    const wrongAnswers = 0;
    const skippedAnswers = totalQuestions;
    const score = 0;

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
        <div className="flex flex-col h-full bg-gray-50">
            <div className="bg-[#7966F1] text-white !px-6 !py-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 !px-3 !py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm">Back to Exams</span>
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold">Quiz Preview - {subjectName}</h1>
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
                                        <div className="text-sm text-gray-700">Unattempted</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>Start: {startTime ? new Date(startTime).toLocaleString() : 'Not Started'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} />
                                        <span>End: {endTime ? new Date(endTime).toLocaleString() : 'Not Completed'}</span>
                                    </div>
                                </div>

                                <div className="!mt-4 !p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-blue-800 font-semibold text-sm">Status: Unattempted</div>
                                    <div className="text-blue-600 text-sm mt-1">This exam has not been attempted yet. All questions will be shown with correct answers for preview.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 !mb-4">Question Preview</h2>

                        {mockAnswerList.map((item, index) => {
                            const isCorrect = false;
                            const isSkipped = true;

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
                                            <h3 className="font-semibold text-gray-800 !mb-4">{item.question}</h3>

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
                                                                            Correct Answer
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
                                                    This question was not attempted - showing correct answer for preview
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

const UserUnattemptedExams = ({ onNavigateToResults }) => {
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    const [loadingStates, setLoadingStates] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);

    const fetchExamData = async (page = 0, search = '', filter = '') => {
        try {
            setLoading(true);
            setError(null);

            const filterObj = {};

            if (search.trim()) {
                filterObj.subjectName = search.trim();
            }

            if (filter.trim()) {
                filterObj.teacherName = filter.trim();
            }

            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: filterObj
            };

            const response = await apiClient.post('/user-activity/getAllUnAttemptedTest', requestBody);

            if (response.data.success && response.data.data) {
                const transformedData = response.data.data.content.map((item, index) => ({
                    srNo: page * pageSize + index + 1,
                    testName: item.subjectName || 'N/A',
                    conductedBy: item.teacherName || 'N/A',
                    startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                    endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                    examDuration: item.examDuration || 'N/A',
                    questionId: item.questionId,
                    orgCode: item.orgCode,
                    batch: item.batch,
                    userId: item.userId,
                    totalQuestions: item.questionList ? item.questionList.length : 0,
                    fullData: item
                }));

                setExamData(transformedData);

                const pageData = response.data.data.page;
                setTotalPages(pageData.totalPages);
                setTotalElements(pageData.totalElements);
                setCurrentPage(pageData.number);
            } else {
                throw new Error(response.data.message || 'Failed to fetch unattempted exams');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch unattempted exams');
            console.error('Error fetching unattempted exams:', err);
            toast.error('Failed to fetch unattempted exams');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamData(0, searchTerm, filterTerm);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '' || filterTerm !== '') {
                fetchExamData(0, searchTerm, filterTerm);
                setCurrentPage(0);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterTerm]);

    const handleViewClick = async (exam) => {
        if (!exam.questionId) {
            toast.error('Question ID not found for this exam');
            return;
        }

        const loadingKey = exam.questionId;

        try {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

            const examDetails = {
                subjectName: exam.fullData.subjectName,
                teacherName: exam.fullData.teacherName,
                startTime: exam.fullData.startTime,
                endTime: exam.fullData.endTime,
                questionList: exam.fullData.questionList || [],
                examDuration: exam.fullData.examDuration,
                questionId: exam.questionId
            };

            if (!examDetails.questionList || examDetails.questionList.length === 0) {
                toast.error('No questions available for this exam');
                return;
            }

            setCurrentResults(examDetails);
            setShowResults(true);

            if (onNavigateToResults) {
                onNavigateToResults(examDetails);
            }
        } catch (err) {
            console.error('Error loading exam details:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load exam details';
            toast.error(errorMessage);
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const handleBackFromResults = () => {
        setShowResults(false);
        setCurrentResults(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchExamData(newPage, searchTerm, filterTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
        fetchExamData(0, '', '');
        setCurrentPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterTerm(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchExamData(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    const handleFilterKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchExamData(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                for (let i = 0; i < maxVisiblePages; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 3) {
                for (let i = totalPages - maxVisiblePages; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }

        return pages;
    };

    if (showResults && currentResults) {
        return <QuizResultsPage resultData={currentResults} onBack={handleBackFromResults} />;
    }

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {loading && <CircularLoader />}

            {!loading && error && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500 text-lg">Error: {error}</div>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="relative min-w-[320px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by subject name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyPress={handleSearchKeyPress}
                                    className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                                />
                            </div>

                            <div className="relative min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter by teacher name..."
                                    value={filterTerm}
                                    onChange={handleFilterChange}
                                    onKeyPress={handleFilterKeyPress}
                                    className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                                />
                            </div>

                            <button
                                onClick={handleClear}
                                className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <X size={16} className="text-gray-500" />
                                Clear
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1] !m-8">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-white text-[#7966F1] font-bold border-b">
                                <tr>
                                    <th className="!px-6 !py-4">Sr.no.</th>
                                    <th className="!px-6 !py-4">Test Name</th>
                                    <th className="!px-6 !py-4">Test Conducted By</th>
                                    <th className="!px-6 !py-4">Start Time</th>
                                    <th className="!px-6 !py-4">End Time</th>
                                    <th className="!px-6 !py-4">Duration (mins)</th>
                                    <th className="!px-6 !py-4">Total Questions</th>
                                    <th className="!px-6 !py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examData.length > 0 ? (
                                    examData.map((exam, index) => (
                                        <tr key={exam.questionId || index} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{exam.srNo}</td>
                                            <td className="!px-6 !py-4">{exam.testName}</td>
                                            <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                            <td className="!px-6 !py-4">{exam.startTime}</td>
                                            <td className="!px-6 !py-4">{exam.endTime}</td>
                                            <td className="!px-6 !py-4">{exam.examDuration}</td>
                                            <td className="!px-6 !py-4">{exam.totalQuestions}</td>  
                                            <td className="!px-6 !py-4">
                                                <div className="relative group inline-block">
                                                    <button
                                                        onClick={() => handleViewClick(exam)}
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
                                                        Preview Questions
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="!px-6 !py-8 text-center text-gray-500">
                                            {searchTerm || filterTerm ? 'No unattempted exams found matching your criteria' : 'No unattempted exams found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {examData.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between !px-6 !py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} unattempted exams
                                    {(searchTerm || filterTerm) && (
                                        <span className="text-[#7966F1] ml-2">
                                            (filtered)
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className={`flex items-center gap-1 !px-3 !py-2 rounded-md text-sm font-medium transition ${currentPage === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                            }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`!px-3 !py-2 rounded-md text-sm font-medium transition ${pageNum === currentPage
                                                    ? 'bg-[#7966F1] text-white'
                                                    : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                                    }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className={`flex items-center gap-1 !px-3 !py-2 rounded-md text-sm font-medium transition ${currentPage === totalPages - 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                            }`}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserUnattemptedExams;