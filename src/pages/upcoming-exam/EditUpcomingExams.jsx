import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Download, Plus, Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const EditExamDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-green-600 text-xl font-bold !mb-3">Update?</h2>
                    <p className="text-gray-800 !mb-2">Are you sure you want to update this exam?</p>
                    <p className="text-sm text-green-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> Changes will be applied immediately.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuestionCard = ({ question, questionIndex, onQuestionChange, onOptionChange, onCorrectAnswerChange, onDeleteQuestion }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
        <div className="flex items-center justify-between !mb-4">
            <h3 className="text-[#5E48EF] text-lg font-medium">
                Question {questionIndex + 1}
            </h3>
            <button
                onClick={() => onDeleteQuestion(question.id)}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                aria-label="Delete question"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>

        <div className="!mb-6">
            <textarea
                value={question.question}
                onChange={(e) => onQuestionChange(question.id, 'question', e.target.value)}
                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 resize-none"
                placeholder="Enter your question here..."
                rows="3"
            />
        </div>

        <div className="!mb-4">
            <h4 className="text-sm font-medium text-gray-600 !mb-3">
                Options (Select one as the correct answer)
            </h4>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 !mb-3">
                        <button
                            onClick={() => onCorrectAnswerChange(question.id, index)}
                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all cursor-pointer flex items-center justify-center ${question.correctAnswer === index
                                ? 'border-[#5E48EF] bg-[#5E48EF]'
                                : 'border-[#5E48EF] bg-transparent'
                                }`}
                            aria-label={`Select option ${index + 1} as correct answer`}
                        >
                            {question.correctAnswer === index && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </button>
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => onOptionChange(question.id, index, e.target.value)}
                            className="flex-1 !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder={`Option ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const EditUpcomingExams = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get passed data from previous screen
    const passedExamData = location.state?.examData || null;
    const isEditMode = location.state?.isEdit || false;
    const examId = passedExamData?.id || null;

    const [formData, setFormData] = useState({
        subjectName: '',
        teacherName: '',
        organizationCode: 'Contentive',
        batch: '',
        startTime: '',
        endTime: '',
        examDuration: '30 mins',
        isActive: true
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: null
        }
    ]);

    const durationOptions = ['5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins'];

    // Pre-populate form with passed data
    useEffect(() => {
        if (passedExamData && isEditMode) {
            setFormData({
                subjectName: passedExamData.subjectName || '',
                teacherName: passedExamData.teacherName || '',
                organizationCode: passedExamData.orgCode || 'Contentive',
                batch: passedExamData.batch || '',
                startTime: passedExamData.startTime || '',
                endTime: passedExamData.endTime || '',
                examDuration: passedExamData.examDuration || '30 mins',
                isActive: passedExamData.isActive !== undefined ? passedExamData.isActive : true
            });

            // Pre-populate questions if available
            if (passedExamData.questionList && passedExamData.questionList.length > 0) {
                const transformedQuestions = passedExamData.questionList.map((q, index) => ({
                    id: index + 1,
                    question: q.question || '',
                    options: q.options || ['', '', '', ''],
                    correctAnswer: q.options ? q.options.findIndex(opt => opt === q.correctAnswer) : null
                }));
                setQuestions(transformedQuestions);
                setShowQuestions(true);
            }
        }
    }, [passedExamData, isEditMode]);

    const handleBack = () => {
        navigate('/home', { state: { activeTab: 'Upcoming Exam' } });
    };

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleQuestionChange = useCallback((questionId, field, value) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, [field]: value } : q
        ));
    }, []);

    const handleOptionChange = useCallback((questionId, optionIndex, value) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? {
                    ...q,
                    options: q.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    )
                }
                : q
        ));
    }, []);

    const handleCorrectAnswerChange = useCallback((questionId, optionIndex) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, correctAnswer: optionIndex } : q
        ));
    }, []);

    const addNewQuestion = useCallback(() => {
        const newQuestion = {
            id: Date.now(),
            question: '',
            options: ['', '', '', ''],
            correctAnswer: null
        };
        setQuestions(prev => [...prev, newQuestion]);
    }, []);

    const deleteQuestion = useCallback((questionId) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    }, []);

    const handleAddQuestions = useCallback(() => {
        setShowQuestions(true);
    }, []);

    // Check if start date is more than 24 hours from current time
    const canToggleActive = () => {
        if (!formData.startTime) return false;
        const startDate = new Date(formData.startTime);
        const currentDate = new Date();
        const timeDifference = startDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        return hoursDifference > 24;
    };

    const handleSubmit = useCallback(() => {
        // Validation
        if (!formData.subjectName.trim()) {
            toast.error('Subject name is required');
            return;
        }
        if (!formData.teacherName.trim()) {
            toast.error('Teacher name is required');
            return;
        }
        if (!formData.batch.trim()) {
            toast.error('Batch is required');
            return;
        }
        if (!formData.startTime) {
            toast.error('Start date and time is required');
            return;
        }
        if (!formData.endTime) {
            toast.error('End date and time is required');
            return;
        }

        // Validate that end time is after start time
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            toast.error('End date and time must be after start date and time');
            return;
        }

        const validQuestions = questions.filter(q =>
            q.question.trim() !== '' &&
            q.options.every(opt => opt.trim() !== '') &&
            q.correctAnswer !== null
        );

        if (validQuestions.length === 0) {
            toast.error('At least one complete question is required');
            return;
        }

        // Check if exam ID is available for edit mode
        if (isEditMode && !examId) {
            toast.error('Exam ID is required for updating');
            return;
        }

        setShowDialog(true);
    }, [formData, questions, isEditMode, examId]);

    const formatDateForAPI = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
    };

    const handleUpdate = useCallback(async () => {
        setIsLoading(true);

        try {
            // Prepare questions data
            const validQuestions = questions.filter(q =>
                q.question.trim() !== '' &&
                q.options.every(opt => opt.trim() !== '') &&
                q.correctAnswer !== null
            );

            const questionList = validQuestions.map(q => ({
                question: q.question.trim(),
                options: q.options.map(opt => opt.trim()),
                correctAnswer: q.options[q.correctAnswer].trim()
            }));

            // Prepare exam data
            const examData = {
                questionList,
                examDuration: formData.examDuration.replace(' mins', ''), // Remove 'mins' suffix
                subjectName: formData.subjectName.trim(),
                teacherName: formData.teacherName.trim(),
                batch: formData.batch.trim(),
                startTime: formatDateForAPI(formData.startTime),
                endTime: formatDateForAPI(formData.endTime),
                isActive: formData.isActive,
                orgCode: localStorage.getItem('orgCode') || formData.organizationCode,
            };

            // Add ID for edit mode
            if (isEditMode && examId) {
                examData.id = examId;
            }

            console.log('Sending exam data:', examData);

            // Use different endpoints based on mode
            const endpoint =
                '/questionPaper/createQuestionPaper';

            const response = await apiClient.post(endpoint, examData);

            console.log('API Response:', response.data);

            // Success
            toast.success(`Exam ${isEditMode ? 'updated' : 'created'} successfully!`);
            setShowDialog(false);

            // Navigate back to previous screen
            setTimeout(() => {
                navigate('/home', { state: { activeTab: 'Upcoming Exam' } });
            }, 1500);

        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} exam:`, error);

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    `Server error: ${error.response.status}`;
                toast.error(errorMessage);
            } else if (error.request) {
                // Request was made but no response received
                toast.error('Network error. Please check your connection and try again.');
            } else {
                // Something else happened
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [formData, questions, isEditMode, examId, navigate]);

    // Get current date and time in the required format for datetime-local input
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDisplayDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 overflow-hidden">
                <SidebarComponent activeTab="Upcoming Exam" setActiveTab={() => { }} />

                <div className="flex-1 bg-gray-50 overflow-y-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="text-white hover:text-gray-200 transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-white text-xl font-medium">
                                {isEditMode ? 'Edit Upcoming Exam' : 'Create New Exam'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-5">
                            <Download className="w-5 h-5 text-white cursor-pointer" />
                            <button className="bg-white/10 border border-white text-white !px-4 !py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all cursor-pointer">
                                Sample Excel
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="!p-8">
                        {/* Form Container */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-8 !mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Subject Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        Subject Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subjectName}
                                        onChange={(e) => handleInputChange('subjectName', e.target.value)}
                                        className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                        placeholder="Subject Name"
                                    />
                                </div>

                                {/* Teacher Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        Teacher Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.teacherName}
                                        onChange={(e) => handleInputChange('teacherName', e.target.value)}
                                        className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                        placeholder="Teacher Name"
                                    />
                                </div>

                                {/* Exam Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        Exam Duration (minutes)
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 text-left flex items-center justify-between cursor-pointer"
                                        >
                                            <span>{formData.examDuration}</span>
                                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 !mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                {durationOptions.map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            handleInputChange('examDuration', option);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full !px-4 !py-3 text-left hover:bg-[#5E48EF]/5 first:rounded-t-lg last:rounded-b-lg transition-colors cursor-pointer"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Batch */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        Batch
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.batch}
                                        onChange={(e) => handleInputChange('batch', e.target.value)}
                                        className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                        placeholder="Batch"
                                    />
                                </div>

                                {/* Start Date and Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        Start Date & Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={formData.startTime}
                                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                                            min={getCurrentDateTime()}
                                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    {formData.startTime && (
                                        <p className="text-xs text-gray-500 !mt-1">
                                            Selected: {formatDisplayDateTime(formData.startTime)}
                                        </p>
                                    )}
                                </div>

                                {/* End Date and Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 !mb-2">
                                        End Date & Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={formData.endTime}
                                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                                            min={formData.startTime || getCurrentDateTime()}
                                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <Clock className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    {formData.endTime && (
                                        <p className="text-xs text-gray-500 !mt-1">
                                            Selected: {formatDisplayDateTime(formData.endTime)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Is Active Checkbox - Centered */}
                            <div className="flex justify-center !mt-6">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        disabled={!canToggleActive()}
                                        className="w-5 h-5 text-[#5E48EF] border-2 border-[#5E48EF] rounded focus:ring-[#5E48EF] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    />
                                    <label
                                        htmlFor="isActive"
                                        className={`text-sm font-medium ${!canToggleActive() ? 'text-gray-400' : 'text-gray-600 cursor-pointer'}`}
                                    >
                                        Is Active
                                    </label>
                                    {!canToggleActive() && formData.startTime && (
                                        <span className="text-xs text-gray-400 !ml-2">
                                            (Can only be toggled if start date is more than 24 hours from now)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Import from Excel Button */}
                            <div className="flex justify-center !mt-8">
                                <button className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all flex items-center gap-2 shadow-lg cursor-pointer">
                                    Import from Excel
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Questions Section */}
                        {showQuestions && (
                            <div className="!mb-6">
                                {questions.map((question, index) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        questionIndex={index}
                                        onQuestionChange={handleQuestionChange}
                                        onOptionChange={handleOptionChange}
                                        onCorrectAnswerChange={handleCorrectAnswerChange}
                                        onDeleteQuestion={deleteQuestion}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center gap-4">
                            {showQuestions && (
                                <button
                                    onClick={addNewQuestion}
                                    className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                                >
                                    Add Questions
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}

                            {!showQuestions && (
                                <button
                                    onClick={handleAddQuestions}
                                    className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                                >
                                    Add Questions
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-12 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Exam' : 'Create Exam')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />

            {showDialog && (
                <EditExamDialog
                    isOpen={showDialog}
                    onClose={() => setShowDialog(false)}
                    onConfirm={handleUpdate}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default EditUpcomingExams;