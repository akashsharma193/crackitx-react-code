import React, { useState, useEffect } from 'react';
import { Eye, Download, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Past Exams...
                </div>
            </div>
        </div>
    );
};

const PastExams = () => {
    const navigate = useNavigate();

    // State management
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10); // Items per page

    // Fetch data from API with pagination using getPastExam
    const fetchPastExamData = async (page = 0, search = '', filter = '') => {
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

            console.log('Fetching past exams with body:', requestBody);
            const response = await apiClient.post('/questionPaper/getPastExam', requestBody);

            if (response.data.success && response.data.data) {
                // Transform API data to match the component's expected format
                const transformedData = response.data.data.content.map((item, index) => ({
                    srNo: page * pageSize + index + 1,
                    testName: item.subjectName || 'N/A',
                    batch: item.batch || 'N/A',
                    conductedBy: item.teacherName || 'N/A',
                    examDuration: item.duration ? `${item.duration} mins` : 'N/A',
                    studentCount: item.totalStudents || item.studentCount || 0,
                    startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                    endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                    questionId: item.questionId,
                    orgCode: item.orgCode,
                    userId: item.userId,
                    id: item.id || item.questionId, // Add id for navigation
                    // Additional fields that might be useful
                    status: item.status || 'Completed',
                    avgScore: item.avgScore || 0
                }));

                setExamData(transformedData);
                setTotalPages(response.data.data.totalPages);
                setTotalElements(response.data.data.totalElements);
                setCurrentPage(response.data.data.number);
            } else {
                throw new Error(response.data.message || 'Failed to fetch past exam data');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch past exam data';
            setError(errorMessage);
            console.error('Error fetching past exam data:', err);
            toast.error('Failed to fetch past exam data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPastExamData(0, searchTerm, filterTerm);
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '' || filterTerm !== '') {
                fetchPastExamData(0, searchTerm, filterTerm);
                setCurrentPage(0); // Reset to first page when searching/filtering
            }
        }, 500); // 500ms delay for debouncing

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterTerm]);

    const handleViewClick = (exam) => {
        // Navigate to past exam details page
        navigate(`/past-exam-details/${exam.id}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchPastExamData(newPage, searchTerm, filterTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
        // Fetch data without any filters
        fetchPastExamData(0, '', '');
        setCurrentPage(0);
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
            fetchPastExamData(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    // Handle filter on Enter key press
    const handleFilterKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchPastExamData(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    const handleDownload = () => {
        // Add download functionality for past exams
        console.log('Download past exams data');
        toast.info('Download functionality coming soon!');
    };

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
                                    <th className="!px-6 !py-4">Exam Duration</th>
                                    <th className="!px-6 !py-4">Student Count</th>
                                    <th className="!px-6 !py-4">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examData.length > 0 ? (
                                    examData.map((exam, index) => (
                                        <tr key={exam.questionId || exam.id || index} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{exam.srNo}</td>
                                            <td className="!px-6 !py-4">{exam.testName}</td>
                                            <td className="!px-6 !py-4">{exam.batch}</td>
                                            <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                            <td className="!px-6 !py-4">{exam.examDuration}</td>
                                            <td className="!px-6 !py-4">{exam.studentCount}</td>
                                            <td className="!px-6 !py-4">
                                                <Eye
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleViewClick(exam)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="!px-6 !py-8 text-center text-gray-500">
                                            {searchTerm || filterTerm ? 'No past exams found matching your criteria' : 'No past exams found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination - Only show if there's data */}
                        {examData.length > 0 && (
                            <div className="flex items-center justify-between !px-6 !py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} past exams
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
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i;
                                            } else if (currentPage < 3) {
                                                pageNum = i;
                                            } else if (currentPage > totalPages - 4) {
                                                pageNum = totalPages - 5 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
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
                                            );
                                        })}
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

export default PastExams;