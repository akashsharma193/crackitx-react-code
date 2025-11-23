import React, { useState, useEffect } from 'react';
import { FileText, Link, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const StudentEResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 10
    });

    useEffect(() => {
        fetchResources(0);
    }, []);

    const fetchResources = async (page = 0) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/ereources/admin/getAll', {
                page: {
                    size: 10,
                    number: page
                }
            });

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

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchResources(newPage);
        }
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

    return (
        <div className="min-h-full">
            <div className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4 !mb-6">
                <h2 className="text-2xl font-bold text-white">E-Resources</h2>
            </div>

            <div className="!px-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading resources...</div>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md !p-8 text-center">
                        <div className="text-gray-400 !mb-4 flex justify-center">
                            <FileText size={64} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 !mb-2">No Resources Found</h3>
                        <p className="text-gray-500">No resources are currently available</p>
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
                                                            <a
                                                                href={resource.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[#7966F1] hover:underline truncate block max-w-xs"
                                                            >
                                                                {resource.url}
                                                            </a>
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
                                                                <Download size={16} />
                                                                {resource.fileName}
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
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
        </div>
    );
};

export default StudentEResources;