import React, { useEffect, useCallback } from 'react';
import { Settings, UserPlus, Building2, Shield, Bell, BookOpen, FileText } from 'lucide-react';
import dashboardIcon from '/src/assets/icons/dashboard-icon.png';
import logOutIcon from '/src/assets/icons/logout-icon.png';

const sidebarItems = [
    { label: 'Dashboard', icon: dashboardIcon },
    { label: 'Configuration', icon: 'lucide', lucideIcon: Settings },
    { label: 'Create Admin', icon: 'lucide', lucideIcon: UserPlus },
    { label: 'Create Organization', icon: 'lucide', lucideIcon: Building2 },
    { label: 'Subject', icon: 'lucide', lucideIcon: BookOpen },
    { label: 'Topic', icon: 'lucide', lucideIcon: FileText },
    { label: 'Compliance', icon: 'lucide', lucideIcon: Shield },
    { label: 'Notification', icon: 'lucide', lucideIcon: Bell },
    { label: 'Log Out', icon: logOutIcon },
];

const SuperAdminSidebarComponent = React.memo(({ activeTab, setActiveTab }) => {
    useEffect(() => {
        const existingStyle = document.head.querySelector('#superadmin-sidebar-scrollbar-styles');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'superadmin-sidebar-scrollbar-styles';
            style.textContent = `
                .superadmin-sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .superadmin-sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .superadmin-sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }
                .superadmin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
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
        <div className='w-64 min-w-[256px] bg-[url(/src/assets/images/wavy-background-image.png)] text-white font-semibold flex-shrink-0 min-h-screen overflow-y-auto superadmin-sidebar-scroll'>
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

SuperAdminSidebarComponent.displayName = 'SuperAdminSidebarComponent';

export default SuperAdminSidebarComponent;