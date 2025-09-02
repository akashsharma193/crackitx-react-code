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
import { toast } from 'react-toastify';
import QuizPage from '../quiz-page/Quiz_Page';
import UserUnattemptedExams from '../unattempted-exams/UserUnattemptedExam';
import UserPassedExams from '../passed-exams/UserPassedExams';
import UserFailedExams from '../failed-exams/UserFailedExams';

// Dummy Components
const EResources = () => (
    <div className="flex justify-center items-center h-full text-3xl font-semibold text-[#7966F1]">
        Coming Soon
    </div>
);

const Home = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Quiz navigation state
    const [currentView, setCurrentView] = useState('normal'); // 'normal' or 'quiz'
    const [selectedExam, setSelectedExam] = useState(null);

    // Check user role on component mount and when localStorage changes
    useEffect(() => {
        const checkUserRole = () => {
            const role = localStorage.getItem('userRole');
            console.log('Current user role:', role);
            setUserRole(role);
        };

        // Check role immediately
        checkUserRole();

        // Optional: Listen for storage changes (useful if role changes in another tab)
        window.addEventListener('storage', checkUserRole);

        return () => {
            window.removeEventListener('storage', checkUserRole);
        };
    }, []);

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
            // Reset quiz view when changing tabs
            setCurrentView('normal');
            setSelectedExam(null);
        }
    };

    // Quiz navigation handlers
    const handleNavigateToQuiz = (examData) => {
        console.log('Navigating to quiz with data:', examData);
        setSelectedExam(examData);
        setCurrentView('quiz');
    };

    const handleBackToExams = () => {
        setCurrentView('normal');
        setSelectedExam(null);
    };

    const handleQuizSubmit = (results) => {
        console.log('Quiz results:', results);
        toast.success(`Quiz completed! Score: ${results.score}%`);

        // Optional: Auto navigate back after a delay
        setTimeout(() => {
            handleBackToExams();
        }, 3000);
    };

    const handleLogoutConfirm = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('deviceId');

        sessionStorage.clear();
        navigate('/', { replace: true });
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    // Check if user is admin
    const isAdmin = userRole === 'Admin';

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

    // User render content function with quiz navigation
    const renderUserContent = () => {
        // If we're in quiz mode, show the quiz page
        if (currentView === 'quiz') {
            return (
                <QuizPage
                    examData={selectedExam}
                    onSubmitQuiz={handleQuizSubmit}
                    onBackToExams={handleBackToExams}
                />
            );
        }

        // Otherwise, render normal content based on active tab
        switch (activeTab) {
            case 'Dashboard':
                return <UserDashboard setActiveTab={setActiveTab} />;
            case 'All Test':
                return <PastExams />;
            case 'Active Exam':
                return <UserActiveExams onNavigateToQuiz={handleNavigateToQuiz} />;
            case 'Exam History':
                return <UserExamHistory />;
            case 'Unattempted Exam':
                return <UserUnattemptedExams onNavigateToQuiz={handleNavigateToQuiz} />;ome
            case 'Passed Exam':
                return <UserPassedExams />;
            case 'Failed Exam':
                return <UserFailedExams />;
            default:
                return <div className='p-6'>No Content</div>;
        }
    };

    // Main render content function that delegates to admin or user
    const renderContent = () => {
        return isAdmin ? renderAdminContent() : renderUserContent();
    };

    // Show loading if userRole is not yet determined
    if (userRole === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

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
                <div className={`flex-1 overflow-y-auto ${activeTab === 'Dashboard' && currentView === 'normal' ? '!px-6 !py-8' : ''}`}>
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