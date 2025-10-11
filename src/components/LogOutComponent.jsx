import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const LogoutDialog = ({ isOpen, onClose, onConfirm }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const clearLocalStorage = () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            const userRole = localStorage.getItem('userRole');
            const isSuperAdmin = userRole === 'SuperAdmin' || userRole === 'Super Admin';

            const logoutEndpoint = isSuperAdmin ? '/superAdmin/logOut' : '/user-secured/logOut';

            const response = await apiClient.post(logoutEndpoint);

            if (response.data.success || response.status === 200) {
                clearLocalStorage();

                toast.success('Logout successful');

                onClose();

                if (onConfirm) {
                    onConfirm();
                }

                setTimeout(() => {
                    if (isSuperAdmin) {
                        window.location.href = '/super-admin';
                    } else {
                        window.location.href = '/';
                    }
                }, 1000);

            } else {
                const errorMessage = response.data.message || 'Logout failed. Please try again.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Logout error:', error);
            let errorMessage = 'An unexpected error occurred during logout.';

            const userRole = localStorage.getItem('userRole');
            const isSuperAdmin = userRole === 'SuperAdmin' || userRole === 'Super Admin';

            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 401) {
                    errorMessage = 'Session expired. You will be logged out.';
                    clearLocalStorage();
                    toast.success('Logout successful');
                    onClose();
                    if (onConfirm) {
                        onConfirm();
                    }
                    setTimeout(() => {
                        if (isSuperAdmin) {
                            window.location.href = '/super-admin';
                        } else {
                            window.location.href = '/';
                        }
                    }, 1000);
                    return;
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (error.response.status === 404) {
                    errorMessage = 'Logout service not found.';
                } else {
                    errorMessage = `Request failed with status ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. Please try again.';
            }

            toast.error(errorMessage);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert !</h2>
                    <p className="text-gray-800 !mb-2">Are you sure you want to Logout?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> Once logged out, you will need to login again.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoggingOut}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                            {isLoggingOut ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Logout'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutDialog;