import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

import PastExams from '../past-exams/PastExams';
import Dashboard from '../dashboard/Dashboard';
import ActiveExams from '../active-exams/ActiveExams';
import LogoutDialog from '../../components/LogOutComponent';
import CreateExam from '../create-exam/CreateExam';
import UpcomingExam from '../upcoming-exam/UpcomingExam';
import UserDashboard from '../dashboard/UserDashboard';
import UserSidebarComponent from '../../components/UserSidebarComponent';
import UserActiveExams from '../active-exams/UserActiveExams';
import Students from '../students/Student';
import UserExamHistory from '../past-exams/UserExamHistory';

// Dummy Components
const EResources = () => (
    <div className="flex justify-center items-center h-full text-3xl font-semibold text-[#7966F1]">
        Coming Soon
    </div>
);

const isAdmin = localStorage.getItem('userRole') === 'Admin';

const Home = () => {
    console.log(localStorage.getItem('authToken'));
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
        localStorage.removeItem('userRole');

        sessionStorage.clear();
        navigate('/', { replace: true });
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    // Admin render content function
    const renderAdminContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard setActiveTab={setActiveTab} />;
            case 'Students':
                return <Students />;
            case 'Exam History':
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

    // User render content function
    const renderUserContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <UserDashboard setActiveTab={setActiveTab} />;
            case 'All Tests':
                return <PastExams />;
            case 'Active Exam':
                return <UserActiveExams />;
            case 'Exam History':
                return <UserExamHistory />;
            case 'Unattempted Exam':
                return <UpcomingExam />;
            case 'Passed Exam':
                return <EResources />;
            case 'Failed Exam':
                return <EResources />;
            default:
                return <div className='p-6'>No Content</div>;
        }
    };

    // Main render content function that delegates to admin or user
    const renderContent = () => {
        return isAdmin ? renderAdminContent() : renderUserContent();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className='flex flex-1 overflow-hidden'>
                {isAdmin ? (
                    <SidebarComponent
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                    />
                ) : (
                    <UserSidebarComponent
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                    />
                )}
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