import React, { useState, useEffect, useRef } from 'react'
import logo from '/src/assets/logo.png';
import welcomeImage from '/src/assets/images/welcome-image.png'
import adminImage from '/src/assets/images/profile-image.png'
import { User, Mail, Phone, LogOut, Building, Hash } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import LogoutDialog from './LogOutComponent';
import apiClient from '../api/axiosConfig';

const HeaderComponent = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);

                const isAdmin = localStorage.getItem('userRole') === 'Admin';

                const endpoint = isAdmin
                    ? '/user-secured/getUserProfile'
                    : '/user-activity/getUserProfile';

                const response = await apiClient.get(endpoint);

                if (response.data.success && response.data.data) {
                    const userData = response.data.data;
                    setUserProfile(userData);

                    if (userData.orgCode) {
                        localStorage.setItem('orgCode', userData.orgCode);
                    }
                    if (userData.userId) {
                        localStorage.setItem('userId', userData.userId);
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

    const handleLogoClick = () => {
        navigate('/home', { state: { activeTab: 'Dashboard' } });
    };

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        localStorage.removeItem('orgCode');
        localStorage.removeItem('userRole');
        sessionStorage.clear();

        navigate('/', { replace: true });

        window.history.pushState(null, null, '/');
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, '/');
        });
    };

    const profileOptions = [
        {
            icon: <Phone size={18} className="text-gray-600" />,
            label: userProfile?.mobile || 'No phone number'
        },
        {
            icon: <Building size={18} className="text-gray-600" />,
            label: userProfile?.orgCode || 'No org code'
        },
        {
            icon: <Hash size={18} className="text-gray-600" />,
            label: userProfile?.batch || 'No batch code'
        },
        {
            icon: <LogOut size={18} className="text-gray-600" />,
            label: 'Log Out',
            action: handleLogout
        },
    ];

    if (isLoading) {
        return (
            <div className='flex justify-between items-center !px-8 !py-3 border-b-2 border-b-gray-200'>
                <img className='w-[50px] cursor-pointer' src={logo} alt="Logo" onClick={handleLogoClick} />
                <div className='flex gap-20'>
                    <div className='flex items-center gap-4'>
                        <h2 className='font-bold text-lg text-[#7966F1]'>Loading...</h2>
                        <img className='h-[50px]' src={welcomeImage} alt="Welcome" />
                    </div>
                    <img
                        className='h-[50px] cursor-pointer'
                        src={adminImage}
                        alt="Profile"
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='flex justify-between items-center !px-8 border-b-2 border-b-gray-200'>
                <img className='w-[100px] cursor-pointer' src={logo} alt="Logo" onClick={handleLogoClick} />

                <div className='flex gap-20'>
                    <div className='flex items-center gap-4'>
                        <h2 className='font-bold text-lg text-[#7966F1]'>
                            Hey, {userProfile?.name || 'User'}
                        </h2>
                        <img className='h-[50px]' src={welcomeImage} alt="Welcome" />
                    </div>
                    <div ref={profileRef} className="relative">
                        <img
                            className='h-[50px] cursor-pointer'
                            src={adminImage}
                            alt="Profile"
                            onClick={() => setShowProfile(prev => !prev)}
                        />
                        {showProfile && (
                            <div className='z-10 bg-white absolute top-16 right-0 w-[320px] !p-8 rounded-3xl shadow-2xl shadow-gray-300'>
                                <div className='flex justify-center items-center gap-4 !mb-4'>
                                    <img className='h-[60px]' src={adminImage} alt="Profile" />
                                    <div>
                                        <p>{userProfile?.name || 'User'}</p>
                                        <p>{userProfile?.email || 'user@gmail.com'}</p>
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
                    </div>
                </div>
            </div>

            <LogoutDialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default HeaderComponent;