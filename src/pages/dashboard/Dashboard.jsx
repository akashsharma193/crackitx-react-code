import React from 'react'
import studentsIcon from '/src/assets/icons/students-icon.png';
import examhistoryIcon from '/src/assets/icons/exam-history-icon.png';
import createExamIcon from '/src/assets/icons/create-exam-icon.png';
import activeExamIcon from '/src/assets/icons/active-exams-icon.png';
import resourcesIcon from '/src/assets/icons/e-resources-icon.png';

// Dashboard Cards
const dashboardCards = [
    { title: 'All Students', icon: studentsIcon, count: 10 },
    { title: 'Exam History', icon: examhistoryIcon, count: 10 },
    { title: 'Create Exam', icon: createExamIcon, count: 10 },
    { title: 'Active Exam', icon: activeExamIcon, count: 10 },
    { title: 'E-Resources', icon: resourcesIcon, count: 10 },
];

const Dashboard = () => {
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