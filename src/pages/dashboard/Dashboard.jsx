import React, { useState, useEffect } from 'react'
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import createExamIcon from '/src/assets/icons/create-exam-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';
import apiClient from '../../api/axiosConfig';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        userCount: 0,
        totalExamCount: 0,
        activeExamCount: 0,
        pastExamCount: 0,
        upComingExamCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dashboard Cards with dynamic counts
    const dashboardCards = [
        { title: 'All Students', icon: studentsIcon, count: dashboardData.userCount },
        { title: 'Exam History', icon: examhistoryIcon, count: dashboardData.pastExamCount },
        { title: 'Create Exam', icon: createExamIcon, count: dashboardData.totalExamCount },
        { title: 'Active Exam', icon: activeExamIcon, count: dashboardData.activeExamCount },
        { title: 'E-Resources', icon: resourcesIcon, count: dashboardData.upComingExamCount },
    ];

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.post('/report/getCount');

            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <>
                <h2 className='text-xl text-[#7966F1] font-bold !mb-6'>Dashboard</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full'>
                    {[...Array(5)].map((_, index) => (
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
                        className='mt-2 px-4 py-2 bg-[#7966F1] text-white rounded hover:bg-[#6855E0]'
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
                {dashboardCards.map((card, index) => (
                    <div
                        key={index}
                        className='cursor-pointer max-w-sm rounded-lg flex bg-[#7966F1] !p-4 justify-between items-center text-white text-lg font-medium border-white border-2'
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

export default Dashboard