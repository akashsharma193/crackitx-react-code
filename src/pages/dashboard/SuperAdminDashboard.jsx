import React, { useState, useEffect } from 'react';
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import createExamIcon from '/src/assets/icons/create-exam-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';
import apiClient from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = ({ setActiveTab }) => {
    const [dashboardData, setDashboardData] = useState({
        totalAdmins: 0,
        totalOrganizations: 0,
        activeConfigurations: 0,
        complianceReports: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const dashboardCards = [
        { title: 'Total Admins', icon: studentsIcon, count: dashboardData.totalAdmins, tab: 'Create Admin' },
        { title: 'Organizations', icon: activeExamIcon, count: dashboardData.totalOrganizations, tab: 'Create Organization' },
        { title: 'Configurations', icon: examhistoryIcon, count: dashboardData.activeConfigurations, tab: 'Configuration' },
        { title: 'Compliance Reports', icon: activeExamIcon, count: dashboardData.complianceReports, tab: 'Compliance' },
        { title: 'Total Users', icon: resourcesIcon, count: dashboardData.totalUsers, tab: null },
    ];

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.post('/super-admin/dashboard/getCount');

            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching super admin dashboard data:', err);
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
                <div className='bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-8 !py-4 !mb-8'>
                    <h2 className='text-2xl text-white font-bold'>Super Admin Dashboard</h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full !px-6'>
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
                <div className='bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4 !mb-8'>
                    <h2 className='text-2xl text-white font-bold'>Super Admin Dashboard</h2>
                </div>
                <div className='text-red-500 text-center p-4 !px-6'>
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
            <div className='bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4 !mb-8'>
                <h2 className='text-2xl text-white font-bold'>Super Admin Dashboard</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full !px-6'>
                {dashboardCards.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => card.tab && setActiveTab(card.tab)}
                        className={`max-w-sm rounded-lg flex bg-[#7966F1] !p-4 justify-between items-center text-white text-lg font-medium border-white border-2 ${card.tab ? 'cursor-pointer hover:bg-[#6855E0] transition-colors' : 'cursor-default'}`}
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

export default SuperAdminDashboard;