import React, { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Link, Trash2, ChevronDown, Download, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const DeleteResourceDialog = ({ isOpen, onClose, onConfirm, loading, resourceName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert!</h2>
                    <p className="text-gray-800 !mb-2">Do you want to delete this resource?</p>
                    <p className="text-sm text-gray-600 !mb-2 font-medium">{resourceName}</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> This action cannot be undone.
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
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminEResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [batches, setBatches] = useState([]);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
    const [batchSearchTerm, setBatchSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });
    const [formData, setFormData] = useState({
        batch: '',
        name: '',
        description: '',
        topic: '',
        url: '',
        file: null
    });
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);
    const batchDropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const orgCode = localStorage.getItem('orgCode');
        if (orgCode) {
            fetchBatches(orgCode);
            fetchResources(0);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        fetchResources(0, debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target)) {
                setBatchDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBatches = async (organizationName) => {
        setIsLoadingBatches(true);
        try {
            const response = await apiClient.post('/user-open/getAllBatchByOrganization', {
                organization: organizationName
            });
            if (response.data && response.data.success && response.data.data) {
                setBatches(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to load batches';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred while loading batches.');
            }
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const fetchResources = async (page = 0, search = '') => {
        setLoading(true);
        try {
            const requestBody = {
                page: {
                    size: 10,
                    number: page
                }
            };

            if (search.trim()) {
                requestBody.filter = {
                    name: search.trim()
                };
            }

            const response = await apiClient.post('/ereources/admin/getAll', requestBody);

            if (response.data) {
                setResources(response.data.content || []);
                setPagination({
                    currentPage: response.data.page?.number || 0,
                    totalPages: response.data.page?.totalPages || 0,
                    totalElements: response.data.page?.totalElements || 0,
                    pageSize: response.data.page?.size || 10
                });
            }
        } catch (error) {
            console.error('Error fetching resources:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to load resources';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred while loading resources.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, batch: batch.name }));
        setBatchSearchTerm(batch.name);
        setBatchDropdownOpen(false);
        if (errors.batch) {
            setErrors(prev => ({ ...prev, batch: '' }));
        }
    };

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
        batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            if (errors.file) {
                setErrors(prev => ({ ...prev, file: '' }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.batch.trim()) {
            newErrors.batch = 'Batch is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.topic.trim()) {
            newErrors.topic = 'Topic is required';
        }

        if (!formData.url.trim() && !formData.file) {
            newErrors.file = 'Either URL or File is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setUploading(true);

        try {
            const orgCode = localStorage.getItem('orgCode');

            if (!orgCode) {
                toast.error('Organization code not found. Please login again.');
                setUploading(false);
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('orgCode', orgCode);
            formDataToSend.append('batch', formData.batch);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('topic', formData.topic);

            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }

            if (formData.url.trim()) {
                formDataToSend.append('url', formData.url);
            } else {
                formDataToSend.append('url', '');
            }

            console.log('Uploading resource with data:', {
                orgCode,
                batch: formData.batch,
                name: formData.name,
                description: formData.description,
                topic: formData.topic,
                hasFile: !!formData.file,
                url: formData.url
            });

            const response = await apiClient.post('/ereources/upload', formDataToSend);

            console.log('Upload response:', response);

            if (response.status === 200 || response.status === 201) {
                toast.success('Resource uploaded successfully!');
                setShowModal(false);
                setFormData({
                    batch: '',
                    name: '',
                    description: '',
                    topic: '',
                    url: '',
                    file: null
                });
                setBatchSearchTerm('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                fetchResources(pagination.currentPage, debouncedSearchTerm);
            }
        } catch (error) {
            console.error('Error uploading resource:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request
            });

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to upload resource';
                console.log('API Error Response:', errorData);
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchResources(newPage, debouncedSearchTerm);
        }
    };

    const handleDeleteClick = (resource) => {
        setResourceToDelete(resource);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!resourceToDelete) return;

        try {
            setDeleteLoading(true);
            await apiClient.post(`/ereources/delete/${resourceToDelete.id}`);
            toast.success('Resource deleted successfully');
            setShowDeleteDialog(false);
            setResourceToDelete(null);
            fetchResources(pagination.currentPage, debouncedSearchTerm);
        } catch (error) {
            console.error('Error deleting resource:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to delete resource';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred while deleting resource.');
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setResourceToDelete(null);
    };

    const handleDownload = async (resourceId, resourceName) => {
        try {
            toast.info('Downloading file...');
            const response = await apiClient.get(`/ereources/download/${resourceId}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resourceName || 'resource');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to download file';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred while downloading file.');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            batch: '',
            name: '',
            description: '',
            topic: '',
            url: '',
            file: null
        });
        setBatchSearchTerm('');
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
        }
    };

    return (
        <div className="min-h-full">
            <div className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4 !mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-white">E-Resources</h2>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative min-w-[320px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by resource name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyPress={handleSearchKeyPress}
                                className="!pl-10 !pr-10 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                            />
                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white text-[#7966F1] font-semibold !px-6 !py-2 rounded-full shadow-md hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Resource
                        </button>
                    </div>
                </div>
            </div>

            <div className="!px-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-[#7966F1] text-lg font-semibold">
                                Loading Resources...
                            </div>
                        </div>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md !p-8 text-center">
                        <div className="text-gray-400 !mb-4 flex justify-center">
                            <FileText size={64} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 !mb-2">
                            {debouncedSearchTerm ? 'No Resources Found' : 'No Resources Found'}
                        </h3>
                        <p className="text-gray-500">
                            {debouncedSearchTerm
                                ? 'No resources match your search criteria'
                                : 'Click "Add Resource" to upload your first resource'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white">
                                        <tr>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">Name</th>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">Description</th>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">Topic</th>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">Batch</th>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">URL</th>
                                            <th className="!px-6 !py-4 text-left text-sm font-semibold">File</th>
                                            <th className="!px-6 !py-4 text-center text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map((resource, index) => {
                                            const hasFile = resource.fileName && resource.fileName.trim() !== '';
                                            const hasUrl = resource.url && resource.url.trim() !== '';

                                            return (
                                                <tr key={resource.id || index} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="!px-6 !py-4 text-gray-700 font-medium">{resource.name || '-'}</td>
                                                    <td className="!px-6 !py-4 text-gray-600">{resource.description || '-'}</td>
                                                    <td className="!px-6 !py-4 text-gray-700">{resource.topic}</td>
                                                    <td className="!px-6 !py-4 text-gray-600">{resource.batch}</td>
                                                    <td className="!px-6 !py-4">
                                                        {hasUrl ? (
                                                            <>
                                                                <a
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#7966F1] hover:underline truncate block max-w-xs"
                                                                >
                                                                    {resource.url}
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="!px-6 !py-4">
                                                        {hasFile ? (
                                                            <button
                                                                onClick={() => handleDownload(resource.id, resource.fileName)}
                                                                className="inline-flex items-center gap-2 text-[#7966F1] hover:text-[#6855E0] font-medium transition-colors"
                                                            >
                                                                <Download size={26} />
                                                                {resource.fileName}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="!px-6 !py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteClick(resource)}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                    );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>


                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 !mt-6">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 0}
                            className="!px-4 !py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="!px-4 !py-2 text-gray-700 font-medium">
                            Page {pagination.currentPage + 1} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                            className="!px-4 !py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </>
                )}
        </div>

            {
        showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
                    <div className="text-center !mb-6">
                        <h2 className="text-[#7966F1] text-xl font-bold !mb-3">Add New Resource</h2>
                        <p className="text-gray-600">Upload a file or provide a URL</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Batch <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={batchDropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Search Batch"
                                    value={batchSearchTerm}
                                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                                    onFocus={() => setBatchDropdownOpen(true)}
                                    disabled={uploading || isLoadingBatches}
                                    className={`w-full !px-4 !py-3 !pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.batch
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'
                                        }`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center" style={{ paddingRight: '12px', pointerEvents: 'none' }}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                                {batchDropdownOpen && (
                                    <div className="absolute w-full !mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                        {isLoadingBatches ? (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                Loading batches...
                                            </div>
                                        ) : filteredBatches.length > 0 ? (
                                            filteredBatches.map((batch) => (
                                                <div
                                                    key={batch.id}
                                                    onClick={() => handleBatchSelect(batch)}
                                                    className="!px-4 !py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-medium text-gray-900">{batch.name}</div>
                                                    <div className="text-sm text-gray-500">{batch.description}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                No batches found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {errors.batch && <p className="text-red-500 text-xs !mt-1">{errors.batch}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.name
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'
                                    }`}
                                placeholder="Enter resource name"
                                disabled={uploading}
                            />
                            {errors.name && <p className="text-red-500 text-xs !mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${errors.description
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'
                                    }`}
                                placeholder="Enter resource description"
                                disabled={uploading}
                            />
                            {errors.description && <p className="text-red-500 text-xs !mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Topic <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleInputChange}
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.topic
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'
                                    }`}
                                placeholder="Enter topic name"
                                disabled={uploading}
                            />
                            {errors.topic && <p className="text-red-500 text-xs !mt-1">{errors.topic}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                URL <span className="text-gray-500 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] bg-[#5E48EF]/5"
                                placeholder="https://example.com/resource"
                                disabled={uploading}
                            />
                        </div><div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                File <span className="text-gray-500 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] bg-[#5E48EF]/5"
                                disabled={uploading}
                            />
                            {errors.file && <p className="text-red-500 text-xs !mt-1">{errors.file}</p>}
                            {formData.file && (
                                <p className="text-sm text-gray-600 !mt-2">
                                    Selected: {formData.file.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 !mt-8">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={uploading}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md transition cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Resource'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    <DeleteResourceDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        resourceName={resourceToDelete?.name || ''}
    />
    </div >
);};
export default AdminEResources;