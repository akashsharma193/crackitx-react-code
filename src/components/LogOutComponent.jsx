import React from 'react';

const LogoutDialog = ({ isOpen, onClose, onConfirm }) => {
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
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutDialog;