import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Send, ArrowLeft, AlertCircle, X, Bookmark, BookmarkX } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const SubmitConfirmationDialog = ({ isOpen, onClose, onConfirm, loading, unansweredCount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center !mx-auto !mb-4">
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 !mb-3">Submit Quiz?</h2>
                    <p className="text-gray-600 !mb-2">Are you sure you want to submit your quiz?</p>
                    {unansweredCount > 0 && (
                        <p className="text-sm text-red-500 font-medium !mb-4">
                            You have {unansweredCount} unanswered questions.
                        </p>
                    )}
                    <p className="text-sm text-gray-500 !mb-6">
                        Once submitted, you cannot make any changes.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="border border-gray-300 text-gray-700 font-semibold !px-6 !py-2 rounded-md hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabSwitchWarningDialog = ({ isOpen, onClose, warningCount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center !mx-auto !mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 !mb-3">Tab Switch Warning!</h2>
                    <p className="text-gray-600 !mb-2">You switched tabs during the quiz.</p>
                    <p className="text-sm text-red-500 font-medium !mb-4">
                        Warning {warningCount}/3: {3 - warningCount} warnings remaining
                    </p>
                    {warningCount === 3 ? (
                        <p className="text-sm text-red-600 font-semibold !mb-6">
                            Test is submitted due to rules violation!
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 !mb-6">
                            Your quiz will be auto-submitted after 3 tab switches.
                        </p>
                    )}
                    {warningCount < 3 && (
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer"
                        >
                            Continue Quiz
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuizPage = ({ examData, onSubmitQuiz, onBackToExams, hideSubmitButton }) => {
    const currentExam = examData;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
    const [markedForReview, setMarkedForReview] = useState(new Set());
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const [showResultPage, setShowResultPage] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    const [questionStartTimes, setQuestionStartTimes] = useState({});
    const [questionTimeTaken, setQuestionTimeTaken] = useState({});
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showTabWarning, setShowTabWarning] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        if (currentExam?.questionList) {
            setQuestions(currentExam.questionList);
            const duration = currentExam.actualDuration || parseInt(currentExam.examDuration || 30);
            setTimeRemaining(duration * 60);
            setExamStarted(true);
            const startTime = Date.now();
            setQuestionStartTimes({ 0: startTime });
        }
    }, [currentExam]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && examStarted && !isSubmitted && !showTabWarning) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);
                setShowTabWarning(true);

                if (newCount >= 3) {
                    setTimeout(() => {
                        setShowTabWarning(false);
                        handleSubmitQuizDirectly();
                    }, 2000);
                }
            }
        };

        const handleFocusChange = () => {
            if (!document.hasFocus() && examStarted && !isSubmitted && !showTabWarning) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);
                setShowTabWarning(true);

                if (newCount >= 3) {
                    setTimeout(() => {
                        setShowTabWarning(false);
                        handleSubmitQuizDirectly();
                    }, 2000);
                }
            }
        };

        const handleBeforeUnload = (e) => {
            if (!isSubmitted && examStarted) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        const handlePopstate = (e) => {
            if (!isSubmitted && examStarted) {
                e.preventDefault();
                window.history.pushState(null, '', window.location.pathname);
                setShowSubmitDialog(true);
            }
        };

        if (examStarted && !isSubmitted) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleFocusChange);
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('popstate', handlePopstate);
            window.history.pushState(null, '', window.location.pathname);
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleFocusChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [examStarted, isSubmitted, tabSwitchCount, showTabWarning]);

    useEffect(() => {
        if (timeRemaining > 0 && !isSubmitted && examStarted) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0 && !isSubmitted && examStarted) {
            handleSubmitQuizDirectly();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timeRemaining, isSubmitted, examStarted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatTimeDisplay = (seconds) => {
        if (!seconds || seconds < 1) return '0s';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    const recordQuestionTime = (questionIndex) => {
        const currentTime = Date.now();
        const startTime = questionStartTimes[questionIndex];
        if (startTime && !questionTimeTaken[questionIndex]) {
            const timeTakenMs = currentTime - startTime;
            const timeTakenSeconds = Math.round(timeTakenMs / 1000);
            setQuestionTimeTaken(prev => ({
                ...prev,
                [questionIndex]: timeTakenSeconds
            }));
        }
    };

    const handleAnswerSelect = (selectedOption) => {
        if (isSubmitted) return;

        recordQuestionTime(currentQuestionIndex);

        const updatedAnswers = {
            ...selectedAnswers,
            [currentQuestionIndex]: selectedOption
        };
        setSelectedAnswers(updatedAnswers);

        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].userAnswer = selectedOption;
        setQuestions(updatedQuestions);
    };

    const handleMarkForReview = () => {
        if (isSubmitted) return;

        const newMarkedForReview = new Set(markedForReview);
        if (newMarkedForReview.has(currentQuestionIndex)) {
            newMarkedForReview.delete(currentQuestionIndex);
        } else {
            newMarkedForReview.add(currentQuestionIndex);
        }
        setMarkedForReview(newMarkedForReview);
    };

    const handleClearAnswer = () => {
        if (isSubmitted) return;

        const updatedAnswers = { ...selectedAnswers };
        delete updatedAnswers[currentQuestionIndex];
        setSelectedAnswers(updatedAnswers);

        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].userAnswer = null;
        setQuestions(updatedQuestions);
    };

    const goToQuestion = (questionIndex) => {
        if (questionIndex >= 0 && questionIndex < questions.length) {
            recordQuestionTime(currentQuestionIndex);

            setCurrentQuestionIndex(questionIndex);
            setVisitedQuestions(prev => new Set([...prev, questionIndex]));

            if (!questionStartTimes[questionIndex]) {
                setQuestionStartTimes(prev => ({
                    ...prev,
                    [questionIndex]: Date.now()
                }));
            }
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            const newIndex = currentQuestionIndex - 1;
            goToQuestion(newIndex);
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            const newIndex = currentQuestionIndex + 1;
            goToQuestion(newIndex);
        }
    };

    const handleBackClick = () => {
        setShowSubmitDialog(true);
    };

    const handleSubmitClick = () => {
        setShowSubmitDialog(true);
    };

    const handleSubmitDialogClose = () => {
        setShowSubmitDialog(false);
    };

    const handleSubmitDialogConfirm = () => {
        setShowSubmitDialog(false);
        handleSubmitQuiz(false);
    };

    const handleTabWarningClose = () => {
        setShowTabWarning(false);
    };

    const handleSubmitQuizDirectly = async () => {
        if (submitting) return;

        if (tabSwitchCount >= 3) {
            toast.warning('Test is submitted due to rules violation!');
        } else {
            toast.warning('Time is up! Quiz submitted automatically.');
        }

        recordQuestionTime(currentQuestionIndex);
        setSubmitting(true);

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            const userId = userData?.userId ||
                userData?.id ||
                userData?.user_id ||
                userData?.ID ||
                localStorage.getItem('userId') ||
                currentExam?.userId ||
                null;

            const answerPaper = questions.map((question, index) => ({
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                userAnswer: selectedAnswers[index] || null,
                color: null,
                timeTaken: questionTimeTaken[index] || 0
            }));

            const submissionData = {
                answerPaper,
                subjectName: currentExam?.subjectName,
                teacherName: currentExam?.teacherName,
                orgCode: currentExam?.orgCode,
                batch: currentExam?.batch,
                userId: userId,
                questionId: currentExam?.questionId,
                examDuration: currentExam?.examDuration,
                startTime: currentExam?.startTime,
                endTime: currentExam?.endTime
            };

            await apiClient.post('/user-activity/saveAnswePaper', submissionData);

            setIsSubmitted(true);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            const correctAnswers = questions.filter((q, index) =>
                selectedAnswers[index] === q.correctAnswer
            ).length;
            const wrongAnswers = questions.filter((q, index) =>
                selectedAnswers[index] && selectedAnswers[index] !== q.correctAnswer
            ).length;
            const skippedAnswers = questions.length - Object.keys(selectedAnswers).length;
            const score = Math.round((correctAnswers / questions.length) * 100);

            setQuizResults({
                correctAnswers,
                wrongAnswers,
                skippedAnswers,
                totalQuestions: questions.length,
                score,
                questions: questions.map((q, index) => ({
                    ...q,
                    userAnswer: selectedAnswers[index] || null,
                    isCorrect: selectedAnswers[index] === q.correctAnswer,
                    timeTaken: questionTimeTaken[index] || 0
                }))
            });

            setShowResultPage(true);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            toast.error('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitQuiz = async (autoSubmit = false) => {
        if (submitting) return;

        recordQuestionTime(currentQuestionIndex);

        setSubmitting(true);

        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            const userId = userData?.userId ||
                userData?.id ||
                userData?.user_id ||
                userData?.ID ||
                localStorage.getItem('userId') ||
                currentExam?.userId ||
                null;

            console.log('User Data:', userData);
            console.log('Extracted User ID:', userId);

            const answerPaper = questions.map((question, index) => ({
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                userAnswer: selectedAnswers[index] || null,
                color: null,
                timeTaken: questionTimeTaken[index] || 0
            }));

            const submissionData = {
                answerPaper,
                subjectName: currentExam?.subjectName,
                teacherName: currentExam?.teacherName,
                orgCode: currentExam?.orgCode,
                batch: currentExam?.batch,
                userId: userId,
                questionId: currentExam?.questionId,
                examDuration: currentExam?.examDuration,
                startTime: currentExam?.startTime,
                endTime: currentExam?.endTime
            };

            console.log('Submission Data:', submissionData);

            await apiClient.post('/user-activity/saveAnswePaper', submissionData);

            setIsSubmitted(true);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            const correctAnswers = questions.filter((q, index) =>
                selectedAnswers[index] === q.correctAnswer
            ).length;
            const wrongAnswers = questions.filter((q, index) =>
                selectedAnswers[index] && selectedAnswers[index] !== q.correctAnswer
            ).length;
            const skippedAnswers = questions.length - Object.keys(selectedAnswers).length;
            const score = Math.round((correctAnswers / questions.length) * 100);

            setQuizResults({
                correctAnswers,
                wrongAnswers,
                skippedAnswers,
                totalQuestions: questions.length,
                score,
                questions: questions.map((q, index) => ({
                    ...q,
                    userAnswer: selectedAnswers[index] || null,
                    isCorrect: selectedAnswers[index] === q.correctAnswer,
                    timeTaken: questionTimeTaken[index] || 0
                }))
            });

            setShowResultPage(true);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const getQuestionStatus = (index) => {
        if (index === currentQuestionIndex) {
            return 'current';
        } else if (markedForReview.has(index)) {
            if (selectedAnswers[index] !== undefined) {
                return 'answered-review';
            } else {
                return 'marked-review';
            }
        } else if (selectedAnswers[index] !== undefined) {
            return 'answered';
        } else if (visitedQuestions.has(index)) {
            return 'unanswered';
        } else {
            return 'not-visited';
        }
    };

    if (showResultPage) {
        return <ResultPage results={quizResults} onBackToExams={onBackToExams} />;
    }

    if (!currentExam) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin !mx-auto !mb-4"></div>
                    <div className="text-[#7966F1] text-lg font-semibold">Loading Quiz...</div>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 !mx-auto !mb-4" />
                    <div className="text-red-500 text-lg font-semibold !mb-4">No questions available for this quiz</div>
                    {onBackToExams && (
                        <button
                            onClick={onBackToExams}
                            className="flex items-center gap-2 !mx-auto bg-[#7966F1] text-white !px-4 !py-2 rounded-lg hover:bg-[#5a4bcc] transition cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    const isCurrentQuestionMarked = markedForReview.has(currentQuestionIndex);

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            <div className="bg-[#7966F1] text-white !px-6 !py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    {onBackToExams && (
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 !px-3 !py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm">Back</span>
                        </button>
                    )}

                    <div>
                        <h1 className="text-xl font-bold">{currentExam?.subjectName || 'Quiz'}</h1>
                        <p className="text-sm opacity-90">Conducted by: {currentExam?.teacherName || 'Unknown'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {tabSwitchCount > 0 && (
                        <div className="flex items-center gap-2 bg-red-500/20 border border-red-300 !px-3 !py-2 rounded-lg">
                            <AlertCircle size={16} />
                            <span className="text-sm">Tab switches: {tabSwitchCount}/3</span>
                        </div>
                    )}

                    <div className={`flex items-center gap-2 !px-4 !py-2 rounded-lg ${timeRemaining <= 60 ? 'bg-red-500/20 border border-red-300' : 'bg-white/10'}`}>
                        <Clock size={20} />
                        <span className={`text-lg font-mono font-bold ${timeRemaining <= 60 ? 'text-red-300' : ''}`}>
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 !p-6 overflow-y-auto">
                    <div className="max-w-4xl !mx-auto">
                        <div className="!mb-6 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleMarkForReview}
                                        disabled={isSubmitted}
                                        className={`flex items-center gap-2 !px-3 !py-2 rounded-lg text-sm font-medium transition cursor-pointer ${isCurrentQuestionMarked
                                                ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            } ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {isCurrentQuestionMarked ? <BookmarkX size={16} /> : <Bookmark size={16} />}
                                        {isCurrentQuestionMarked ? 'Unmark' : 'Mark for Review'}
                                    </button>
                                    <button
                                        onClick={handleClearAnswer}
                                        disabled={isSubmitted || !selectedAnswers[currentQuestionIndex]}
                                        className={`flex items-center gap-2 !px-3 !py-2 rounded-lg text-sm font-medium transition cursor-pointer ${selectedAnswers[currentQuestionIndex]
                                                ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            } ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        <X size={16} />
                                        Clear
                                    </button>
                                </div>
                                {timeRemaining <= 60 && !isSubmitted && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm">
                                        <AlertCircle size={16} />
                                        <span>Time running out!</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg !p-6 shadow-md !mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 !mb-6">
                                {currentQuestion.question}
                            </h2>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, optionIndex) => {
                                    const isSelected = selectedAnswers[currentQuestionIndex] === option;
                                    return (
                                        <button
                                            key={optionIndex}
                                            onClick={() => handleAnswerSelect(option)}
                                            disabled={isSubmitted}
                                            className={`w-full text-left !p-4 border-2 rounded-lg transition-all duration-200 ${isSelected
                                                ? 'bg-[#7966F1] text-white border-[#7966F1]'
                                                : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-[#7966F1]'
                                                } ${!isSubmitted ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${isSelected
                                                    ? 'border-white text-white'
                                                    : 'border-gray-300 text-gray-600'
                                                    }`}>
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </span>
                                                <span>{option}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={goToPrevious}
                                disabled={currentQuestionIndex === 0}
                                className={`flex items-center gap-2 !px-6 !py-2 rounded-lg font-medium transition ${currentQuestionIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            {!isSubmitted && !hideSubmitButton && (
                                <button
                                    onClick={handleSubmitClick}
                                    disabled={submitting}
                                    className={`flex items-center gap-2 !px-6 !py-2 rounded-lg font-medium transition cursor-pointer ${submitting
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-[#7966F1] text-white hover:bg-[#5a4bcc]'
                                        }`}
                                >
                                    <Send size={16} />
                                    Submit Quiz
                                </button>
                            )}

                            <button
                                onClick={goToNext}
                                disabled={currentQuestionIndex === questions.length - 1}
                                className={`flex items-center gap-2 !px-6 !py-2 rounded-lg font-medium transition ${currentQuestionIndex === questions.length - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                    }`}
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-80 bg-white border-l border-gray-200 !p-6 overflow-y-auto flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800 !mb-4">Questions</h3>

                    <div className="grid grid-cols-5 gap-2 !mb-6">
                        {questions.map((_, index) => {
                            const status = getQuestionStatus(index);
                            let bgColor = 'bg-white border-gray-300';
                            let textColor = 'text-gray-600';

                            switch (status) {
                                case 'current':
                                    bgColor = 'bg-[#7966F1] border-[#7966F1]';
                                    textColor = 'text-white';
                                    break;
                                case 'answered':
                                    bgColor = 'bg-green-500 border-green-500';
                                    textColor = 'text-white';
                                    break;
                                case 'answered-review':
                                    bgColor = 'bg-orange-500 border-orange-500';
                                    textColor = 'text-white';
                                    break;
                                case 'marked-review':
                                    bgColor = 'bg-yellow-500 border-yellow-500';
                                    textColor = 'text-white';
                                    break;
                                case 'unanswered':
                                    bgColor = 'bg-red-500 border-red-500';
                                    textColor = 'text-white';
                                    break;
                                case 'not-visited':
                                    bgColor = 'bg-gray-300 border-gray-300';
                                    textColor = 'text-gray-600';
                                    break;
                                default:
                                    bgColor = 'bg-white border-gray-300';
                                    textColor = 'text-gray-600';
                                    break;
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 border-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer hover:scale-105 ${bgColor} ${textColor}`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-2 text-sm !mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-[#7966F1] rounded"></div>
                            <span className="text-gray-600">Current Question</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-gray-600">Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-gray-600">Answered & Marked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-gray-600">Marked for Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-gray-600">Unanswered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 rounded"></div>
                            <span className="text-gray-600">Not Visited</span>
                        </div>
                    </div>
                </div>
            </div>

            <SubmitConfirmationDialog
                isOpen={showSubmitDialog}
                onClose={handleSubmitDialogClose}
                onConfirm={handleSubmitDialogConfirm}
                loading={submitting}
                unansweredCount={unansweredCount}
            />

            <TabSwitchWarningDialog
                isOpen={showTabWarning}
                onClose={handleTabWarningClose}
                warningCount={tabSwitchCount}
            />
        </div>
    );
};

const ResultPage = ({ results, onBackToExams }) => {
    const formatTimeDisplay = (seconds) => {
        if (!seconds || seconds < 1) return '0s';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    const PieChart = ({ correct, wrong, skipped, total }) => {
        const correctPercentage = (correct / total) * 100;
        const wrongPercentage = (wrong / total) * 100;
        const skippedPercentage = (skipped / total) * 100;

        const correctAngle = (correctPercentage / 100) * 360;
        const wrongAngle = (wrongPercentage / 100) * 360;
        const skippedAngle = (skippedPercentage / 100) * 360;

        const radius = 80;
        const circumference = 2 * Math.PI * radius;

        const correctStrokeDasharray = `${(correctAngle / 360) * circumference} ${circumference}`;
        const wrongStrokeDasharray = `${(wrongAngle / 360) * circumference} ${circumference}`;
        const skippedStrokeDasharray = `${(skippedAngle / 360) * circumference} ${circumference}`;

        const correctOffset = 0;
        const wrongOffset = -((correctAngle / 360) * circumference);
        const skippedOffset = -(((correctAngle + wrongAngle) / 360) * circumference);

        return (
            <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                    />

                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={correctStrokeDasharray}
                        strokeDashoffset={correctOffset}
                        strokeLinecap="round"
                    />

                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={wrongStrokeDasharray}
                        strokeDashoffset={wrongOffset}
                        strokeLinecap="round"
                    />

                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="20"
                        strokeDasharray={skippedStrokeDasharray}
                        strokeDashoffset={skippedOffset}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#7966F1]">{results.score}%</div>
                        <div className="text-sm text-gray-600">Score</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            <div className="bg-[#7966F1] text-white !px-6 !py-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    {onBackToExams && (
                        <button
                            onClick={onBackToExams}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 !px-3 !py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm">Back</span>
                        </button>
                    )}
                    <h1 className="text-xl font-bold">Quiz Results</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto !px-6 !py-8">
                <div className="max-w-4xl !mx-auto">
                    <div className="bg-white rounded-lg !p-8 shadow-md !mb-8">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex justify-center">
                                <PieChart
                                    correct={results.correctAnswers}
                                    wrong={results.wrongAnswers}
                                    skipped={results.skippedAnswers}
                                    total={results.totalQuestions}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center !p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{results.correctAnswers}</div>
                                        <div className="text-sm text-green-700">Correct</div>
                                        <div className="w-4 h-4 bg-green-500 rounded !mx-auto !mt-2"></div>
                                    </div>

                                    <div className="text-center !p-4 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{results.wrongAnswers}</div>
                                        <div className="text-sm text-red-700">Wrong</div>
                                        <div className="w-4 h-4 bg-red-500 rounded !mx-auto !mt-2"></div>
                                    </div>

                                    <div className="text-center !p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-600">{results.skippedAnswers}</div>
                                        <div className="text-sm text-gray-700">Skipped</div>
                                        <div className="w-4 h-4 bg-gray-500 rounded !mx-auto !mt-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 !mb-4">Question Review</h2>

                        {results.questions.map((question, index) => (
                            <div key={index} className="bg-white rounded-lg !p-6 shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${question.userAnswer === question.correctAnswer
                                        ? 'bg-green-500 text-white'
                                        : question.userAnswer === null
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 !mb-4">
                                            <h3 className="font-semibold text-gray-800">{question.question}</h3>
                                            <span className="text-sm text-gray-500 bg-gray-100 !px-2 !py-1 rounded">
                                                Time Taken: {formatTimeDisplay(question.timeTaken)}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {question.options.map((option, optionIndex) => {
                                                const isCorrect = option === question.correctAnswer;
                                                const isUserAnswer = option === question.userAnswer;

                                                let bgColor = 'bg-gray-50';
                                                let textColor = 'text-gray-700';
                                                let borderColor = 'border-gray-200';

                                                if (isCorrect) {
                                                    bgColor = 'bg-green-100';
                                                    textColor = 'text-green-800';
                                                    borderColor = 'border-green-300';
                                                } else if (isUserAnswer && !isCorrect) {
                                                    bgColor = 'bg-red-100';
                                                    textColor = 'text-red-800';
                                                    borderColor = 'border-red-300';
                                                }

                                                return (
                                                    <div
                                                        key={optionIndex}
                                                        className={`!p-3 border rounded-lg ${bgColor} ${textColor} ${borderColor}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                                                                {String.fromCharCode(65 + optionIndex)}
                                                            </span>
                                                            <span className="flex-1">{option}</span>
                                                            {isCorrect && (
                                                                <span className="text-xs font-semibold text-green-600 bg-green-200 !px-2 !py-1 rounded">
                                                                    Correct
                                                                </span>
                                                            )}
                                                            {isUserAnswer && !isCorrect && (
                                                                <span className="text-xs font-semibold text-red-600 bg-red-200 !px-2 !py-1 rounded">
                                                                    Your Answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!question.userAnswer && (
                                            <div className="!mt-3 text-sm text-gray-500 bg-gray-100 !p-2 rounded">
                                                This question was not answered
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;