import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';
import PastExams from '../past-exams/PastExams';
import Dashboard from '../dashboard/Dashboard';
import SuperAdminDashboard from '../dashboard/SuperAdminDashboard';
import ActiveExams from '../active-exams/ActiveExams';
import LogoutDialog from '../../components/LogOutComponent';
import CreateExam from '../create-exam/CreateExam';
import CreateBatch from '../create-batch/CreateBatch';
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
import AllTests from '../all-test/AllTest';
import UserUpcomingExam from '../upcoming-exam/UserUpcomingExam';
import Ranking from '../ranking/Ranking';
import UserRanking from '../ranking/UserRanking';
import SuperAdminSidebarComponent from '../../components/AdminSidebarComponent';
import CreateOrganization from '../super-admin/CreateOrganisation';
import Configuration from '../super-admin/Configuration';
import Compliance from '../super-admin/Compliance';
import CreateAdmin from '../super-admin/CreateAdmin';
import Feedback from '../feedback/Feedback';
import SendNotification from '../super-admin/SendNotification';

const EResources = () => (
    <div className="flex justify-center items-center h-full text-3xl font-semibold text-[#7966F1]">
        Coming Soon
    </div>
);

const ComponentWrapper = ({ children, isActive }) => (
    <div
        className={`w-full h-full ${isActive ? 'block' : 'hidden'}`}
        style={{
            position: isActive ? 'relative' : 'absolute',
            visibility: isActive ? 'visible' : 'hidden'
        }}
    >
        {children}
    </div>
);

const Home = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [initializedTabs, setInitializedTabs] = useState(new Set(['Dashboard']));
    const componentCache = useRef({});
    const location = useLocation();
    const navigate = useNavigate();

    const [currentView, setCurrentView] = useState('normal');
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        const checkUserRole = () => {
            const role = localStorage.getItem('userRole');
            console.log('Current user role:', role);
            setUserRole(role);
        };

        checkUserRole();
        window.addEventListener('storage', checkUserRole);
        return () => window.removeEventListener('storage', checkUserRole);
    }, []);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            window.history.replaceState({}, document.title);
        } else {
            setActiveTab('Dashboard');
        }
    }, [location.state]);

    const handleTabChange = useCallback((tab) => {
        if (tab === 'Log Out') {
            setShowLogoutDialog(true);
        } else {
            setActiveTab(tab);
            setCurrentView('normal');
            setSelectedExam(null);
            setInitializedTabs(prev => new Set([...prev, tab]));
        }
    }, []);

    const handleNavigateToQuiz = useCallback((examData) => {
        console.log('Navigating to quiz with data:', examData);
        setSelectedExam(examData);
        setCurrentView('quiz');
    }, []);

    const handleBackToExams = useCallback(() => {
        setCurrentView('normal');
        setSelectedExam(null);
    }, []);

    const handleQuizSubmit = useCallback((results) => {
        console.log('Quiz results:', results);
        toast.success(`Quiz completed! Score: ${results.score}%`);
        setTimeout(() => {
            handleBackToExams();
        }, 3000);
    }, [handleBackToExams]);

    const handleLogoutConfirm = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('deviceId');
        sessionStorage.clear();

        const role = userRole;
        if (role === 'SuperAdmin') {
            navigate('/super-admin', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [navigate, userRole]);

    const handleLogoutCancel = useCallback(() => {
        setShowLogoutDialog(false);
    }, []);

    const isAdmin = userRole === 'Admin';
    const isSuperAdmin = userRole === 'Super Admin';

    const createComponent = useCallback((tabName) => {
        if (componentCache.current[tabName]) {
            return componentCache.current[tabName];
        }

        let component;
        if (isSuperAdmin) {
            switch (tabName) {
                case 'Dashboard':
                    component = <SuperAdminDashboard setActiveTab={setActiveTab} />;
                    break;
                case 'Configuration':
                    component = <Configuration />;
                    break;
                case 'Create Admin':
                    component = <CreateAdmin />;
                    break;
                case 'Create Organization':
                    component = <CreateOrganization />;
                    break;
                case 'Compliance':
                    component = <Compliance />;
                    break;
                case 'Notification':
                    component = <SendNotification />;
                    break;
                default:
                    component = <div className='p-6'>No Content</div>;
            }
        } else if (isAdmin) {
            switch (tabName) {
                case 'Dashboard':
                    component = <Dashboard setActiveTab={setActiveTab} />;
                    break;
                case 'Students':
                    component = <Students />;
                    break;
                case 'Create Batch':
                    component = <CreateBatch />;
                    break;
                case 'Exam History':
                    component = <PastExams />;
                    break;
                case 'Ranking':
                    component = <Ranking />;
                    break;
                case 'Feedback':
                    component = <Feedback />;
                    break;
                case 'Create Exam':
                    component = <CreateExam />;
                    break;
                case 'Active Exam':
                    component = <ActiveExams />;
                    break;
                case 'Upcoming Exam':
                    component = <UpcomingExam />;
                    break;
                case 'E-Resources':
                    component = <EResources />;
                    break;
                default:
                    component = <div className='p-6'>No Content</div>;
            }
        } else {
            switch (tabName) {
                case 'Dashboard':
                    component = <UserDashboard setActiveTab={setActiveTab} />;
                    break;
                case 'All Test':
                    component = <AllTests />;
                    break;
                case 'Active Exam':
                    component = <UserActiveExams onNavigateToQuiz={handleNavigateToQuiz} />;
                    break;
                case 'Exam History':
                    component = <UserExamHistory />;
                    break;
                case 'Ranking':
                    component = <UserRanking />;
                    break;
                case 'Upcoming Exam':
                    component = <UserUpcomingExam />;
                    break;
                case 'Missed Exam':
                    component = <UserUnattemptedExams onNavigateToQuiz={handleNavigateToQuiz} />;
                    break;
                case 'Passed Exam':
                    component = <UserPassedExams />;
                    break;
                case 'Failed Exam':
                    component = <UserFailedExams />;
                    break;
                default:
                    component = <div className='p-6'>No Content</div>;
            }
        }

        componentCache.current[tabName] = component;
        return component;
    }, [isAdmin, isSuperAdmin, handleNavigateToQuiz]);

    const clearCache = useCallback(() => {
        componentCache.current = {};
        setInitializedTabs(new Set([activeTab]));
    }, [activeTab]);

    useEffect(() => {
        clearCache();
    }, [userRole, clearCache]);

    const renderContent = () => {
        if (currentView === 'quiz') {
            return (
                <QuizPage
                    examData={selectedExam}
                    onSubmitQuiz={handleQuizSubmit}
                    onBackToExams={handleBackToExams}
                    hideSubmitButton={selectedExam?.hideSubmitButton}
                />
            );
        }

        let tabs;
        if (isSuperAdmin) {
            tabs = ['Dashboard', 'Configuration', 'Create Admin', 'Create Organization', 'Compliance', 'Notification'];
        } else if (isAdmin) {
            tabs = ['Dashboard', 'Students', 'Create Batch', 'Create Exam', 'Active Exam', 'Exam History', 'Ranking', 'Feedback', 'Upcoming Exam', 'E-Resources'];
        } else {
            tabs = ['Dashboard', 'All Test', 'Active Exam', 'Exam History', 'Ranking', 'Upcoming Exam', 'Missed Exam', 'Passed Exam', 'Failed Exam'];
        }

        return (
            <div className="relative w-full h-full">
                {tabs.map(tab => (
                    <ComponentWrapper key={tab} isActive={activeTab === tab}>
                        {initializedTabs.has(tab) ? createComponent(tab) : null}
                    </ComponentWrapper>
                ))}
            </div>
        );
    };

    if (userRole === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <HeaderComponent />
            <div className='flex flex-1 overflow-hidden'>
                {isSuperAdmin ? (
                    <SuperAdminSidebarComponent
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                    />
                ) : isAdmin ? (
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
                <div className="flex-1 overflow-y-auto relative">
                    {renderContent()}
                </div>
            </div>

            <LogoutDialog
                isOpen={showLogoutDialog}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
};

export default Home;