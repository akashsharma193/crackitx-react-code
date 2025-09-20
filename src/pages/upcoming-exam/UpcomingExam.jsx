import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, X, Download, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const DeleteExamDialog = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert !</h2>
                    <p className="text-gray-800 !mb-2">Do you want to delete the test?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> Test once deleted cannot be restored.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
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
                    Loading Upcoming Exams...
                </div>
            </div>
        </div>
    );
};

const UpcomingExam = () => {
    const navigate = useNavigate();
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

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

            const response = await apiClient.post('/questionPaper/getUpcomingExam', requestBody);

            if (response.data.success && response.data.data) {
                const transformedData = response.data.data.content.map((item, index) => ({
                    srNo: page * pageSize + index + 1,
                    testName: item.subjectName || 'N/A',
                    conductedBy: item.teacherName || 'N/A',
                    startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                    endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                    examDuration: item.examDuration ? `${item.examDuration} mins` : 'N/A',
                    isVisible: item.isVisible !== undefined ? item.isVisible : true,
                    questionId: item.questionId,
                    orgCode: item.orgCode,
                    batch: item.batch,
                    userId: item.userId,
                    id: item.id || item.questionId,
                    originalData: item
                }));

                setExamData(transformedData);
                setTotalPages(response.data.data.page.totalPages);
                setTotalElements(response.data.data.page.totalElements);
                setCurrentPage(response.data.data.page.number);
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

    const handleViewClick = (exam) => {
        console.log('Navigate to view exam:', exam);
    };

    const handleEditClick = (exam) => {
        console.log('Navigate to edit exam:', exam);

        const formatDateTimeForInput = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        const examEditData = {
            id: exam.id || exam.questionId,
            subjectName: exam.originalData.subjectName || '',
            teacherName: exam.originalData.teacherName || '',
            batch: exam.originalData.batch || '',
            examDuration: exam.originalData.examDuration ? `${exam.originalData.examDuration} mins` : '30 mins',
            startTime: formatDateTimeForInput(exam.originalData.startTime),
            endTime: formatDateTimeForInput(exam.originalData.endTime),
            isActive: exam.originalData.isActive !== undefined ? exam.originalData.isActive : true,
            questionList: exam.originalData.questionList || [],
            orgCode: exam.originalData.orgCode || localStorage.getItem('orgCode'),
            userId: exam.originalData.userId
        };

        navigate('/edit-upcoming-exam', {
            state: {
                examData: examEditData,
                isEdit: true
            }
        });
    };

    const handleToggleVisibility = async (index, exam) => {
        try {
            setExamData(prevData =>
                prevData.map((examItem, i) =>
                    i === index ? { ...examItem, isVisible: !examItem.isVisible } : examItem
                )
            );

            toast.success('Exam visibility updated successfully!');
        } catch (error) {
            setExamData(prevData =>
                prevData.map((examItem, i) =>
                    i === index ? { ...examItem, isVisible: exam.isVisible } : examItem
                )
            );
            toast.error('Failed to update exam visibility');
        }
    };

    const handleDeleteClick = (exam) => {
        setExamToDelete(exam);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!examToDelete) return;

        try {
            setDeleteLoading(true);

            const requestBody = {
                id: examToDelete.id || examToDelete.questionId
            };

            const response = await apiClient.post('/questionPaper/deleteQuestionPaper', requestBody);

            if (response.data.success) {
                toast.success('Exam deleted successfully!');
                setShowDeleteDialog(false);
                setExamToDelete(null);
                await fetchExamData(currentPage, searchTerm, filterTerm);
            } else {
                toast.error(response.data.message || 'Failed to delete exam');
            }
        } catch (error) {
            console.error('Error deleting exam:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete exam. Please try again.';
            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setExamToDelete(null);
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
                                    <th className="!px-4 !py-4">Edit</th>
                                    <th className="!px-4 !py-4">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examData.length > 0 ? (
                                    examData.map((exam, index) => (
                                        <tr key={exam.questionId || exam.id || index} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{exam.srNo}</td>
                                            <td className="!px-6 !py-4">{exam.testName}</td>
                                            <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                            <td className="!px-6 !py-4">{exam.startTime}</td>
                                            <td className="!px-6 !py-4">{exam.endTime}</td>
                                            <td className="!px-6 !py-4">
                                                <div className="relative group inline-block">
                                                    <Edit
                                                        className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                        size={20}
                                                        onClick={() => handleEditClick(exam)}
                                                    />
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                        Edit
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="!px-6 !py-4">
                                                <div className="relative group inline-block">
                                                    <Trash2
                                                        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                        size={20}
                                                        onClick={() => handleDeleteClick(exam)}
                                                    />
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                        Delete
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="!px-6 !py-8 text-center text-gray-500">
                                            {searchTerm || filterTerm ? 'No upcoming exams found matching your criteria' : 'No upcoming exams found'}
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

            <DeleteExamDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />
        </div>
    );
};

export default UpcomingExam;