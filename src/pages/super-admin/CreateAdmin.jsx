import React, { useState, useEffect } from 'react';
import { Eye, Edit, Download, Search, X, ChevronLeft, ChevronRight, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const DeleteDialog = ({ isOpen, onClose, onConfirm, loading, type }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert!</h2>
                    <p className="text-gray-800 !mb-2">Do you want to disable this {type}?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> This action will deactivate the {type} account.
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
                    Loading Data...
                </div>
            </div>
        </div>
    );
};

const CreateAdmin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('admin');
    const [admins, setAdmins] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [debouncedSelectedOrg, setDebouncedSelectedOrg] = useState('');
    const [debouncedSelectedBatch, setDebouncedSelectedBatch] = useState('');
    const [pageSize] = useState(10);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [allOrganizations, setAllOrganizations] = useState([]);
    const [allStudentsData, setAllStudentsData] = useState([]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setDebouncedSelectedOrg(selectedOrg);
            setDebouncedSelectedBatch(selectedBatch);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedOrg, selectedBatch]);

    const fetchAllOrganizationsAndBatches = async () => {
        try {
            if (activeTab === 'admin') {
                const requestBody = {
                    pageSize: 1000,
                    pageNumber: 0,
                    filter: {}
                };

                const response = await apiClient.post('/superAdmin/getAllAdmin', requestBody);

                if (response.data.success) {
                    const content = response.data.data.content || [];
                    const uniqueOrgs = [...new Set(content.map(admin => admin.orgCode).filter(Boolean))];
                    setAllOrganizations(uniqueOrgs);
                }
            } else {
                const requestBody = {
                    pageSize: 1000,
                    pageNumber: 0,
                    filter: {}
                };

                const response = await apiClient.post('/admin-secured/getAllUserSuperAdmin', requestBody);

                if (response.data.success) {
                    const content = response.data.data.content || [];
                    setAllStudentsData(content);
                    const uniqueOrgs = [...new Set(content.map(student => student.orgCode).filter(Boolean))];
                    setAllOrganizations(uniqueOrgs);
                }
            }
        } catch (error) {
            console.error('Error fetching organizations and batches:', error);
        }
    };

    const fetchAdmins = async (page = 0, search = '', orgCode = '') => {
        try {
            setLoading(true);

            const filterObj = {};

            if (search.trim()) {
                filterObj.name = search.trim();
            }

            if (orgCode.trim()) {
                filterObj.orgCode = orgCode.trim();
            }

            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: filterObj
            };

            const response = await apiClient.post('/superAdmin/getAllAdmin', requestBody);

            if (response.data.success) {
                const responseData = response.data.data;

                const content = Array.isArray(responseData.content) ? responseData.content : [];
                const pageInfo = responseData.page || {};

                const totalPages = typeof pageInfo.totalPages === 'number' ? pageInfo.totalPages : 0;
                const totalElements = typeof pageInfo.totalElements === 'number' ? pageInfo.totalElements : 0;
                const currentPageNumber = typeof pageInfo.number === 'number' ? pageInfo.number : 0;

                setAdmins(content);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
                setCurrentPage(currentPageNumber);
            } else {
                throw new Error(response.data.message || 'Failed to fetch admins');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
            toast.error('Failed to fetch admins data');
            setAdmins([]);
            setTotalPages(0);
            setTotalElements(0);
            setCurrentPage(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (page = 0, search = '', orgCode = '', batch = '') => {
        try {
            setLoading(true);

            const filterObj = {};

            if (search.trim()) {
                filterObj.name = search.trim();
            }

            if (orgCode.trim()) {
                filterObj.orgCode = orgCode.trim();
            }

            if (batch.trim()) {
                filterObj.batch = batch.trim();
            }

            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: filterObj
            };

            const response = await apiClient.post('/admin-secured/getAllUserSuperAdmin', requestBody);

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

    useEffect(() => {
        if (activeTab === 'admin') {
            fetchAdmins(0, '', '');
            fetchAllOrganizationsAndBatches();
        } else {
            fetchStudents(0, '', '', '');
            fetchAllOrganizationsAndBatches();
        }
    }, [activeTab]);

    useEffect(() => {
        setCurrentPage(0);
        if (activeTab === 'admin') {
            fetchAdmins(0, debouncedSearchTerm, debouncedSelectedOrg);
        } else {
            fetchStudents(0, debouncedSearchTerm, debouncedSelectedOrg, debouncedSelectedBatch);
        }
    }, [debouncedSearchTerm, debouncedSelectedOrg, debouncedSelectedBatch]);

    const handleEditClick = (item) => {
        if (activeTab === 'admin') {
            navigate(`/edit-admin/${item.id}`, {
                state: { admin: item }
            });
        } else {
            navigate(`/edit-user/${item.id}`, {
                state: { student: item, fromSuperAdmin: true }
                
            });
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        try {
            setDeleteLoading(true);

            const requestBody = {
                id: itemToDelete.id,
                isActive: false
            };

            const endpoint = activeTab === 'admin' ? '/superAdmin/enableDisableUser' : '/admin-secured/enableDisableUser';
            const response = await apiClient.post(endpoint, requestBody);

            if (response.data.success) {
                toast.success(`${activeTab === 'admin' ? 'Admin' : 'Student'} disabled successfully!`);
                setShowDeleteDialog(false);
                setItemToDelete(null);

                if (activeTab === 'admin') {
                    await fetchAdmins(currentPage, debouncedSearchTerm, debouncedSelectedOrg);
                } else {
                    await fetchStudents(currentPage, debouncedSearchTerm, debouncedSelectedOrg, debouncedSelectedBatch);
                }
            } else {
                throw new Error(response.data.message || `Failed to disable ${activeTab}`);
            }
        } catch (error) {
            console.error(`Error disabling ${activeTab}:`, error);
            toast.error(`Failed to disable ${activeTab}. Please try again.`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            if (activeTab === 'admin') {
                fetchAdmins(newPage, debouncedSearchTerm, debouncedSelectedOrg);
            } else {
                fetchStudents(newPage, debouncedSearchTerm, debouncedSelectedOrg, debouncedSelectedBatch);
            }
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedOrg('');
        setSelectedBatch('');
        setDebouncedSearchTerm('');
        setDebouncedSelectedOrg('');
        setDebouncedSelectedBatch('');
        setCurrentPage(0);
        if (activeTab === 'admin') {
            fetchAdmins(0, '', '');
        } else {
            fetchStudents(0, '', '', '');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOrgChange = (e) => {
        setSelectedOrg(e.target.value);
        setSelectedBatch('');
    };

    const handleBatchChange = (e) => {
        setSelectedBatch(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(0);
            if (activeTab === 'admin') {
                fetchAdmins(0, searchTerm, selectedOrg);
            } else {
                fetchStudents(0, searchTerm, selectedOrg, selectedBatch);
            }
        }
    };

    const handleCreateAdminClick = () => {
        navigate('/create-new-admin');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
        setSelectedOrg('');
        setSelectedBatch('');
        setDebouncedSearchTerm('');
        setDebouncedSelectedOrg('');
        setDebouncedSelectedBatch('');
        setCurrentPage(0);
    };

    const startIndex = totalElements > 0 ? (currentPage * pageSize) + 1 : 1;
    const endIndex = totalElements > 0 ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;
    const hasFilters = activeTab === 'admin' 
        ? (debouncedSearchTerm.trim() || debouncedSelectedOrg.trim())
        : (debouncedSearchTerm.trim() || debouncedSelectedOrg.trim() || debouncedSelectedBatch.trim());

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

    const getFilteredBatches = () => {
        if (!selectedOrg) {
            return [];
        }
        const filteredStudents = allStudentsData.filter(student => student.orgCode === selectedOrg);
        const batches = [...new Set(filteredStudents.map(student => student.batch).filter(Boolean))];
        return batches;
    };

    const currentData = activeTab === 'admin' ? admins : students;

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
                        <select
                            value={selectedOrg}
                            onChange={handleOrgChange}
                            className="appearance-none !pl-4 !pr-10 !py-2 rounded-md bg-white text-gray-600 border-none outline-none w-full cursor-pointer"
                        >
                            <option value="">All Organizations</option>
                            {allOrganizations.map((org, index) => (
                                <option key={index} value={org}>{org}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    {activeTab === 'student' && (
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedBatch}
                                onChange={handleBatchChange}
                                disabled={!selectedOrg}
                                className={`appearance-none !pl-4 !pr-10 !py-2 rounded-md bg-white text-gray-600 border-none outline-none w-full ${!selectedOrg ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                                <option value="">All Batches</option>
                                {getFilteredBatches().map((batch, index) => (
                                    <option key={index} value={batch}>{batch}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    )}

                    <button
                        onClick={handleClear}
                        className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <X size={16} className="text-gray-500" />
                        Clear
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    {activeTab === 'admin' && (
                        <button
                            onClick={handleCreateAdminClick}
                            className="bg-white text-[#7966F1] font-semibold !px-4 !py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            Create Admin
                        </button>
                    )}
                    <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition cursor-pointer">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white !px-6 !py-4 shadow-sm border-b">
                <div className="flex gap-4">
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={`!px-6 !py-2 rounded-lg font-semibold transition ${
                            activeTab === 'admin'
                                ? 'bg-[#7966F1] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => handleTabChange('student')}
                        className={`!px-6 !py-2 rounded-lg font-semibold transition ${
                            activeTab === 'student'
                                ? 'bg-[#7966F1] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Student
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
                                <th className="!px-6 !py-4">Organization</th>
                                {activeTab === 'student' && <th className="!px-6 !py-4">Batch</th>}
                                <th className="!px-6 !py-4">Edit</th>
                                <th className="!px-6 !py-4">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                    <tr key={item.id || index} className="border-t hover:bg-gray-50">
                                        <td className="!px-6 !py-4">{(currentPage * pageSize) + index + 1}</td>
                                        <td className="!px-6 !py-4">{item.name || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{item.email || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{item.mobile || 'N/A'}</td>
                                        <td className="!px-6 !py-4">{item.orgCode || 'N/A'}</td>
                                        {activeTab === 'student' && <td className="!px-6 !py-4">{item.batch || 'N/A'}</td>}
                                        <td className="!px-6 !py-4">
                                            <div className="relative group inline-block">
                                                <Edit
                                                    className="text-[#7966F1] cursor-pointer hover:text-[#5a4bcc] transition-colors"
                                                    size={20}
                                                    onClick={() => handleEditClick(item)}
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
                                                    onClick={() => handleDeleteClick(item)}
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
                                    <td colSpan={activeTab === 'admin' ? "7" : "8"} className="!px-6 !py-8 text-center text-gray-500">
                                        {hasFilters ? `No ${activeTab}s found matching your criteria` : `No ${activeTab} data available`}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {totalElements > 0 && (
                        <div className="flex items-center justify-between !px-6 !py-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex} to {endIndex} of {totalElements} {activeTab}s
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

            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                type={activeTab}
            />
        </div>
    );
};

export default CreateAdmin;