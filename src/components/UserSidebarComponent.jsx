import React, { useEffect, useCallback } from 'react';
import { Trophy, XCircle, CheckCircle, Clock, CalendarClock } from 'lucide-react';
import dashboardIcon from '/src/assets/icons/dashboard-icon.png';
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';
import logOutIcon from '/src/assets/icons/logout-icon.png';
// ssss
const sidebarItems = [
    { label: 'Dashboard', icon: dashboardIcon },
    { label: 'All Test', icon: studentsIcon },
    { label: 'Active Exam', icon: activeExamIcon },
    { label: 'Exam History', icon: examhistoryIcon },
    { label: 'Ranking', icon: 'lucide', lucideIcon: Trophy },
    { label: 'Upcoming Exam', icon: 'lucide', lucideIcon: CalendarClock },
    { label: 'Missed Exam', icon: 'lucide', lucideIcon: Clock },
    { label: 'Passed Exam', icon: 'lucide', lucideIcon: CheckCircle },
    { label: 'Failed Exam', icon: 'lucide', lucideIcon: XCircle },
    { label: 'E-Resources', icon: resourcesIcon },
    { label: 'Log Out', icon: logOutIcon },
];

const UserSidebarComponent = React.memo(({ activeTab, setActiveTab }) => {
    useEffect(() => {
        const existingStyle = document.head.querySelector('#user-sidebar-scrollbar-styles');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'user-sidebar-scrollbar-styles';
            style.textContent = `
                .user-sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .user-sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .user-sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }
                .user-sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const handleItemClick = useCallback((label) => {
        setActiveTab(label);
    }, [setActiveTab]);

    return (
        <div className='w-64 bg-[url(/src/assets/images/wavy-background-image.png)] text-white font-semibold flex-shrink-0 h-full overflow-y-auto user-sidebar-scroll'>
            {sidebarItems.map((item, index) => (
                <React.Fragment key={item.label}>
                    <div
                        className={`flex gap-4 items-center !px-5 !py-6 cursor-pointer transition-all duration-200 relative
                        ${activeTab === item.label ? 'text-white' : ''}`}
                        onClick={() => handleItemClick(item.label)}
                    >
                        {activeTab === item.label && (
                            <div className="absolute left-0 top-0 h-full w-2 bg-white rounded-r-md" />
                        )}
                        {item.icon === 'lucide' ? (
                            <item.lucideIcon className='w-[30px] h-[30px] opacity-80' />
                        ) : (
                            <img className='w-[30px]' src={item.icon} alt={item.label} />
                        )}
                        {item.label}
                    </div>
                    <hr />
                </React.Fragment>
            ))}
        </div>
    );
});

UserSidebarComponent.displayName = 'UserSidebarComponent';

export default UserSidebarComponent;