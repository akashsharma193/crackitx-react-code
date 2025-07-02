import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

import Students from '../Students/Student';
import PastExams from '../past-exams/PastExams';
import Dashboard from '../dashboard/Dashboard';
import ActiveExams from '../active-exams/ActiveExams';
import LogoutDialog from '../../components/LogOutComponent';
import CreateExam from '../create-exam/CreateExam';
import UpcomingExam from '../upcoming-exam/UpcomingExam';

// Dummy Components
const EResources = () => (
    <div className="flex justify-center items-center h-full text-3xl font-semibold text-[#7966F1]">
        Coming Soon
    </div>
);

const Home = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
            window.history.replaceState({}, document.title);
        } else {
            setActiveTab('Dashboard');
        }
    }, [location.state]);

    const handleTabChange = (tab) => {
        if (tab === 'Log Out') {
            setShowLogoutDialog(true);
        } else {
            setActiveTab(tab);
        }
    };

    const handleLogoutConfirm = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        sessionStorage.clear();
        navigate('/', { replace: true });
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard setActiveTab={setActiveTab} />;
            case 'Students':
                return <Students />;
            case 'Past Exams':
                return <PastExams />;
            case 'Create Exam':
                return <CreateExam />;
            case 'Active Exam':
                return <ActiveExams />;
            case 'Upcoming Exam':
                return <UpcomingExam />;
            case 'E-Resources':
                return <EResources />;
            default:
                return <div className='p-6'>No Content</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className='flex flex-1 overflow-hidden'>
                <SidebarComponent
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                />
                <div className={`flex-1 overflow-y-auto ${activeTab === 'Dashboard' ? '!px-6 !py-8' : ''}`}>
                    {renderContent()}
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <LogoutDialog
                isOpen={showLogoutDialog}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Home;
