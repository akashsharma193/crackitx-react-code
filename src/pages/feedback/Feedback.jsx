import React, { useState, useEffect } from 'react';
import { Eye, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const FeedbackDialog = ({ isOpen, onClose, feedback }) => {
    if (!isOpen || !feedback) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-2xl w-full mx-4 border border-gray-200 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center !mb-6">
                    <h2 className="text-[#7966F1] text-2xl font-bold">Feedback Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 !mb-2">User ID</label>
                        <div className="bg-gray-50 !px-4 !py-3 rounded-lg border border-gray-200">
                            {feedback.userId || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 !mb-2">User Name</label>
                        <div className="bg-gray-50 !px-4 !py-3 rounded-lg border border-gray-200">
                            {feedback.username || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 !mb-2">Feedback</label>
                        <div className="bg-gray-50 !px-4 !py-3 rounded-lg border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                            {feedback.feedback || 'N/A'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 !mb-2">Submitted On</label>
                        <div className="bg-gray-50 !px-4 !py-3 rounded-lg border border-gray-200">
                            {feedback.created ? new Date(feedback.created).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }) : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end !mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Feedback Data...
                </div>
            </div>
        </div>
    );
};

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pageSize] = useState(10);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchFeedbacks = async (page = 0, search = '') => {
        try {
            setLoading(true);

            const filterObj = {};

            if (search.trim()) {
                filterObj.username = search.trim();
            }

            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: filterObj,
                sortDirection: "DESC"
            };

            console.log('Fetching feedbacks with params:', { requestBody });

            const response = await apiClient.post('/user-secured/getFeedback', requestBody);

            if (response.data.success) {
                const responseData = response.data.data;

                const content = Array.isArray(responseData.content) ? responseData.content : [];
                const pageInfo = responseData.page || {};

                const totalPages = typeof pageInfo.totalPages === 'number' ? pageInfo.totalPages : 0;
                const totalElements = typeof pageInfo.totalElements === 'number' ? pageInfo.totalElements : 0;
                const currentPageNumber = typeof pageInfo.number === 'number' ? pageInfo.number : 0;

                setFeedbacks(content);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
                setCurrentPage(currentPageNumber);

                console.log('Feedbacks data updated:', {
                    feedbacksCount: content.length,
                    totalPages,
                    totalElements,
                    currentPage: currentPageNumber
                });
            } else {
                throw new Error(response.data.message || 'Failed to fetch feedbacks');
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            toast.error('Failed to fetch feedbacks data');
            setFeedbacks([]);
            setTotalPages(0);
            setTotalElements(0);
            setCurrentPage(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks(0, '');
    }, []);

    useEffect(() => {
        setCurrentPage(0);
        fetchFeedbacks(0, debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    const handleViewClick = (feedback) => {
        setSelectedFeedback(feedback);
        setShowFeedbackDialog(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchFeedbacks(newPage, debouncedSearchTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setCurrentPage(0);
        fetchFeedbacks(0, '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(0);
            fetchFeedbacks(0, searchTerm);
        }
    };

    const startIndex = totalElements > 0 ? (currentPage * pageSize) + 1 : 1;
    const endIndex = totalElements > 0 ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;
    const hasFilters = debouncedSearchTerm.trim();

    const generatePaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 0; i < totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage < 3) {
                for (let i = 0; i < maxVisibleButtons; i++) {
                    buttons.push(i);
                }
            } else if (currentPage > totalPages - 4) {
                for (let i = totalPages - maxVisibleButtons; i < totalPages; i++) {
                    buttons.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    buttons.push(i);
                }
            }
        }

        return buttons;
    };

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 mt-0 shadow-md">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by User Name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchKeyPress}
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
            </div>

            {loading && <CircularLoader />}

            {!loading && (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1] !m-8 !mt-8">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-white text-[#7966F1] font-bold border-b">
                            <tr>
                                <th className="!px-6 !py-4">Sr.no.</th>
                                <th className="!px-6 !py-4">User ID</th>
                                <th className="!px-6 !py-4">User Name</th>
                                <th className="!px-6 !py-4">Submitted On</th>
                                <th className="!px-6 !py-4">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.length > 0 ? (
                                feedbacks.map((feedback, index) => (
                                    <tr key={feedback.id || index} className="border-t hover:bg-gray-50">
                                        <td className="!px-6 !py-4">{(currentPage * pageSize) + index + 1}</td>
                                        <td className="!px-6 !py-4">{feedback.userId || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{feedback.username || 'N/A'}</td>
                                        <td className="!px-6 !py-4">
                                            {feedback.created ? new Date(feedback.created).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }) : 'N/A'}
                                        </td>
                                        <td className="!px-6 !py-4">
                                            <div className="relative group inline-block">
                                                <Eye
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleViewClick(feedback)}
                                                />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    View
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="!px-6 !py-8 text-center text-gray-500">
                                        {hasFilters ? 'No feedbacks found matching your criteria' : 'No feedback data available'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalElements > 0 && (
                        <div className="flex items-center justify-between !px-6 !py-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex} to {endIndex} of {totalElements} feedbacks
                                {hasFilters && (
                                    <span className="text-[#7966F1] ml-2">
                                        (filtered)
                                    </span>
                                )}
                            </div>

                            {totalPages > 1 && (
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
            )}

            <FeedbackDialog
                isOpen={showFeedbackDialog}
                onClose={() => setShowFeedbackDialog(false)}
                feedback={selectedFeedback}
            />
        </div>
    );
};

export default Feedback;