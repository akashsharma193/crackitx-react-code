import React from 'react';
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
    { label: 'Past Exams', icon: examhistoryIcon },
    { label: 'Upcoming Exam', icon: activeExamIcon },
    { label: 'E-Resources', icon: resourcesIcon },
    { label: 'Log Out', icon: logOutIcon },
];

const SidebarComponent = ({ activeTab, setActiveTab }) => {
    return (
        <div className='w-64 bg-[url(/src/assets/images/wavy-background-image.png)] text-white font-semibold flex-shrink-0'>
            {sidebarItems.map((item, index) => (
                <React.Fragment key={index}>
                    <div
                        className={`flex gap-4 items-center !px-5 !py-6 cursor-pointer transition-all duration-200 relative
                        ${activeTab === item.label ? 'text-white' : ''}`}
                        onClick={() => setActiveTab(item.label)}
                    >
                        {/* Active indicator bar */}
                        {activeTab === item.label && (
                            <div className="absolute left-0 top-0 h-full w-2 bg-white rounded-r-md" />
                        )}
                        <img className='w-[30px]' src={item.icon} alt={item.label} />
                        {item.label}
                    </div>
                    <hr />
                </React.Fragment>
            ))}
        </div>
    );
};

export default SidebarComponent;
