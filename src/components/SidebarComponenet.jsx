import React, { useEffect, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import dashboardIcon from '/src/assets/icons/dashboard-icon.png';
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import createExamIcon from '/src/assets/icons/create-exam-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';
import logOutIcon from '/src/assets/icons/logout-icon.png';

const sidebarItems = [
    { label: 'Dashboard', icon: dashboardIcon },
    { label: 'Students', icon: studentsIcon },
    { label: 'Create Exam', icon: createExamIcon },
    { label: 'Active Exam', icon: activeExamIcon },
    { label: 'Exam History', icon: examhistoryIcon },
    { label: 'Ranking', icon: 'lucide', lucideIcon: Trophy },
    { label: 'Upcoming Exam', icon: activeExamIcon },
    { label: 'E-Resources', icon: resourcesIcon },
    { label: 'Log Out', icon: logOutIcon },
];

const SidebarComponent = React.memo(({ activeTab, setActiveTab }) => {
    useEffect(() => {
        const existingStyle = document.head.querySelector('#sidebar-scrollbar-styles');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'sidebar-scrollbar-styles';
            style.textContent = `
                .sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
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
        <div className='w-64 bg-[url(/src/assets/images/wavy-background-image.png)] text-white font-semibold flex-shrink-0 h-full overflow-y-auto sidebar-scroll'>
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

SidebarComponent.displayName = 'SidebarComponent';

export default SidebarComponent;