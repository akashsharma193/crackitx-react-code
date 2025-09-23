import React, { useState, useEffect } from 'react';
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import createExamIcon from '/src/assets/icons/create-exam-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';
import apiClient from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ setActiveTab }) => {
    const [userDashboardData, setUserDashboardData] = useState({
        totalExamCount: 0,
        activeExamCount: 0,
        pastExamCount: 0,
        passedExam: 0,
        failedExam: 0,
        unAttemptedExam: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userDashboardCards = [
        { title: 'All Tests', icon: studentsIcon, count: userDashboardData.totalExamCount, tab: 'All Test' },
        { title: 'Active Exam', icon: activeExamIcon, count: userDashboardData.activeExamCount, tab: 'Active Exam' },
        { title: 'Exam History', icon: examhistoryIcon, count: userDashboardData.pastExamCount, tab: 'Exam History' },
        { title: 'Missed Exam', icon: activeExamIcon, count: userDashboardData.unAttemptedExam, tab: 'Missed Exam' },
        { title: 'Passed Exams', icon: resourcesIcon, count: userDashboardData.passedExam, tab: 'Passed Exam' },
        { title: 'Failed Exams', icon: resourcesIcon, count: userDashboardData.failedExam, tab: 'Failed Exam' },
    ];

    const fetchDashboardData = async () => {
        console.log('Dashboard - userId:', localStorage.getItem('userId'));
        console.log('Dashboard - refreshToken:', localStorage.getItem('refreshToken'));


        try {
            setLoading(true);
            setError(null);

            // Check if we have the required authentication data
            const authToken = localStorage.getItem('authToken');
            const deviceId = localStorage.getItem('deviceId');

            console.log('Dashboard API Call - Auth Token:', authToken ? 'Present' : 'Missing');
            console.log('Dashboard API Call - Device ID:', deviceId ? deviceId : 'Missing');

            if (!authToken) {
                console.error('No auth token found');
                setError('Authentication token not found. Please login again.');
                // Don't navigate here, let the API client handle it
                return;
            }

            // Make API call - headers will be set by interceptor
            const response = await apiClient.post('/studentReport/student/getCount', {});

            console.log('Dashboard API Response:', response.data);

            if (response.data && response.data.success) {
                setUserDashboardData(response.data.data);
            } else {
                console.error('API returned success: false', response.data);
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error fetching UserDashboard data:', err);

            // Handle specific error cases
            if (err.response?.status === 401) {
                // Token refresh will be handled by interceptor
                setError('Authentication failed. Please wait while we refresh your session...');

                // Retry after a short delay to allow token refresh
                setTimeout(() => {
                    fetchDashboardData();
                }, 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view this data.');
            } else if (err.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else if (err.code === 'ECONNABORTED') {
                setError('Request timeout. Please check your internet connection.');
            } else {
                setError('Failed to load dashboard data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is authenticated before making API call
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setError('Please login to view dashboard');
            setLoading(false);
            return;
        }

        // Add a small delay to ensure the component is mounted properly
        const timer = setTimeout(() => {
            fetchDashboardData();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Add a visibility change listener to refetch data when user comes back to the tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !loading) {
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    console.log('Page became visible, refetching dashboard data');
                    fetchDashboardData();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [loading]);

    const handleCardClick = (tab) => {
        if (tab) {
            setActiveTab(tab);
        }
    };

    if (loading) {
        return (
            <>
                <h2 className='text-xl text-[#7966F1] font-bold !mb-6'>Dashboard</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full'>
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className='cursor-pointer max-w-sm rounded-lg flex bg-gray-200 animate-pulse !p-4 justify-between items-center text-white text-lg font-medium border-white border-2'
                            style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
                        >
                            <div>
                                <div className='h-[40px] w-[40px] bg-gray-300 !mb-4 rounded'></div>
                                <div className='h-4 w-20 bg-gray-300 rounded'></div>
                            </div>
                            <div className="h-6 w-8 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h2 className='text-xl text-[#7966F1] font-bold !mb-6'>Dashboard</h2>
                <div className='text-red-500 text-center p-4'>
                    <p>{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className='!mt-2 !px-4 !py-2 bg-[#7966F1] text-white rounded hover:bg-[#6855E0]'
                    >
                        Retry
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <h2 className='text-xl text-[#7966F1] font-bold !mb-6'>Dashboard</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full'>
                {userDashboardCards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(card.tab)}
                        className='cursor-pointer max-w-sm rounded-lg flex bg-[#7966F1] !p-4 justify-between items-center text-white text-lg font-medium border-white border-2 hover:bg-[#6855E0] transition-colors'
                        style={{ boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
                    >
                        <div>
                            <img className='h-[40px] !mb-4' src={card.icon} alt={card.title} />
                            <p>{card.title}</p>
                        </div>
                        <span className="text-2xl font-bold">{card.count}</span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default UserDashboard;