import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';
import { Settings, Shield, Wifi, Monitor, Users, Edit2, Trash2 } from 'lucide-react';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert !</h2>
                    <p className="text-gray-800 !mb-2">Are you sure you want to delete this configuration?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> This action cannot be undone.
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
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
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

const Configuration = () => {
    const [formData, setFormData] = useState({
        activationMode: 'NOT_REQUIRED',
        isInternetDisabled: false,
        isTabSwitchDisabled: false,
        multipleLoginAllowed: false
    });
    const [currentConfig, setCurrentConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchConfiguration();
    }, []);

    const fetchConfiguration = async () => {
        setIsLoadingConfig(true);
        try {
            const response = await apiClient.get('/configuration/getConfiguration');
            if (response.data && response.data.success && response.data.data) {
                const config = response.data.data;
                setCurrentConfig(config);
                if (!isEditing) {
                    const configData = {
                        activationMode: config.activationMode || 'NOT_REQUIRED',
                        isInternetDisabled: config.isInternetDisabled || false,
                        isTabSwitchDisabled: config.isTabSwitchDisabled || false,
                        multipleLoginAllowed: config.multipleLoginAllowed || false
                    };
                    setFormData(configData);
                }
            }
        } catch (error) {
            console.error('Error fetching configuration:', error);
            toast.error('Failed to load configuration');
        } finally {
            setIsLoadingConfig(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = () => {
        if (currentConfig) {
            setIsEditing(true);
            setEditingId(currentConfig.id);
            setFormData({
                activationMode: currentConfig.activationMode || 'NOT_REQUIRED',
                isInternetDisabled: currentConfig.isInternetDisabled || false,
                isTabSwitchDisabled: currentConfig.isTabSwitchDisabled || false,
                multipleLoginAllowed: currentConfig.multipleLoginAllowed || false
            });
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!currentConfig || !currentConfig.id) {
            toast.error('No configuration to delete');
            return;
        }

        setIsDeleting(true);
        try {
            const requestBody = {
                id: currentConfig.id,
                activationMode: currentConfig.activationMode,
                isInternetDisabled: currentConfig.isInternetDisabled,
                isTabSwitchDisabled: currentConfig.isTabSwitchDisabled,
                multipleLoginAllowed: currentConfig.multipleLoginAllowed,
                isActive: false
            };

            const response = await apiClient.post('/configuration/saveConfiguration', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success('Configuration deleted successfully!');
                setCurrentConfig(null);
                setFormData({
                    activationMode: 'NOT_REQUIRED',
                    isInternetDisabled: false,
                    isTabSwitchDisabled: false,
                    multipleLoginAllowed: false
                });
                setIsEditing(false);
                setEditingId(null);
                setShowDeleteDialog(false);
                await fetchConfiguration();
            }
        } catch (error) {
            console.error('Error deleting configuration:', error);
            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'An error occurred while deleting configuration';
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
        setShowDeleteDialog(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requestBody = {
                activationMode: formData.activationMode,
                isInternetDisabled: formData.isInternetDisabled,
                isTabSwitchDisabled: formData.isTabSwitchDisabled,
                multipleLoginAllowed: formData.multipleLoginAllowed
            };

            if (isEditing && editingId) {
                requestBody.id = editingId;
            }

            const response = await apiClient.post('/configuration/saveConfiguration', requestBody);

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditing ? 'Configuration updated successfully!' : 'Configuration saved successfully!');
                setIsEditing(false);
                setEditingId(null);
                await fetchConfiguration();
            }
        } catch (error) {
            console.error('Error saving configuration:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'An error occurred while saving configuration';
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

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        if (currentConfig) {
            setFormData({
                activationMode: currentConfig.activationMode || 'NOT_REQUIRED',
                isInternetDisabled: currentConfig.isInternetDisabled || false,
                isTabSwitchDisabled: currentConfig.isTabSwitchDisabled || false,
                multipleLoginAllowed: currentConfig.multipleLoginAllowed || false
            });
        }
    };

    if (isLoadingConfig) {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 bg-gray-50 overflow-y-auto">
                        <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                            <h2 className="text-lg font-semibold">System Configuration</h2>
                        </div>
                        <div className="flex justify-center items-center h-64">
                            <div className="text-gray-500">Loading configuration...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
                        <Settings className="w-6 h-6" />
                        <h2 className="text-lg font-semibold">System Configuration</h2>
                    </div>

                    <div className="flex justify-center items-center w-full !px-4 !py-6">
                        <div className="w-full max-w-4xl">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 !mb-6">
                                    {isEditing ? 'Edit Configuration Settings' : 'Configuration Settings'}
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg !p-6">
                                        <div className="flex items-center gap-3 !mb-4">
                                            <Shield className="w-5 h-5 text-[#7966F1]" />
                                            <label className="block text-sm text-gray-700 font-medium">
                                                Activation Mode
                                            </label>
                                        </div>
                                        <select
                                            name="activationMode"
                                            value={formData.activationMode}
                                            onChange={handleInputChange}
                                            className="w-full border border-[#7966F1] rounded-md !px-4 !py-2 !h-[42px] outline-none focus:ring-2 focus:ring-[#7966F1] focus:ring-opacity-50"
                                            disabled={loading || (currentConfig && !isEditing)}
                                        >
                                            <option value="NOT_REQUIRED">Not Required</option>
                                            <option value="EMAIL_OTP">Email OTP</option>
                                            <option value="SMS_OTP">SMS OTP</option>
                                            <option value="BOTH">Both (Email & SMS)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 !mt-2">
                                            Select how users should activate their accounts
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg !p-6">
                                        <div className="flex items-start gap-4">
                                            <Wifi className="w-5 h-5 text-[#7966F1] !mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="block text-sm text-gray-700 font-medium">
                                                            Disable Internet During Exam
                                                        </label>
                                                        <p className="text-xs text-gray-500 !mt-1">
                                                            Prevent users from accessing internet during exam sessions
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="isInternetDisabled"
                                                            checked={formData.isInternetDisabled}
                                                            onChange={handleInputChange}
                                                            disabled={loading || (currentConfig && !isEditing)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7966F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7966F1]"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg !p-6">
                                        <div className="flex items-start gap-4">
                                            <Monitor className="w-5 h-5 text-[#7966F1] !mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="block text-sm text-gray-700 font-medium">
                                                            Disable Tab Switching
                                                        </label>
                                                        <p className="text-xs text-gray-500 !mt-1">
                                                            Restrict users from switching tabs during exam
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="isTabSwitchDisabled"
                                                            checked={formData.isTabSwitchDisabled}
                                                            onChange={handleInputChange}
                                                            disabled={loading || (currentConfig && !isEditing)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7966F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7966F1]"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg !p-6">
                                        <div className="flex items-start gap-4">
                                            <Users className="w-5 h-5 text-[#7966F1] !mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="block text-sm text-gray-700 font-medium">
                                                            Allow Multiple Logins
                                                        </label>
                                                        <p className="text-xs text-gray-500 !mt-1">
                                                            Allow users to login from multiple devices simultaneously
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="multipleLoginAllowed"
                                                            checked={formData.multipleLoginAllowed}
                                                            onChange={handleInputChange}
                                                            disabled={loading || (currentConfig && !isEditing)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7966F1]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7966F1]"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 !mt-8">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer hover:bg-[#f5f3ff] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {(!currentConfig || isEditing) && (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                        >
                                            {loading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Configuration' : 'Save Configuration')}
                                        </button>
                                    )}
                                </div>
                            </form>

                            {currentConfig && !isEditing && (
                                <div className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-6 !mt-6">
                                    <div className="flex items-center justify-between !mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Current Configuration Status</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleEdit}
                                                className="flex items-center gap-2 bg-blue-500 text-white font-semibold !px-4 !py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteClick}
                                                className="flex items-center gap-2 bg-red-500 text-white font-semibold !px-4 !py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Activation Mode:</span>
                                            <span className="text-sm font-semibold text-[#7966F1]">{currentConfig.activationMode.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Internet Disabled:</span>
                                            <span className={`text-sm font-semibold ${currentConfig.isInternetDisabled ? 'text-green-600' : 'text-red-600'}`}>
                                                {currentConfig.isInternetDisabled ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Tab Switch Disabled:</span>
                                            <span className={`text-sm font-semibold ${currentConfig.isTabSwitchDisabled ? 'text-green-600' : 'text-red-600'}`}>
                                                {currentConfig.isTabSwitchDisabled ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Multiple Login:</span>
                                            <span className={`text-sm font-semibold ${currentConfig.multipleLoginAllowed ? 'text-green-600' : 'text-red-600'}`}>
                                                {currentConfig.multipleLoginAllowed ? 'Allowed' : 'Not Allowed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Configuration;