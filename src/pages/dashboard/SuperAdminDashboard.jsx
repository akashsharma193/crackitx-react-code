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

    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-[#7966F1] to-[#9F85FF] bg-clip-text text-transparent mb-4">
                    Coming Soon
                </h1>
                <p className="text-2xl bg-gradient-to-r from-[#7966F1] to-[#9F85FF] bg-clip-text text-transparent opacity-90">
                    Super Admin Dashboard
                </p>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;