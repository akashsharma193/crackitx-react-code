import React, { useState, useEffect } from 'react';
import { Download, Search, X, ChevronLeft, ChevronRight, Eye, ArrowLeft, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Completed Tests...
                </div>
            </div>
        </div>
    );
};

// Quiz Results Display Component
const QuizResultsPage = ({ resultData, onBack }) => {
    const { answerList, subjectName, teacherName, startTime, endTime } = resultData;
    
    // Calculate statistics
    const totalQuestions = answerList.length;
    const correctAnswers = answerList.filter(item => item.userAnswer === item.correctAnswer).length;
    const wrongAnswers = answerList.filter(item => item.userAnswer && item.userAnswer !== item.correctAnswer).length;
    const skippedAnswers = answerList.filter(item => !item.userAnswer).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Pie Chart Component
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
            {/* Header */}
            <div className="bg-[#7966F1] text-white !px-6 !py-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 !px-3 !py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm">Back to History</span>
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold">Quiz Results - {subjectName}</h1>
                        <p className="text-sm opacity-90">Conducted by: {teacherName}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto !px-6 !py-8">
                <div className="max-w-6xl !mx-auto">
                    {/* Summary Card */}
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

                                {/* Exam Details */}
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

                    {/* Questions Review */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 !mb-4">Question Review</h2>

                        {answerList.map((item, index) => {
                            const isCorrect = item.userAnswer === item.correctAnswer;
                            const isSkipped = !item.userAnswer;
                            
                            return (
                                <div key={index} className="bg-white rounded-lg !p-6 shadow-md">
                                    <div className="flex items-start gap-4">
                                        {/* Question Number with Status */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                            isCorrect
                                                ? 'bg-green-500 text-white'
                                                : isSkipped
                                                ? 'bg-gray-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}>
                                            {index + 1}
                                        </div>

                                        <div className="flex-1">
                                            {/* Question */}
                                            <h3 className="font-semibold text-gray-800 !mb-4">{item.question}</h3>

                                            {/* Options */}
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

                                            {/* Status Message */}
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

// Main UserExamHistory Component
const UserExamHistory = () => {
    // State management
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debouncedFilterTerm, setDebouncedFilterTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10); // Items per page

    // States for result viewing
    const [viewLoading, setViewLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [currentResults, setCurrentResults] = useState(null);

    // Debounce search and filter terms
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setDebouncedFilterTerm(filterTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterTerm]);

    // Fetch data from API with pagination using getAllCompletedTest
    const fetchCompletedTestData = async (page = 0, search = '', filter = '') => {
        try {
            setLoading(true);
            setError(null);

            const filterObj = {};

            // Add search filters if provided
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

            console.log('Fetching Completed Tests with body:', requestBody);
            const response = await apiClient.post('/user-activity/getAllCompletedTest', requestBody);

            if (response.data.success && response.data.data) {
                // Transform API data to match the component's expected format
                const transformedData = response.data.data.content.map((item, index) => ({
                    srNo: page * pageSize + index + 1,
                    testName: item.subjectName || 'N/A',
                    batch: item.batch || 'N/A',
                    conductedBy: item.teacherName || 'N/A',
                    examDuration: item.examDuration ? `${item.examDuration} mins` : 'N/A',
                    startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                    endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                    questionId: item.questionId,
                    orgCode: item.orgCode,
                    userId: item.userId,
                    id: item.id || item.questionId,
                    status: 'Completed',
                    totalQuestions: item.questionList ? item.questionList.length : 0,
                    fullData: item
                }));

                setExamData(transformedData);

                // Access pagination data from the 'page' object
                setTotalPages(response.data.data.page.totalPages);
                setTotalElements(response.data.data.page.totalElements);
                setCurrentPage(response.data.data.page.number);
            } else {
                throw new Error(response.data.message || 'Failed to fetch completed test data');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch completed test data';
            setError(errorMessage);
            console.error('Error fetching completed test data:', err);
            toast.error('Failed to fetch completed test data');
        } finally {
            setLoading(false);
        }
    };

    // Handle view click to fetch answer paper details
    const handleViewClick = async (exam) => {
        if (!exam.questionId) {
            toast.error('Question ID not found for this exam');
            return;
        }

        try {
            setViewLoading(true);
            
            // Fetch the answer paper using the API endpoint
            const response = await apiClient.get(`/user-activity/getAnswerPaper/${exam.questionId}`);
            
            if (response.data.success && response.data.data) {
                const answerPaperData = response.data.data;
                
                // Set the results data and show results page
                setCurrentResults(answerPaperData);
                setShowResults(true);
            } else {
                throw new Error(response.data.message || 'Failed to fetch answer paper details');
            }
        } catch (err) {
            console.error('Error fetching answer paper:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch answer paper details';
            toast.error(errorMessage);
        } finally {
            setViewLoading(false);
        }
    };

    // Handle back from results
    const handleBackFromResults = () => {
        setShowResults(false);
        setCurrentResults(null);
    };

    // Initial data fetch
    useEffect(() => {
        fetchCompletedTestData(0, '', '');
    }, []);

    // Fetch data when debounced search/filter terms change
    useEffect(() => {
        // Reset to first page when search/filter changes
        setCurrentPage(0);
        fetchCompletedTestData(0, debouncedSearchTerm, debouncedFilterTerm);
    }, [debouncedSearchTerm, debouncedFilterTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchCompletedTestData(newPage, debouncedSearchTerm, debouncedFilterTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
        setDebouncedSearchTerm('');
        setDebouncedFilterTerm('');
        setCurrentPage(0);
        // Fetch data without any filters
        fetchCompletedTestData(0, '', '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterTerm(e.target.value);
    };

    // Handle search on Enter key press
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(0);
            fetchCompletedTestData(0, searchTerm, filterTerm);
        }
    };

    // Handle filter on Enter key press
    const handleFilterKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedFilterTerm(filterTerm);
            setCurrentPage(0);
            fetchCompletedTestData(0, searchTerm, filterTerm);
        }
    };

    const handleDownload = () => {
        // Add download functionality for completed tests
        console.log('Download Completed Tests data');
        toast.info('Download functionality coming soon!');
    };

    // Calculate pagination display values
    const startIndex = totalElements > 0 ? (currentPage * pageSize) + 1 : 1;
    const endIndex = totalElements > 0 ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;
    const hasFilters = debouncedSearchTerm.trim() || debouncedFilterTerm.trim();

    // Generate pagination buttons
    const generatePaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            // Show all pages if total pages is less than or equal to max visible
            for (let i = 0; i < totalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Show pages with ellipsis logic
            if (currentPage < 3) {
                // Show first 5 pages
                for (let i = 0; i < maxVisibleButtons; i++) {
                    buttons.push(i);
                }
            } else if (currentPage > totalPages - 4) {
                // Show last 5 pages
                for (let i = totalPages - maxVisibleButtons; i < totalPages; i++) {
                    buttons.push(i);
                }
            } else {
                // Show current page and 2 pages on each side
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    buttons.push(i);
                }
            }
        }

        return buttons;
    };

    // Show results page if viewing results
    if (showResults && currentResults) {
        return <QuizResultsPage resultData={currentResults} onBack={handleBackFromResults} />;
    }

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Loading State with Circular Loader */}
            {loading && <CircularLoader />}

            {/* Error State */}
            {!loading && error && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500 text-lg">Error: {error}</div>
                </div>
            )}

            {/* Content - Only show when not loading and no error */}
            {!loading && !error && (
                <>
                    {/* Header Bar */}
                    <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 mt-0">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Search */}
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

                            {/* Filter */}
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

                            {/* Clear Button */}
                            <button
                                onClick={handleClear}
                                className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <X size={16} className="text-gray-500" />
                                Clear
                            </button>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <button
                                onClick={handleDownload}
                                className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer"
                            >
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
                                    <th className="!px-6 !py-4">Duration</th>
                                    <th className="!px-6 !py-4">Start Time</th>
                                    <th className="!px-6 !py-4">End Time</th>
                                    <th className="!px-6 !py-4">Total Questions</th>
                                    <th className="!px-6 !py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examData.length > 0 ? (
                                    examData.map((exam, index) => (
                                        <tr key={exam.questionId || exam.id || index} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{(currentPage * pageSize) + index + 1}</td>
                                            <td className="!px-6 !py-4">{exam.testName}</td>
                                            <td className="!px-6 !py-4">{exam.batch}</td>
                                            <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                            <td className="!px-6 !py-4">{exam.examDuration}</td>
                                            <td className="!px-6 !py-4">{exam.startTime}</td>
                                            <td className="!px-6 !py-4">{exam.endTime}</td>
                                            <td className="!px-6 !py-4">{exam.totalQuestions}</td>
                                            <td className="!px-6 !py-4">
                                                <div className="relative group inline-block">
                                                    <button
                                                        onClick={() => handleViewClick(exam)}
                                                        disabled={viewLoading}
                                                        className={`transition-colors ${
                                                            viewLoading 
                                                                ? 'text-gray-400 cursor-not-allowed' 
                                                                : 'text-[#7966F1] hover:text-[#5a4bcc] cursor-pointer'
                                                        }`}
                                                    >
                                                        {viewLoading ? (
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
                                        <td colSpan="9" className="!px-6 !py-8 text-center text-gray-500">
                                            {hasFilters ? 'No completed tests found matching your criteria' : 'No completed tests found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Enhanced Pagination */}
                        {totalElements > 0 && (
                            <div className="flex items-center justify-between !px-6 !py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex} to {endIndex} of {totalElements} completed tests
                                    {hasFilters && (
                                        <span className="text-[#7966F1] ml-2">
                                            (filtered)
                                        </span>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        {/* Previous Button */}
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

                                        {/* Pagination Buttons */}
                                        <div className="flex items-center gap-1">
                                            {generatePaginationButtons().map((pageNum) => (
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

                                        {/* Next Button */}
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
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserExamHistory;