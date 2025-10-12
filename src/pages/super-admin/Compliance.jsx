import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';
import { Shield, AlertCircle, Trash2, Edit2, X } from 'lucide-react';

const DeleteDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert !</h2>
                    <p className="text-gray-800 !mb-2">Are you sure you want to delete this compliance rule?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> This action will deactivate the compliance rule.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                            {isDeleting ? (
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

const Compliance = () => {
    const [formData, setFormData] = useState({
        compliance: '',
        isActive: true
    });
    const [compliances, setCompliances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoadingCompliances, setIsLoadingCompliances] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        fetchCompliances();
    }, []);

    const fetchCompliances = async () => {
        setIsLoadingCompliances(true);
        try {
            const response = await apiClient.get('/compliance/getCompliance');
            if (response.data && response.data.success && response.data.data) {
                setCompliances(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching compliances:', error);
            toast.error('Failed to load compliance rules');
        } finally {
            setIsLoadingCompliances(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.compliance.trim()) {
            newErrors.compliance = 'Compliance rule is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            compliance: item.compliance,
            isActive: item.isActive
        });

        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            compliance: '',
            isActive: true
        });
        setErrors({});
    };

    const handleDeleteClick = (id) => {
        setDeleteDialog({ isOpen: true, id });
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);

        try {
            const requestBody = {
                id: deleteDialog.id,
                isActive: false
            };

            const response = await apiClient.post('/compliance/saveCompliance', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Compliance rule deleted successfully!');
                setDeleteDialog({ isOpen: false, id: null });
                fetchCompliances();
            }
        } catch (error) {
            console.error('Error deleting compliance:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'An error occurred while deleting the compliance rule';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, id: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const requestBody = {
                compliance: formData.compliance,
                isActive: formData.isActive
            };

            if (editingId) {
                requestBody.id = editingId;
            }

            const response = await apiClient.post('/compliance/saveCompliance', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success(editingId ? 'Compliance rule updated successfully!' : 'Compliance rule created successfully!');

                setFormData({
                    compliance: '',
                    isActive: true
                });
                setEditingId(null);

                fetchCompliances();
            }
        } catch (error) {
            console.error('Error saving compliance:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message ||
                    errorData?.error ||
                    errorData?.detail ||
                    'An error occurred while saving the compliance rule';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <Shield className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">Compliance Management</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <div className="w-full max-w-6xl space-y-6">
                            <div
                                ref={formRef}
                                className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10"
                            >
                                <div className="flex items-center justify-between !mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {editingId ? 'Edit Compliance Rule' : 'Add Compliance Rule'}
                                    </h3>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            <span className="text-sm">Cancel Edit</span>
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-700 !mb-1 font-medium">
                                            Compliance Rule <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="compliance"
                                            value={formData.compliance}
                                            onChange={handleInputChange}
                                            className={`w-full border rounded-md !px-4 !py-2 outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${errors.compliance
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-[#7966F1] focus:ring-[#7966F1]'
                                                }`}
                                            placeholder="Enter compliance rule or instruction"
                                            rows={4}
                                            disabled={loading}
                                        />
                                        {errors.compliance && <p className="text-red-500 text-xs !mt-1">{errors.compliance}</p>}
                                        <p className="text-xs text-gray-500 !mt-2">
                                            <AlertCircle className="w-3 h-3 inline !mr-1" />
                                            This rule will be displayed to users during exam sessions
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg !p-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7966F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7966F1]"></div>
                                        </label>
                                        <div>
                                            <label className="block text-sm text-gray-700 font-medium">
                                                Active Status
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                Enable this rule to be enforced immediately
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center !mt-8">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer ${loading
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:opacity-90'
                                            }`}
                                    >
                                        {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Compliance Rule' : 'Add Compliance Rule')}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10 !mt-4">
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">Existing Compliance Rules</h3>

                                {isLoadingCompliances ? (
                                    <div className="text-center !py-8 text-gray-500">
                                        Loading compliance rules...
                                    </div>
                                ) : compliances.length > 0 ? (
                                    <div className="space-y-4">
                                        {compliances.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`border rounded-lg !p-4 hover:shadow-md transition-shadow !mb-4 ${editingId === item.id ? 'border-[#7966F1] bg-purple-50' : 'border-gray-200'}`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 !mb-2">
                                                            <Shield className="w-4 h-4 text-[#7966F1]" />
                                                            <span className={`text-xs font-medium !px-2 !py-1 rounded-full ${item.isActive
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {item.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                            {editingId === item.id && (
                                                                <span className="text-xs font-medium !px-2 !py-1 rounded-full bg-purple-100 text-purple-700">
                                                                    Editing
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-800 leading-relaxed">
                                                            {item.compliance}
                                                        </p>
                                                        {item.created && (
                                                            <p className="text-xs text-gray-400 !mt-2">
                                                                Created: {new Date(item.created).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center !py-8 text-gray-500">
                                        <Shield className="w-12 h-12 mx-auto !mb-3 text-gray-300" />
                                        <p>No compliance rules found</p>
                                        <p className="text-sm text-gray-400 !mt-1">Add your first compliance rule above</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Compliance;