import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ChevronDown, Download, Plus, Trash2, Calendar, Clock, Upload, Bot, RefreshCw, Database, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import apiClient from '../../api/axiosConfig';

const CreateExamDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-green-600 text-xl font-bold !mb-3">Create?</h2>
                    <p className="text-gray-800 !mb-2">Are you sure you want to create this exam?</p>
                    <p className="text-sm text-green-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> You can go to Active Exams to edit the test.
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
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIGeneratingDialog = ({ isOpen, onCancel, remainingTime }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <div className="flex justify-center !mb-4">
                        <div className="w-16 h-16 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-[#7966F1] text-xl font-bold !mb-3">Generating Questions</h2>
                    <p className="text-gray-800 !mb-2">We are generating the question list, please wait.</p>
                    <p className="text-sm text-gray-600 !mb-6">This will take 2-5 minutes</p>
                    <button
                        onClick={onCancel}
                        className="border border-red-500 text-red-500 font-semibold !px-6 !py-2 rounded-md hover:bg-red-50 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const ImportAIDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [aiFormData, setAiFormData] = useState({
        subject: '',
        critical: 'HIGH',
        questionCount: '10',
        language: 'Marathi'
    });

    const criticalOptions = ['LOW', 'MEDIUM', 'HIGH'];

    const handleAIInputChange = (field, value) => {
        setAiFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!aiFormData.subject.trim()) {
            toast.error('Subject is required');
            return;
        }
        onConfirm(aiFormData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center !mb-6">
                    <h2 className="text-[#7966F1] text-xl font-bold !mb-3">Import from AI</h2>
                    <p className="text-gray-600">Generate questions using AI</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Subject</label>
                        <input
                            type="text"
                            value={aiFormData.subject}
                            onChange={(e) => handleAIInputChange('subject', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="Enter subject name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Critical Level</label>
                        <div className="relative">
                            <select
                                value={aiFormData.critical}
                                onChange={(e) => handleAIInputChange('critical', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 appearance-none cursor-pointer"
                            >
                                {criticalOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Question Count</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={aiFormData.questionCount}
                            onChange={(e) => handleAIInputChange('questionCount', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="Number of questions"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Language</label>
                        <input
                            type="text"
                            value={aiFormData.language}
                            onChange={(e) => handleAIInputChange('language', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="Language"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4 !mt-8">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ImportQuestionBankDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [bankFormData, setBankFormData] = useState({
        subject: '',
        critical: '',
        language: ''
    });
    const [questionList, setQuestionList] = useState([]);
    const [allSelectedQuestions, setAllSelectedQuestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [allQuestionsMap, setAllQuestionsMap] = useState(new Map());

    const handleBankInputChange = (field, value) => {
        setBankFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = async (page = 0) => {
        if (!bankFormData.subject.trim()) {
            toast.error('Subject is required');
            return;
        }

        setIsSearching(true);
        try {
            const requestBody = {
                pageSize: pageSize,
                pageNumber: page,
                filter: {
                    subject: bankFormData.subject.trim()
                }
            };

            if (bankFormData.critical) {
                requestBody.filter.criticality = bankFormData.critical;
            }

            if (bankFormData.language) {
                requestBody.filter.language = bankFormData.language;
            }

            const response = await apiClient.post('questionGenerator/getQuestionList', requestBody);

            if (response.data && response.data.success && response.data.data.content) {
                const newQuestions = response.data.data.content;
                setQuestionList(newQuestions);
                setTotalPages(response.data.data.page.totalPages);
                setTotalElements(response.data.data.page.totalElements);
                setCurrentPage(response.data.data.page.number);

                setAllQuestionsMap(prev => {
                    const newMap = new Map(prev);
                    newQuestions.forEach(q => {
                        if (!newMap.has(q.id)) {
                            newMap.set(q.id, q);
                        }
                    });
                    return newMap;
                });

                if (page === 0) {
                    setAllSelectedQuestions([]);
                }

                if (newQuestions.length === 0 && page === 0) {
                    toast.info('No questions found for the given criteria');
                }
            } else {
                toast.error('Failed to fetch questions from question bank');
                setQuestionList([]);
            }
        } catch (error) {
            console.error('Error fetching question bank:', error);
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
            setQuestionList([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            handleSearch(newPage);
        }
    };

    const generatePaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 0; i < totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage < 3) {
                for (let i = 0; i < maxVisibleButtons; i++) {
                    buttons.push(i);
                }
            } else if (currentPage > totalPages - 4) {
                for (let i = totalPages - maxVisibleButtons; i < totalPages; i++) {
                    buttons.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    buttons.push(i);
                }
            }
        }

        return buttons;
    };

    const handleQuestionSelect = (questionId) => {
        setAllSelectedQuestions(prev => {
            if (prev.includes(questionId)) {
                return prev.filter(id => id !== questionId);
            } else {
                return [...prev, questionId];
            }
        });
    };

    const handleSelectAll = () => {
        const currentPageQuestionIds = questionList.map(q => q.id);
        const allCurrentSelected = currentPageQuestionIds.every(id => allSelectedQuestions.includes(id));

        if (allCurrentSelected) {
            setAllSelectedQuestions(prev => prev.filter(id => !currentPageQuestionIds.includes(id)));
        } else {
            setAllSelectedQuestions(prev => {
                const newSelections = currentPageQuestionIds.filter(id => !prev.includes(id));
                return [...prev, ...newSelections];
            });
        }
    };

    const handleAddSelected = () => {
        if (allSelectedQuestions.length === 0) {
            toast.error('Please select at least one question');
            return;
        }

        const selectedQuestionData = allSelectedQuestions.map(id => allQuestionsMap.get(id)).filter(q => q !== undefined);
        onConfirm(selectedQuestionData);
    };

    const resetDialog = () => {
        setBankFormData({ subject: '', critical: '', language: '' });
        setQuestionList([]);
        setAllSelectedQuestions([]);
        setCurrentPage(0);
        setTotalPages(0);
        setTotalElements(0);
        setAllQuestionsMap(new Map());
    };

    if (!isOpen) return null;

    const startIndex = totalElements > 0 ? (currentPage * pageSize) + 1 : 0;
    const endIndex = totalElements > 0 ? Math.min((currentPage + 1) * pageSize, totalElements) : 0;
    const currentPageQuestionIds = questionList.map(q => q.id);
    const currentPageSelectedCount = currentPageQuestionIds.filter(id => allSelectedQuestions.includes(id)).length;
    const allCurrentPageSelected = currentPageQuestionIds.length > 0 && currentPageQuestionIds.every(id => allSelectedQuestions.includes(id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-4xl w-full mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
                <div className="text-center !mb-6">
                    <h2 className="text-[#7966F1] text-xl font-bold !mb-3">Import from Question Bank</h2>
                    <p className="text-gray-600">Select questions from existing question bank</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 !mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Subject <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={bankFormData.subject}
                            onChange={(e) => handleBankInputChange('subject', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="Enter subject name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Critical Level (Optional)</label>
                        <input
                            type="text"
                            value={bankFormData.critical}
                            onChange={(e) => handleBankInputChange('critical', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="e.g., HIGH, MEDIUM, LOW"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 !mb-2">Language (Optional)</label>
                        <input
                            type="text"
                            value={bankFormData.language}
                            onChange={(e) => handleBankInputChange('language', e.target.value)}
                            className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                            placeholder="e.g., English, Marathi"
                        />
                    </div>
                </div>

                <div className="flex justify-center !mb-6">
                    <button
                        onClick={() => handleSearch(0)}
                        disabled={isSearching}
                        className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-8 !py-3 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSearching ? 'Searching...' : 'Search Questions'}
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {questionList.length > 0 && (
                    <>
                        <hr className="border-gray-200 !my-6" />

                        <div className="flex items-center justify-between !mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Available Questions</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">Total Selected: {allSelectedQuestions.length}</span>
                                <span className="text-sm text-gray-500">({currentPageSelectedCount} on this page)</span>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-[#7966F1] font-medium text-sm hover:underline cursor-pointer"
                                >
                                    {allCurrentPageSelected ? 'Deselect All on Page' : 'Select All on Page'}
                                </button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg !p-4 !mb-4">
                            {questionList.map((question, index) => (
                                <div key={question.id || index} className="flex items-start gap-3 !p-3 border-b border-gray-100 last:border-b-0">
                                    <input
                                        type="checkbox"
                                        checked={allSelectedQuestions.includes(question.id || index)}
                                        onChange={() => handleQuestionSelect(question.id || index)}
                                        className="w-5 h-5 text-[#7966F1] border-2 border-[#7966F1] rounded focus:ring-[#7966F1] focus:ring-2 cursor-pointer !mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium !mb-2">{question.question}</p>
                                        {question.critical && (
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs !px-2 !py-1 rounded">
                                                {question.critical}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between !mb-6 !px-4">
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex} to {endIndex} of {totalElements} questions
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className={`flex items-center gap-1 !px-3 !py-2 rounded-md text-sm font-medium transition ${currentPage === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                            }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {generatePaginationButtons().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`!px-3 !py-2 rounded-md text-sm font-medium transition ${pageNum === currentPage
                                                    ? 'bg-[#7966F1] text-white'
                                                    : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                                    }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className={`flex items-center gap-1 !px-3 !py-2 rounded-md text-sm font-medium transition ${currentPage === totalPages - 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#7966F1] border border-[#7966F1] hover:bg-[#7966F1] hover:text-white cursor-pointer'
                                            }`}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            resetDialog();
                            onClose();
                        }}
                        disabled={isLoading}
                        className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    {questionList.length > 0 && (
                        <button
                            onClick={handleAddSelected}
                            disabled={isLoading || allSelectedQuestions.length === 0}
                            className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Adding...' : `Add Selected (${allSelectedQuestions.length})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const QuestionCard = ({ question, questionIndex, onQuestionChange, onOptionChange, onCorrectAnswerChange, onDeleteQuestion }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
        <div className="flex items-center justify-between !mb-4">
            <h3 className="text-[#5E48EF] text-lg font-medium">Question {questionIndex + 1}</h3>
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
            <h4 className="text-sm font-medium text-gray-600 !mb-3">Options (Select one as the correct answer)</h4>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 !mb-3">
                        <button
                            onClick={() => onCorrectAnswerChange(question.id, index)}
                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all cursor-pointer flex items-center justify-center ${question.correctAnswer === index ? 'border-[#5E48EF] bg-[#5E48EF]' : 'border-[#5E48EF] bg-transparent'
                                }`}
                            aria-label={`Select option ${index + 1} as correct answer`}
                        >
                            {question.correctAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
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

const pad = (n) => String(n).padStart(2, '0');
const nowLocalMinutes = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const splitDateTime = (v) => {
    if (!v) return { date: '', time: '' };
    const [date, time] = v.split('T');
    return { date: date || '', time: (time || '').slice(0, 5) };
};
const joinDateTime = (date, time) => (date && time ? `${date}T${time}` : date ? `${date}T00:00` : '');

const DateTimePicker = ({ label, value, onChange, minDateTime }) => {
    const { date, time } = splitDateTime(value);
    const min = splitDateTime(minDateTime || '');
    const onDate = (e) => {
        const newDate = e.target.value;
        onChange(joinDateTime(newDate, time));
    };
    const onTime = (e) => {
        const newTime = e.target.value;
        onChange(joinDateTime(date, newTime));
    };
    const timeMin = useMemo(() => {
        if (!min.date) return undefined;
        if (date === min.date) return min.time || undefined;
        return undefined;
    }, [date, min.date, min.time]);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 !mb-2">{label}</label>
            <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={onDate}
                        min={min.date || undefined}
                        className="w-full !px-4 !py-3 pr-10 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="time"
                        value={time}
                        onChange={onTime}
                        min={timeMin}
                        className="w-full !px-4 !py-3 pr-10 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
            {value && (
                <p className="text-xs text-gray-500 !mt-1">
                    Selected:{' '}
                    {new Date(value).toLocaleString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })}
                </p>
            )}
        </div>
    );
};

const CreateExam = () => {
    const [formData, setFormData] = useState({
        subjectName: '',
        teacherName: '',
        organizationCode: 'Contentive',
        batch: '',
        startTime: '',
        endTime: '',
        examDuration: '',
        isActive: true
    });
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showAIDialog, setShowAIDialog] = useState(false);
    const [showQuestionBankDialog, setShowQuestionBankDialog] = useState(false);
    const [showAIGeneratingDialog, setShowAIGeneratingDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [isQuestionBankLoading, setIsQuestionBankLoading] = useState(false);
    const [isActiveDisabled, setIsActiveDisabled] = useState(false);
    const [questions, setQuestions] = useState([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: null }]);
    const [pollingAttempts, setPollingAttempts] = useState(0);
    const [aiReferenceKey, setAiReferenceKey] = useState(null);
    const fileInputRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    // const durationOptions = ['5 mins', '10 mins', '15 mins', '20mins', '20 mins', '25 mins', '30 mins'];

    const handleInputChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleQuestionChange = useCallback((questionId, field, value) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)));
    }, []);

    const handleOptionChange = useCallback((questionId, optionIndex, value) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q
            )
        );
    }, []);

    const handleCorrectAnswerChange = useCallback((questionId, optionIndex) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, correctAnswer: optionIndex } : q)));
    }, []);

    const addNewQuestion = useCallback(() => {
        const newQuestion = { id: Date.now(), question: '', options: ['', '', '', ''], correctAnswer: null };
        setQuestions((prev) => [...prev, newQuestion]);
    }, []);

    const deleteQuestion = useCallback((questionId) => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }, []);

    const handleAddQuestions = useCallback(() => {
        setShowQuestions(true);
    }, []);

    const handleResetQuestions = useCallback(() => {
        setQuestions([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: null }]);
        setShowQuestions(false);
        toast.success('Questions reset successfully!');
    }, []);

    const downloadSampleExcel = useCallback(() => {
        const sampleData = [
            { Question: 'What is the capital of France?', 'Option 1': 'London', 'Option 2': 'Berlin', 'Option 3': 'Paris', 'Option 4': 'Madrid', 'Correct Answer': 'Paris' },
            { Question: 'Which planet is known as the Red Planet?', 'Option 1': 'Venus', 'Option 2': 'Mars', 'Option 3': 'Jupiter', 'Option 4': 'Saturn', 'Correct Answer': 'Mars' },
            { Question: 'What is 2 + 2?', 'Option 1': '3', 'Option 2': '4', 'Option 3': '5', 'Option 4': '6', 'Correct Answer': '4' }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Questions');
        XLSX.writeFile(wb, 'sample_exam_questions.xlsx');
        toast.success('Sample Excel file downloaded!');
    }, []);

    const handleExcelImport = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                if (jsonData.length === 0) {
                    toast.error('Excel file is empty');
                    return;
                }
                const requiredColumns = ['Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct Answer'];
                const firstRow = jsonData[0];
                const missingColumns = requiredColumns.filter((col) => !(col in firstRow));
                if (missingColumns.length > 0) {
                    toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
                    return;
                }
                const importedQuestions = [];
                let hasErrors = false;
                jsonData.forEach((row, index) => {
                    const rowNumber = index + 1;
                    if (!row['Question'] || !row['Question'].toString().trim()) {
                        toast.error(`Row ${rowNumber}: Question is required`);
                        hasErrors = true;
                        return;
                    }
                    const options = [
                        row['Option 1']?.toString().trim() || '',
                        row['Option 2']?.toString().trim() || '',
                        row['Option 3']?.toString().trim() || '',
                        row['Option 4']?.toString().trim() || ''
                    ];
                    if (options.some((opt) => !opt)) {
                        toast.error(`Row ${rowNumber}: All 4 options are required`);
                        hasErrors = true;
                        return;
                    }
                    const correctAnswer = row['Correct Answer']?.toString().trim();
                    if (!correctAnswer) {
                        toast.error(`Row ${rowNumber}: Correct answer is required`);
                        hasErrors = true;
                        return;
                    }
                    const correctAnswerIndex = options.findIndex((opt) => opt === correctAnswer);
                    if (correctAnswerIndex === -1) {
                        toast.error(`Row ${rowNumber}: Correct answer must match one of the options exactly`);
                        hasErrors = true;
                        return;
                    }
                    importedQuestions.push({
                        id: Date.now() + index,
                        question: row['Question'].toString().trim(),
                        options: options,
                        correctAnswer: correctAnswerIndex
                    });
                });
                if (hasErrors) return;
                if (importedQuestions.length === 0) {
                    toast.error('No valid questions found in the Excel file');
                    return;
                }

                setQuestions((prevQuestions) => {
                    const hasEmptyQuestion = prevQuestions.length === 1 &&
                        prevQuestions[0].question === '' &&
                        prevQuestions[0].options.every(opt => opt === '') &&
                        prevQuestions[0].correctAnswer === null;

                    if (hasEmptyQuestion) {
                        return importedQuestions;
                    } else {
                        return [...prevQuestions, ...importedQuestions];
                    }
                });

                setShowQuestions(true);
                toast.success(`${importedQuestions.length} questions imported successfully!`);
            } catch (error) {
                console.error('Error reading Excel file:', error);
                toast.error('Error reading Excel file. Please check the format and try again.');
            }
        };
        reader.readAsBinaryString(file);
        event.target.value = '';
    }, []);

    const pollQuestionStatus = useCallback(async (referenceKey, currentAttempt) => {
        try {
            const response = await apiClient.get(`questionGenerator/statusCheckQuestionRequest/${referenceKey}`);

            if (response.data && response.data.success) {
                if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }

                    const aiQuestions = response.data.data.map((item, index) => {
                        const correctAnswerIndex = item.options ? item.options.findIndex(opt => opt === item.correctAnswer) : 0;
                        return {
                            id: Date.now() + index,
                            question: item.question,
                            options: item.options || ['', '', '', ''],
                            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
                        };
                    });

                    setQuestions((prevQuestions) => {
                        const hasEmptyQuestion = prevQuestions.length === 1 &&
                            prevQuestions[0].question === '' &&
                            prevQuestions[0].options.every(opt => opt === '') &&
                            prevQuestions[0].correctAnswer === null;

                        if (hasEmptyQuestion) {
                            return aiQuestions;
                        } else {
                            return [...prevQuestions, ...aiQuestions];
                        }
                    });

                    setShowQuestions(true);
                    setShowAIGeneratingDialog(false);
                    setShowAIDialog(false);
                    setIsAILoading(false);
                    setPollingAttempts(0);
                    setAiReferenceKey(null);
                    toast.success(`${aiQuestions.length} questions generated and added successfully!`);
                } else {
                    if (currentAttempt >= 20) {
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }
                        setShowAIGeneratingDialog(false);
                        setIsAILoading(false);
                        setPollingAttempts(0);
                        setAiReferenceKey(null);
                        toast.error('Question generation timed out. Please try again.');
                    }
                }
            } else {
                toast.error('Failed to check question generation status');
            }
        } catch (error) {
            console.error('Error polling question status:', error);
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            setShowAIGeneratingDialog(false);
            setIsAILoading(false);
            setPollingAttempts(0);
            setAiReferenceKey(null);
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred while checking status.');
            }
        }
    }, []);

    const handleAIImport = useCallback(async (aiData) => {
        setIsAILoading(true);
        try {
            const response = await apiClient.post('questionGenerator/requestCreateQuestion', {
                subject: aiData.subject,
                critical: aiData.critical,
                questionCount: aiData.questionCount,
                language: aiData.language
            });

            if (response.data && response.data.success && response.data.data) {
                const referenceKey = response.data.data;
                setAiReferenceKey(referenceKey);
                setShowAIDialog(false);
                setShowAIGeneratingDialog(true);
                setPollingAttempts(0);

                let attemptCount = 0;
                pollingIntervalRef.current = setInterval(() => {
                    attemptCount++;
                    setPollingAttempts(attemptCount);
                    pollQuestionStatus(referenceKey, attemptCount);
                }, 30000);

            } else {
                toast.error('Failed to initiate question generation');
                setIsAILoading(false);
            }
        } catch (error) {
            console.error('Error initiating AI question generation:', error);
            setIsAILoading(false);
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }, [pollQuestionStatus]);

    const handleCancelAIGeneration = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        setShowAIGeneratingDialog(false);
        setIsAILoading(false);
        setPollingAttempts(0);
        setAiReferenceKey(null);
        toast.info('Question generation cancelled');
    }, []);

    const handleQuestionBankImport = useCallback(async (selectedQuestionData) => {
        setIsQuestionBankLoading(true);
        try {
            const bankQuestions = selectedQuestionData.map((item, index) => {
                const correctAnswerIndex = item.options ? item.options.findIndex(opt => opt === item.correctAnswer) : 0;
                return {
                    id: Date.now() + index,
                    question: item.question,
                    options: item.options || ['', '', '', ''],
                    correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
                };
            });

            setQuestions((prevQuestions) => {
                const hasEmptyQuestion = prevQuestions.length === 1 &&
                    prevQuestions[0].question === '' &&
                    prevQuestions[0].options.every(opt => opt === '') &&
                    prevQuestions[0].correctAnswer === null;

                if (hasEmptyQuestion) {
                    return bankQuestions;
                } else {
                    return [...prevQuestions, ...bankQuestions];
                }
            });

            setShowQuestions(true);
            setShowQuestionBankDialog(false);
            toast.success(`${bankQuestions.length} questions imported from question bank successfully!`);
        } catch (error) {
            console.error('Error importing questions from bank:', error);
            toast.error('An error occurred while importing questions from question bank.');
        } finally {
            setIsQuestionBankLoading(false);
        }
    }, []);

    const canToggleActive = () => {
        if (!formData.startTime) return false;
        const startDate = new Date(formData.startTime);
        const currentDate = new Date();
        const timeDifference = startDate.getTime() - currentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        return hoursDifference > 24;
    };

    const handleSubmit = useCallback(() => {
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
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            toast.error('End date and time must be after start date and time');
            return;
        }
        const validQuestions = questions.filter(
            (q) => q.question.trim() !== '' && q.options.length === 4 && q.options.every((opt) => opt.trim() !== '') && q.correctAnswer !== null
        );
        const invalidQuestions = questions.filter(
            (q) => q.question.trim() === '' || q.options.length !== 4 || !q.options.every((opt) => opt.trim() !== '') || q.correctAnswer === null
        );
        if (invalidQuestions.length > 0) {
            toast.error('All questions must have exactly 4 options and a correct answer selected');
            return;
        }
        if (validQuestions.length === 0) {
            toast.error('At least one complete question is required');
            return;
        }
        setShowDialog(true);
    }, [formData, questions]);

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

    const handleCreate = useCallback(async () => {
        setIsLoading(true);
        try {
            const validQuestions = questions.filter(
                (q) => q.question.trim() !== '' && q.options.length === 4 && q.options.every((opt) => opt.trim() !== '') && q.correctAnswer !== null
            );
            const questionList = validQuestions.map((q) => ({
                question: q.question.trim(),
                options: q.options.map((opt) => opt.trim()),
                correctAnswer: q.options[q.correctAnswer].trim()
            }));
            const examData = {
                questionList,
                examDuration: formData.examDuration.replace(' mins', ''),
                subjectName: formData.subjectName.trim(),
                teacherName: formData.teacherName.trim(),
                batch: formData.batch.trim(),
                startTime: formatDateForAPI(formData.startTime),
                endTime: formatDateForAPI(formData.endTime),
                isActive: isActiveDisabled ? true : formData.isActive,
                orgCode: localStorage.getItem('orgCode')
            };
            const response = await apiClient.post('/questionPaper/createQuestionPaper', examData);
            console.log('API Response:', response.data);
            toast.success('Exam created successfully!');
            setShowDialog(false);
            setFormData({
                subjectName: '',
                teacherName: '',
                organizationCode: 'Contentive',
                batch: '',
                startTime: '',
                endTime: '',
                examDuration: '30 mins',
                isActive: true
            });
            setQuestions([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: null }]);
            setShowQuestions(false);
        } catch (error) {
            console.error('Error creating exam:', error);
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [formData, questions, isActiveDisabled]);

    const getRemainingTime = useMemo(() => {
        if (pollingAttempts === 0) return '2-5 minutes';
        const elapsedMinutes = (pollingAttempts * 30) / 60;
        const remainingMinutes = Math.max(0, 5 - elapsedMinutes);
        if (remainingMinutes < 1) return 'Less than 1 minute';
        return `${Math.ceil(remainingMinutes)} minute${Math.ceil(remainingMinutes) > 1 ? 's' : ''}`;
    }, [pollingAttempts]);

    const minStart = nowLocalMinutes();
    const minEnd = formData.startTime || minStart;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-[#7966F1] !px-6 !py-4 flex items-center justify-between">
                <h1 className="text-white text-xl font-medium">Create Exam</h1>
                <div className="flex items-center gap-5">
                    <Download className="w-5 h-5 text-white cursor-pointer" onClick={downloadSampleExcel} />
                    <button
                        onClick={downloadSampleExcel}
                        className="bg-[#7966F1] border border-white text-white !px-4 !py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all cursor-pointer"
                    >
                        Sample Excel
                    </button>
                </div>
            </div>

            <div className="!p-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-8 !mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">Subject Name</label>
                            <input
                                type="text"
                                value={formData.subjectName}
                                onChange={(e) => handleInputChange('subjectName', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                placeholder="Subject Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">Teacher Name</label>
                            <input
                                type="text"
                                value={formData.teacherName}
                                onChange={(e) => handleInputChange('teacherName', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                placeholder="Teacher Name"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">Exam Duration (minutes)</label>
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
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">Exam Duration (in minutes)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.examDuration}
                                onChange={(e) => handleInputChange('examDuration', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                placeholder="Enter duration"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">Batch</label>
                            <input
                                type="text"
                                value={formData.batch}
                                onChange={(e) => handleInputChange('batch', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                placeholder="Batch"
                            />
                        </div>

                        <DateTimePicker
                            label="Start Date & Time"
                            value={formData.startTime}
                            onChange={(v) => handleInputChange('startTime', v)}
                            minDateTime={minStart}
                        />

                        <DateTimePicker
                            label="End Date & Time"
                            value={formData.endTime}
                            onChange={(v) => handleInputChange('endTime', v)}
                            minDateTime={minEnd}
                        />
                    </div>

                    <div className="flex justify-center !mt-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                disabled={!canToggleActive()}
                                onClick={() => setIsActiveDisabled(!canToggleActive())}
                                className="w-5 h-5 text-[#5E48EF] border-2 border-[#5E48EF] rounded focus:ring-[#5E48EF] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            />
                            <label
                                htmlFor="isActive"
                                className={`text-sm font-medium ${!canToggleActive() ? 'text-gray-400' : 'text-gray-600 cursor-pointer'}`}
                            >
                                Is Active
                            </label>
                            {!canToggleActive() && formData.startTime && (
                                <span className="text-xs text-gray-400 !ml-2">(Can only be toggled if start date is more than 24 hours from now)</span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 !mt-8">
                        <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx,.xls" className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            Import from Excel
                            <Upload className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowAIDialog(true)}
                            className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#FF6B6B] hover:to-[#FF8E53] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            Import from AI
                            <Bot className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowQuestionBankDialog(true)}
                            className="bg-gradient-to-r from-[#28A745] to-[#20C997] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#28A745] hover:to-[#20C997] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            Import from Question Bank
                            <Database className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleResetQuestions}
                            className="bg-gradient-to-r from-[#6C757D] to-[#495057] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#6C757D] hover:to-[#495057] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                            Reset
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

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
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>

            <ToastContainer />

            {showDialog && (
                <CreateExamDialog isOpen={showDialog} onClose={() => setShowDialog(false)} onConfirm={handleCreate} isLoading={isLoading} />
            )}

            {showAIDialog && (
                <ImportAIDialog
                    isOpen={showAIDialog}
                    onClose={() => setShowAIDialog(false)}
                    onConfirm={handleAIImport}
                    isLoading={isAILoading}
                />
            )}

            {showAIGeneratingDialog && (
                <AIGeneratingDialog
                    isOpen={showAIGeneratingDialog}
                    onCancel={handleCancelAIGeneration}
                    remainingTime={getRemainingTime}
                />
            )}

            {showQuestionBankDialog && (
                <ImportQuestionBankDialog
                    isOpen={showQuestionBankDialog}
                    onClose={() => setShowQuestionBankDialog(false)}
                    onConfirm={handleQuestionBankImport}
                    isLoading={isQuestionBankLoading}
                />
            )}
        </div>
    );
};

export default CreateExam;