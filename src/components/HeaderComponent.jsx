import React, { useState, useEffect } from 'react'
import logo from '/src/assets/logo.png';
import welcomeImage from '/src/assets/images/welcome-image.png'
import adminImage from '/src/assets/images/profile-image.png'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import LogoutDialog from './LogOutComponent';
import apiClient from '../api/axiosConfig';

const HeaderComponent = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/user-secured/getUserProfile');

                if (response.data.success && response.data.data) {
                    const userData = response.data.data;
                    setUserProfile(userData);

                    // Store orgCode in localStorage
                    if (userData.orgCode) {
                        localStorage.setItem('orgCode', userData.orgCode);
                    }
                } else {
                    console.error('Failed to fetch user profile:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        localStorage.removeItem('orgCode'); // Remove orgCode on logout
        sessionStorage.clear();

        navigate('/', { replace: true });

        window.history.pushState(null, null, '/');
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, '/');
        });
    };

    // Dynamic profile options based on API data
    const profileOptions = [
        {
            icon: <User size={18} className="text-gray-600" />,
            label: userProfile?.name || 'Admin'
        },
        {
            icon: <Mail size={18} className="text-gray-600" />,
            label: userProfile?.email || 'admin@gmail.com'
        },
        {
            icon: <Phone size={18} className="text-gray-600" />,
            label: userProfile?.mobile || '9967422806'
        },
        {
            icon: <LogOut size={18} className="text-gray-600" />,
            label: 'Log Out',
            action: handleLogout
        },
    ];

    // Show loading state if data is still being fetched
    if (isLoading) {
        return (
            <div className='flex justify-between items-center !px-8 !py-3 border-b-2 border-b-gray-200'>
                <img className='w-[50px]' src={logo} alt="Logo" />
                <div className='flex gap-20'>
                    <div className='flex items-center gap-4'>
                        <h2 className='font-bold text-lg text-[#7966F1]'>Loading...</h2>
                        <img className='h-[50px]' src={welcomeImage} alt="Welcome" />
                    </div>
                    <img
                        className='h-[50px] cursor-pointer'
                        src={adminImage}
                        alt="Admin"
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='flex justify-between items-center !px-8 !py-3 border-b-2 border-b-gray-200'>
                <img className='w-[50px]' src={logo} alt="Logo" />

                <div className='flex gap-20'>
                    <div className='flex items-center gap-4'>
                        <h2 className='font-bold text-lg text-[#7966F1]'>
                            Hey, {userProfile?.name || 'Admin'}
                        </h2>
                        <img className='h-[50px]' src={welcomeImage} alt="Welcome" />
                    </div>
                    <img
                        className='h-[50px] cursor-pointer'
                        src={adminImage}
                        alt="Admin"
                        onClick={() => setShowProfile(prev => !prev)}
                    />
                </div>
            </div>

            {showProfile && (
                <div className='z-10 bg-white absolute top-20 right-0 w-[320px] !p-8 rounded-3xl shadow-2xl shadow-gray-300 !mr-3'>
                    <div className='flex justify-center items-center gap-4 !mb-4'>
                        <img className='h-[60px]' src={adminImage} alt="Profile" />
                        <div>
                            <p>{userProfile?.name || 'Admin'}</p>
                            <p>{userProfile?.email || 'admin@gmail.com'}</p>
                        </div>
                    </div>
                    <hr />
                    {profileOptions.map((item, index) => (
                        <div
                            key={index}
                            className='flex gap-4 !p-2 items-center hover:cursor-pointer hover:bg-gray-100 rounded-lg !mt-2'
                            onClick={item.action}
                        >
                            <div className="flex-shrink-0">
                                {item.icon}
                            </div>
                            <p className="flex-1">{item.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <LogoutDialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default HeaderComponent;