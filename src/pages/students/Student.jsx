import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Download, Search, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

// Delete Confirmation Dialog
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
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');
    const [pageSize] = useState(10); // Items per page
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchStudents = async (page = 0, search = '', filter = '') => {
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

            const response = await apiClient.post(`/admin-secured/getAllUser`, requestBody);

            if (response.data.success) {
                setStudents(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                setTotalElements(response.data.data.totalElements);
                setCurrentPage(response.data.data.number);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents(0, searchTerm, filterTerm);
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '' || filterTerm !== '') {
                fetchStudents(0, searchTerm, filterTerm);
                setCurrentPage(0); // Reset to first page when searching/filtering
            }
        }, 500); // 500ms delay for debouncing

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterTerm]);

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
                toast.success('User deleted successfully!');
                setShowDeleteDialog(false);
                setUserToDelete(null);

                // Refresh the table data
                await fetchStudents(currentPage, searchTerm, filterTerm);
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
        if (newPage >= 0 && newPage < totalPages) {
            fetchStudents(newPage, searchTerm, filterTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
        // Fetch data without any filters
        fetchStudents(0, '', '');
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
            fetchStudents(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    // Handle filter on Enter key press
    const handleFilterKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchStudents(0, searchTerm, filterTerm);
            setCurrentPage(0);
        }
    };

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Loading State with Circular Loader */}
            {loading && <CircularLoader />}

            {/* Content - Only show when not loading */}
            {!loading && (
                <>
                    {/* Blue Header Bar */}
                    <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 mt-0 shadow-md">
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Search Input */}
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

                            {/* Filter Input */}
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

                            {/* Clear Button with Icon */}
                            <button
                                onClick={handleClear}
                                className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <X size={16} className="text-gray-500" />
                                Clear
                            </button>
                        </div>

                        {/* Right-Side Buttons */}
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <button className="bg-white text-[#7966F1] font-semibold !px-4 !py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                Create Student
                            </button>
                            <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer">
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
                                        <tr key={student.id} className="border-t hover:bg-gray-50">
                                            <td className="!px-6 !py-4">{currentPage * pageSize + index + 1}</td>
                                            <td className="!px-6 !py-4">{student.name}</td>
                                            <td className="!px-6 !py-4">{student.email}</td>
                                            <td className="!px-6 !py-4">{student.mobile}</td>
                                            <td className="!px-6 !py-4">{student.batch}</td>
                                            <td className="!px-6 !py-4">
                                                <Eye className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors" size={20} />
                                            </td>
                                            <td className="!px-6 !py-4">
                                                <Pencil
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleEditClick(student)}
                                                />
                                            </td>
                                            <td className="!px-6 !py-4">
                                                <Trash2
                                                    className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                    size={20}
                                                    onClick={() => handleDeleteClick(student)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="!px-6 !py-8 text-center text-gray-500">
                                            {searchTerm || filterTerm ? 'No students found matching your criteria' : 'No student data'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination - Only show if there's data */}
                        {students.length > 0 && (
                            <div className="flex items-center justify-between !px-6 !py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} students
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

            {/* Delete User Dialog */}
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