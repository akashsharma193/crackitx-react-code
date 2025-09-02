import React, { useState, useEffect } from 'react';
import { Eye, Search, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Active Exams...
                </div>
            </div>
        </div>
    );
};

const UserActiveExams = ({ onNavigateToQuiz }) => {
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [loadingQuiz, setLoadingQuiz] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // Fetch data from API with pagination
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

            const response = await apiClient.post('/user-activity/getAllActiveTest', requestBody);

            if (response.data.success && response.data.data) {
                const transformedData = response.data.data.content.map((item, index) => ({
                    srNo: page * pageSize + index + 1,
                    testName: item.subjectName || 'N/A',
                    conductedBy: item.teacherName || 'N/A',
                    startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                    endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                    examDuration: item.examDuration || 'N/A',
                    studentCount: item.studentCount || 'N/A',
                    questionId: item.questionId,
                    orgCode: item.orgCode,
                    batch: item.batch,
                    userId: item.userId,
                    totalQuestions: item.questionList ? item.questionList.length : 0,
                    // Store the full item data for quiz navigation
                    fullData: item,
                    hideSubmitButton: false,
                }));

                setExamData(transformedData);

                const pageData = response.data.data.page;
                setTotalPages(pageData.totalPages);
                setTotalElements(pageData.totalElements);
                setCurrentPage(pageData.number);
            } else {
                throw new Error(response.data.message || 'Failed to fetch exam data');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch exam data');
            console.error('Error fetching exam data:', err);
            toast.error('Failed to fetch exam data');
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
        if (loadingQuiz) return;

        try {
            setLoadingQuiz(true);

            // Check if exam is currently active
            const now = new Date();
            const startTime = new Date(exam.fullData.startTime);
            const endTime = new Date(exam.fullData.endTime);

            if (now < startTime) {
                toast.error('Exam has not started yet');
                return;
            }

            if (now > endTime) {
                toast.error('Exam has already ended');
                return;
            }

            // Use the full data already available from the API response
            const examDetails = {
                id: exam.fullData.id,
                subjectName: exam.fullData.subjectName,
                teacherName: exam.fullData.teacherName,
                examDuration: exam.fullData.examDuration,
                questionId: exam.fullData.questionId,
                orgCode: exam.fullData.orgCode,
                batch: exam.fullData.batch,
                userId: exam.fullData.userId,
                startTime: exam.fullData.startTime,
                endTime: exam.fullData.endTime,
                questionList: exam.fullData.questionList || [],
                minusMarks: exam.fullData.minusMarks
            };

            // Calculate remaining time for the exam
            const examEndTime = new Date(exam.fullData.endTime);
            const currentTime = new Date();
            const remainingTimeInMinutes = Math.max(0, Math.floor((examEndTime - currentTime) / (1000 * 60)));
            const examDurationInMinutes = parseInt(exam.fullData.examDuration || 30);

            // Use the smaller of remaining exam time or exam duration
            examDetails.actualDuration = Math.min(remainingTimeInMinutes, examDurationInMinutes);

            if (examDetails.actualDuration <= 0) {
                toast.error('Exam time has expired');
                return;
            }

            if (!examDetails.questionList || examDetails.questionList.length === 0) {
                toast.error('No questions available for this exam');
                return;
            }

            // Navigate to quiz page
            if (onNavigateToQuiz) {
                onNavigateToQuiz(examDetails);
            }

        } catch (error) {
            console.error('Error loading quiz:', error);
            toast.error('Failed to load quiz. Please try again.');
        } finally {
            setLoadingQuiz(false);
        }
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
                                                        disabled={loadingQuiz}
                                                        className={`${loadingQuiz ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-[#5a4bcc]'} text-[#7966F1] transition-colors`}
                                                    >
                                                        {loadingQuiz ? (
                                                            <div className="w-5 h-5 border-2 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Eye size={20} />
                                                        )}
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                        {loadingQuiz ? 'Loading...' : 'Start Quiz'}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="!px-6 !py-8 text-center text-gray-500">
                                            {searchTerm || filterTerm ? 'No exams found matching your criteria' : 'No exams found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {examData.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between !px-6 !py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} exams
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

export default UserActiveExams;