import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserActiveExams from '../pages/active-exams/UserActiveExams';
import QuizPage from '../pages/quiz-page/Quiz_Page';


const ExamContainer = () => {
    const [currentView, setCurrentView] = useState('exams');
    const [selectedExam, setSelectedExam] = useState(null);

    const handleNavigateToQuiz = (examData) => {
        console.log('Navigating to quiz with data:', examData);
        setSelectedExam(examData);
        setCurrentView('quiz');
    };

    const handleBackToExams = () => {
        setCurrentView('exams');
        setSelectedExam(null);
    };

    const handleQuizSubmit = (results) => {
        console.log('Quiz results:', results);
        toast.success(`Quiz completed! Score: ${results.score}%`);

        // Optional: Auto navigate back after a delay
        setTimeout(() => {
            handleBackToExams();
        }, 3000);
    };

    return (
        <div className="h-screen">
            {currentView === 'exams' ? (
                <UserActiveExams onNavigateToQuiz={handleNavigateToQuiz} />
            ) : (
                <QuizPage
                    examData={selectedExam}
                    onSubmitQuiz={handleQuizSubmit}
                    onBackToExams={handleBackToExams}
                />
            )}
        </div>
    );
};

export default ExamContainer;