import React, { useState } from 'react'
import logo from '/src/assets/logo.png';
import welcomeImage from '/src/assets/images/welcome-image.png'
import adminImage from '/src/assets/images/profile-image.png'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import LogoutDialog from './LogOutComponent';

const HeaderComponent = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        sessionStorage.clear();

        navigate('/', { replace: true });

        window.history.pushState(null, null, '/');
        window.addEventListener('popstate', function () {
            window.history.pushState(null, null, '/');
        });
    };

    const profileOptions = [
        { icon: <User />, label: 'Admin' },
        { icon: <Mail />, label: 'admin@gmail.com' },
        { icon: <Phone />, label: '9967422806' },
        { icon: <LogOut />, label: 'Log Out', action: handleLogout },
    ];

    return (
        <>
            <div className='flex justify-between items-center !px-8 !py-3 border-b-2 border-b-gray-200'>
                <img className='w-[50px]' src={logo} alt="Logo" />

                <div className='flex gap-20'>
                    <div className='flex items-center gap-4'>
                        <h2 className='font-bold text-lg text-[#7966F1]'>Hey, Admin</h2>
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
                            <p>Admin</p>
                            <p>admin@gmail.com</p>
                        </div>
                    </div>
                    <hr />
                    {profileOptions.map((item, index) => (
                        <div
                            key={index}
                            className='flex gap-4 !p-2 items-center hover:cursor-pointer hover:bg-gray-100 rounded-lg !mt-2'
                            onClick={item.action}
                        >
                            {item.icon}
                            <p>{item.label}</p>
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
