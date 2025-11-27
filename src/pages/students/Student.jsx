import React, { useState, useEffect } from 'react';
import { Eye, Edit, Download, Search, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const DeleteUserDialog = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert!</h2>
                    <p className="text-gray-800 !mb-2">Do you want to disable this user?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> This action will deactivate the user account.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? 'Disabling...' : 'Disable'}
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
                    Loading Students Data...
                </div>
            </div>
        </div>
    );
};

const Students = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debouncedFilterTerm, setDebouncedFilterTerm] = useState('');
    const [pageSize] = useState(10);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setDebouncedFilterTerm(filterTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterTerm]);

    const fetchStudents = async (page = 0, search = '', filter = '', tab = 'active') => {
        try {
            setLoading(true);

            const filterObj = {};

            if (search.trim()) {
                filterObj.name = search.trim();
            }

            if (filter.trim()) {
                filterObj.batch = filter.trim();
            }

            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: filterObj
            };

            const endpoint = tab === 'active' ? '/admin-secured/getAllUser' : '/admin-secured/getAllInactiveUser';

            console.log('Fetching students with params:', { endpoint, requestBody });

            const response = await apiClient.post(endpoint, requestBody);

            if (response.data.success) {
                const responseData = response.data.data;

                const content = Array.isArray(responseData.content) ? responseData.content : [];
                const pageInfo = responseData.page || {};

                const totalPages = typeof pageInfo.totalPages === 'number' ? pageInfo.totalPages : 0;
                const totalElements = typeof pageInfo.totalElements === 'number' ? pageInfo.totalElements : 0;
                const currentPageNumber = typeof pageInfo.number === 'number' ? pageInfo.number : 0;

                setStudents(content);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
                setCurrentPage(currentPageNumber);

                console.log('Students data updated:', {
                    studentsCount: content.length,
                    totalPages,
                    totalElements,
                    currentPage: currentPageNumber
                });
            } else {
                throw new Error(response.data.message || 'Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students data');
            setStudents([]);
            setTotalPages(0);
            setTotalElements(0);
            setCurrentPage(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStudentsForDownload = async () => {
        try {
            const filterObj = {};

            if (debouncedSearchTerm.trim()) {
                filterObj.name = debouncedSearchTerm.trim();
            }

            if (debouncedFilterTerm.trim()) {
                filterObj.batch = debouncedFilterTerm.trim();
            }

            const requestBody = {
                pageSize: totalElements || 10000,
                pageNumber: 0,
                filter: filterObj
            };

            const endpoint = activeTab === 'active' ? '/admin-secured/getAllUser' : '/admin-secured/getAllInactiveUser';

            const response = await apiClient.post(endpoint, requestBody);

            if (response.data.success) {
                const responseData = response.data.data;
                const content = Array.isArray(responseData.content) ? responseData.content : [];
                return content;
            } else {
                throw new Error(response.data.message || 'Failed to fetch students');
            }
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw error;
        }
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) {
            return '';
        }

        const headers = ['Sr.No.', 'Name', 'Email', 'Phone Number', 'Batch'];
        const csvRows = [];

        csvRows.push(headers.join(','));

        data.forEach((student, index) => {
            const row = [
                index + 1,
                `"${(student.name || 'N/A').replace(/"/g, '""')}"`,
                `"${(student.email || 'N/A').replace(/"/g, '""')}"`,
                `"${(student.mobile || 'N/A').replace(/"/g, '""')}"`,
                `"${(student.batch || 'N/A').replace(/"/g, '""')}"`,
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    };

    const handleDownloadCSV = async () => {
        try {
            setDownloadLoading(true);

            const allStudents = await fetchAllStudentsForDownload();

            if (!allStudents || allStudents.length === 0) {
                toast.warning('No students data to download');
                return;
            }

            const csv = convertToCSV(allStudents);

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            const timestamp = new Date().toISOString().split('T')[0];
            const fileName = `students_${activeTab}_${timestamp}.csv`;

            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            toast.success('CSV downloaded successfully!');
        } catch (error) {
            console.error('Error downloading CSV:', error);
            toast.error('Failed to download CSV. Please try again.');
        } finally {
            setDownloadLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents(0, '', '', activeTab);
    }, []);

    useEffect(() => {
        setCurrentPage(0);
        fetchStudents(0, debouncedSearchTerm, debouncedFilterTerm, activeTab);
    }, [debouncedSearchTerm, debouncedFilterTerm]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
        setFilterTerm('');
        setDebouncedSearchTerm('');
        setDebouncedFilterTerm('');
        setCurrentPage(0);
        fetchStudents(0, '', '', tab);
    };

    const handleViewClick = (student) => {
        navigate(`/user-details/${student.userId}`, {
            state: { student: student }
        });
    };

    const handleEditClick = (student) => {
        navigate(`/edit-user/${student.id}`, {
            state: { student: student }
        });
    };

    const handleDeleteClick = (student) => {
        setUserToDelete(student);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            setDeleteLoading(true);

            const requestBody = {
                id: userToDelete.id,
                isActive: false
            };

            const response = await apiClient.post('/admin-secured/enableDisableUser', requestBody);

            if (response.data.success) {
                toast.success('User disabled successfully!');
                setShowDeleteDialog(false);
                setUserToDelete(null);

                await fetchStudents(currentPage, debouncedSearchTerm, debouncedFilterTerm, activeTab);
            } else {
                throw new Error(response.data.message || 'Failed to disable user');
            }
        } catch (error) {
            console.error('Error disabling user:', error);
            toast.error('Failed to disable user. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setUserToDelete(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchStudents(newPage, debouncedSearchTerm, debouncedFilterTerm, activeTab);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
        setDebouncedSearchTerm('');
        setDebouncedFilterTerm('');
        setCurrentPage(0);
        fetchStudents(0, '', '', activeTab);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterTerm(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(0);
            fetchStudents(0, searchTerm, filterTerm, activeTab);
        }
    };

    const handleFilterKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedFilterTerm(filterTerm);
            setCurrentPage(0);
            fetchStudents(0, searchTerm, filterTerm, activeTab);
        }
    };

    const handleCreateStudentClick = () => {
        navigate('/create-student');
    };

    const startIndex = totalElements > 0 ? (currentPage * pageSize) + 1 : 1;
    const endIndex = totalElements > 0 ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;
    const hasFilters = debouncedSearchTerm.trim() || debouncedFilterTerm.trim();

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
                            placeholder="Search by name..."
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
                            placeholder="Filter by batch..."
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
                    <button
                        onClick={handleCreateStudentClick}
                        className="bg-white text-[#7966F1] font-semibold !px-4 !py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        Create Student
                    </button>
                    <button 
                        onClick={handleDownloadCSV}
                        disabled={downloadLoading || students.length === 0}
                        className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
                    >
                        {downloadLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Download size={20} />
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white border-b border-gray-200 !px-8 !pt-4">
                <div className="flex gap-1">
                    <button
                        onClick={() => handleTabChange('active')}
                        className={`!px-6 !py-3 font-semibold text-sm rounded-t-lg transition-all ${
                            activeTab === 'active'
                                ? 'bg-[#7966F1] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Active Users
                    </button>
                    <button
                        onClick={() => handleTabChange('inactive')}
                        className={`!px-6 !py-3 font-semibold text-sm rounded-t-lg transition-all ${
                            activeTab === 'inactive'
                                ? 'bg-[#7966F1] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Inactive Users
                    </button>
                </div>
            </div>

            {loading && <CircularLoader />}

            {!loading && (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1] !m-8 !mt-2">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-white text-[#7966F1] font-bold border-b">
                            <tr>
                                <th className="!px-6 !py-4">Sr.no.</th>
                                <th className="!px-6 !py-4">Name</th>
                                <th className="!px-6 !py-4">Email Id</th>
                                <th className="!px-6 !py-4">Phone Number</th>
                                <th className="!px-6 !py-4">Batch</th>
                                <th className="!px-6 !py-4">View</th>
                                <th className="!px-6 !py-4">Edit</th>
                                <th className="!px-6 !py-4">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student.id || index} className="border-t hover:bg-gray-50">
                                        <td className="!px-6 !py-4">{(currentPage * pageSize) + index + 1}</td>
                                        <td className="!px-6 !py-4">{student.name || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{student.email || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{student.mobile || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{student.batch || 'N/A'}</td>
                                        <td className="!px-6 !py-4">
                                            <div className="relative group inline-block">
                                                <Eye
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleViewClick(student)}
                                                />
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 !mb-2 !px-2 !py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    View
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4">
                                            <div className="relative group inline-block">
                                                <Edit
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleEditClick(student)}
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
                                                    onClick={() => handleDeleteClick(student)}
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
                                    <td colSpan="8" className="!px-6 !py-8 text-center text-gray-500">
                                        {hasFilters ? 'No students found matching your criteria' : `No ${activeTab} student data available`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalElements > 0 && (
                        <div className="flex items-center justify-between !px-6 !py-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex} to {endIndex} of {totalElements} students
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

            <DeleteUserDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />
        </div>
    );
};

export default Students;