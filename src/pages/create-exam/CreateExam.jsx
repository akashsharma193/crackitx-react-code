import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { ChevronDown, Download, Plus, Trash2, Calendar, Clock, Upload, Bot, RefreshCw, Database, Search, ChevronLeft, ChevronRight, X, Image as ImageIcon, Type, GripVertical, Edit2, Check } from 'lucide-react';
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

const AIGeneratingDialog = ({ isOpen, onCancel }) => {
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

const QuestionCard = ({ question, questionIndex, onQuestionChange, onOptionChange, onCorrectAnswerChange, onDeleteQuestion, onCategoryChange, onQuestionTypeChange, onOptionTypeChange, onImageUpload }) => {
    const questionImageRef = useRef(null);
    const optionImageRefs = useRef([]);
    const [tempCategory, setTempCategory] = useState(question.category || '');
    const [questionInputMode, setQuestionInputMode] = useState(question.questionInputMode || 'text');
    const [optionsInputMode, setOptionsInputMode] = useState(question.optionsInputMode || 'text');

    const handleQuestionImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(question.id, 'question', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOptionImageUpload = (optionIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(question.id, 'option', reader.result, optionIndex);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategoryUpdate = () => {
        if (tempCategory.trim() === '') {
            toast.error('Category cannot be empty');
            return;
        }
        onCategoryChange(question.id, tempCategory);
        toast.success('Category updated successfully');
    };

    const handleQuestionInputModeChange = (mode) => {
        setQuestionInputMode(mode);
        onQuestionChange(question.id, 'questionInputMode', mode);
        if (mode === 'text') {
            onImageUpload(question.id, 'question', null);
            onQuestionTypeChange(question.id, 'text');
        } else if (mode === 'image') {
            onQuestionChange(question.id, 'question', '');
            onQuestionTypeChange(question.id, 'image');
        } else if (mode === 'both') {
            onQuestionTypeChange(question.id, 'text');
        }
    };

    const handleOptionsInputModeChange = (mode) => {
        setOptionsInputMode(mode);
        onQuestionChange(question.id, 'optionsInputMode', mode);
        if (mode === 'text') {
            question.options.forEach((_, index) => {
                onImageUpload(question.id, 'option', null, index);
                onOptionTypeChange(question.id, index, 'text');
            });
        } else if (mode === 'image') {
            question.options.forEach((_, index) => {
                onOptionChange(question.id, index, '');
                onOptionTypeChange(question.id, index, 'image');
            });
        } else if (mode === 'both') {
            question.options.forEach((_, index) => {
                onOptionTypeChange(question.id, index, 'text');
            });
        }
    };

    return (
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

            <div className="!mb-4">
                <div className="flex items-center justify-between !mb-2">
                    <label className="block text-sm font-medium text-gray-600">Question Input Mode</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleQuestionInputModeChange('text')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${questionInputMode === 'text' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Type className="w-4 h-4" />
                            Text Only
                        </button>
                        <button
                            onClick={() => handleQuestionInputModeChange('image')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${questionInputMode === 'image' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            Image Only
                        </button>
                        <button
                            onClick={() => handleQuestionInputModeChange('both')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${questionInputMode === 'both' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Type className="w-4 h-4" />
                            <ImageIcon className="w-4 h-4" />
                            Both
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {(questionInputMode === 'text' || questionInputMode === 'both') && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 !mb-1">Question Text</label>
                            <textarea
                                value={question.question}
                                onChange={(e) => onQuestionChange(question.id, 'question', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 resize-none"
                                placeholder="Enter your question here..."
                                rows="3"
                            />
                        </div>
                    )}

                    {(questionInputMode === 'image' || questionInputMode === 'both') && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 !mb-1">Question Image</label>
                            <input
                                type="file"
                                ref={questionImageRef}
                                onChange={handleQuestionImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            {question.questionImage ? (
                                <div className="relative">
                                    <img src={question.questionImage} alt="Question" className="w-full max-h-64 object-contain border border-[#5E48EF] rounded-lg" />
                                    <button
                                        onClick={() => onImageUpload(question.id, 'question', null)}
                                        className="absolute top-2 right-2 bg-red-500 text-white !p-2 rounded-full hover:bg-red-600 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => questionImageRef.current?.click()}
                                    className="w-full !px-4 !py-8 border-2 border-dashed border-[#5E48EF] rounded-lg hover:bg-[#5E48EF]/5 transition cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <ImageIcon className="w-8 h-8 text-[#5E48EF]" />
                                    <span className="text-sm text-gray-600">Click to upload question image</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="!mb-4">
                <div className="flex items-center justify-between !mb-3">
                    <h4 className="text-sm font-medium text-gray-600">Options Input Mode</h4>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleOptionsInputModeChange('text')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${optionsInputMode === 'text' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Type className="w-4 h-4" />
                            Text Only
                        </button>
                        <button
                            onClick={() => handleOptionsInputModeChange('image')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${optionsInputMode === 'image' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            Image Only
                        </button>
                        <button
                            onClick={() => handleOptionsInputModeChange('both')}
                            className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${optionsInputMode === 'both' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <Type className="w-4 h-4" />
                            <ImageIcon className="w-4 h-4" />
                            Both
                        </button>
                    </div>
                </div>

                <div className="!mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Options (Select one as the correct answer)</h4>
                </div>
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <div key={index} className="flex items-start gap-3 !mb-3">
                            <button
                                onClick={() => onCorrectAnswerChange(question.id, index)}
                                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all cursor-pointer flex items-center justify-center !mt-3 ${question.correctAnswer === index ? 'border-[#5E48EF] bg-[#5E48EF]' : 'border-[#5E48EF] bg-transparent'}`}
                                aria-label={`Select option ${index + 1} as correct answer`}
                            >
                                {question.correctAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                            </button>

                            <div className="flex-1 space-y-2">
                                <span className="text-xs text-gray-500">Option {index + 1}</span>

                                {(optionsInputMode === 'text' || optionsInputMode === 'both') && (
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => onOptionChange(question.id, index, e.target.value)}
                                        className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                        placeholder={`Option ${index + 1} text`}
                                    />
                                )}

                                {(optionsInputMode === 'image' || optionsInputMode === 'both') && (
                                    <div className='!mt-3'>
                                        <input
                                            type="file"
                                            ref={(el) => (optionImageRefs.current[index] = el)}
                                            onChange={(e) => handleOptionImageUpload(index, e)}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        {option.image ? (
                                            <div className="relative">
                                                <img src={option.image} alt={`Option ${index + 1}`} className="w-full max-h-32 object-contain border border-[#5E48EF] rounded-lg" />
                                                <button
                                                    onClick={() => onImageUpload(question.id, 'option', null, index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white !p-1 rounded-full hover:bg-red-600 cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => optionImageRefs.current[index]?.click()}
                                                className="w-full !px-4 !py-6 border-2 border-dashed border-[#5E48EF] rounded-lg hover:bg-[#5E48EF]/5 transition cursor-pointer flex flex-col items-center gap-1"
                                            >
                                                <ImageIcon className="w-6 h-6 text-[#5E48EF]" />
                                                <span className="text-xs text-gray-600">Upload option {index + 1} image</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CategoryAccordion = ({ category, questions, onQuestionChange, onOptionChange, onCorrectAnswerChange, onDeleteQuestion, onCategoryChange, onQuestionTypeChange, onOptionTypeChange, onImageUpload, onMoveQuestion, onAddQuestion }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [draggedQuestion, setDraggedQuestion] = useState(null);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editedCategoryName, setEditedCategoryName] = useState(category);

    const handleDragStart = (e, questionId) => {
        setDraggedQuestion(questionId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedQuestion) {
            onMoveQuestion(draggedQuestion, editedCategoryName);
            setDraggedQuestion(null);
        }
    };

    const handleCategoryEdit = () => {
        if (editedCategoryName.trim() && editedCategoryName !== category) {
            questions.forEach(q => {
                onCategoryChange(q.id, editedCategoryName);
            });
        }
        setIsEditingCategory(false);
    };

    const handleCategoryKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCategoryEdit();
        } else if (e.key === 'Escape') {
            setEditedCategoryName(category);
            setIsEditingCategory(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 !mb-6">
            <div
                className="flex items-center justify-between !p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => !isEditingCategory && setIsOpen(!isOpen)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex items-center gap-3">
                    <ChevronDown className={`w-5 h-5 text-[#5E48EF] transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                    {isEditingCategory ? (
                        <input
                            type="text"
                            value={editedCategoryName}
                            onChange={(e) => setEditedCategoryName(e.target.value)}
                            onBlur={handleCategoryEdit}
                            onKeyDown={handleCategoryKeyPress}
                            onClick={(e) => e.stopPropagation()}
                            className="!px-3 !py-1 border-2 border-[#5E48EF] rounded text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#5E48EF]"
                            autoFocus
                        />
                    ) : (
                        <h2 className="text-[#5E48EF] text-xl font-bold">{editedCategoryName || 'Uncategorized'}</h2>
                    )}
                    {!isEditingCategory && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingCategory(true);
                            }}
                            className="text-[#5E48EF] hover:text-[#7966F1] transition"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    {isEditingCategory && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryEdit();
                            }}
                            className="text-green-600 hover:text-green-700 transition"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                    )}
                    <span className="bg-[#5E48EF] text-white text-sm !px-3 !py-1 rounded-full">{questions.length}</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddQuestion(editedCategoryName);
                    }}
                    className="bg-[#5E48EF] text-white !px-4 !py-2 rounded-lg font-medium hover:bg-[#7966F1] transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Question
                </button>
            </div>

            {isOpen && (
                <div className="!p-4 !pt-0">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, question.id)}
                            className="cursor-move"
                        >
                            <div className="flex items-start gap-2">
                                <div className="!pt-8">
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <QuestionCard
                                        question={question}
                                        questionIndex={index}
                                        onQuestionChange={onQuestionChange}
                                        onOptionChange={onOptionChange}
                                        onCorrectAnswerChange={onCorrectAnswerChange}
                                        onDeleteQuestion={onDeleteQuestion}
                                        onCategoryChange={onCategoryChange}
                                        onQuestionTypeChange={onQuestionTypeChange}
                                        onOptionTypeChange={onOptionTypeChange}
                                        onImageUpload={onImageUpload}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
                        type="time" value={time}
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
    const [batches, setBatches] = useState([]);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
    const [batchSearchTerm, setBatchSearchTerm] = useState('');
    const batchDropdownRef = useRef(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showAIDialog, setShowAIDialog] = useState(false);
    const [showQuestionBankDialog, setShowQuestionBankDialog] = useState(false);
    const [showAIGeneratingDialog, setShowAIGeneratingDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [isQuestionBankLoading, setIsQuestionBankLoading] = useState(false);
    const [isActiveDisabled, setIsActiveDisabled] = useState(false);
    const [questions, setQuestions] = useState([{
        id: 1,
        question: '',
        options: [
            { text: '', type: 'text', image: null },
            { text: '', type: 'text', image: null },
            { text: '', type: 'text', image: null },
            { text: '', type: 'text', image: null }
        ],
        correctAnswer: null,
        category: '',
        questionType: 'text',
        optionType: 'text',
        questionImage: null,
        optionImages: [null, null, null, null]
    }]);
    const [pollingAttempts, setPollingAttempts] = useState(0);
    const [aiReferenceKey, setAiReferenceKey] = useState(null);
    const fileInputRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    useEffect(() => {
        const orgCode = localStorage.getItem('orgCode');
        if (orgCode) {
            fetchBatches(orgCode);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (batchDropdownRef.current && !batchDropdownRef.current.contains(event.target)) {
                setBatchDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBatches = async (organizationName) => {
        setIsLoadingBatches(true);
        try {
            const response = await apiClient.post('/user-open/getAllBatchByOrganization', {
                organization: organizationName
            });
            if (response.data && response.data.success && response.data.data) {
                setBatches(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            toast.error('Failed to load batches');
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, batch: batch.name }));
        setBatchSearchTerm(batch.name);
        setBatchDropdownOpen(false);
    };

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
        batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase())
    );
    const handleInputChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleQuestionChange = useCallback((questionId, field, value) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)));
    }, []);

    const handleOptionChange = useCallback((questionId, optionIndex, value) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === questionId ? {
                    ...q,
                    options: q.options.map((opt, idx) => (idx === optionIndex ? { ...opt, text: value } : opt))
                } : q
            )
        );
    }, []);

    const handleCorrectAnswerChange = useCallback((questionId, optionIndex) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, correctAnswer: optionIndex } : q)));
    }, []);

    const handleCategoryChange = useCallback((questionId, category) => {
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, category } : q)));
    }, []);

    const handleQuestionTypeChange = useCallback((questionId, type) => {
        setQuestions((prev) => prev.map((q) => {
            if (q.id === questionId) {
                if (type === 'text') {
                    return { ...q, questionType: type, questionImage: null };
                } else {
                    return { ...q, questionType: type, question: '' };
                }
            }
            return q;
        }));
    }, []);

    const handleOptionTypeChange = useCallback((questionId, optionIndex, type) => {
        setQuestions((prev) => prev.map((q) => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                if (type === 'text') {
                    newOptions[optionIndex] = { text: '', type: 'text', image: null };
                } else {
                    newOptions[optionIndex] = { text: '', type: 'image', image: null };
                }
                return { ...q, options: newOptions };
            }
            return q;
        }));
    }, []);

    const handleImageUpload = useCallback((questionId, imageType, imageData, optionIndex = null) => {
        setQuestions((prev) => prev.map((q) => {
            if (q.id === questionId) {
                if (imageType === 'question') {
                    return { ...q, questionImage: imageData };
                } else if (imageType === 'option' && optionIndex !== null) {
                    const newOptions = [...q.options];
                    newOptions[optionIndex] = { ...newOptions[optionIndex], image: imageData };
                    return { ...q, options: newOptions };
                }
            }
            return q;
        }));
    }, []);

    const handleMoveQuestion = useCallback((questionId, targetCategory) => {
        setQuestions((prev) => prev.map((q) =>
            q.id === questionId ? { ...q, category: targetCategory } : q
        ));
        toast.success('Question moved successfully');
    }, []);

    const addNewQuestion = useCallback(() => {
        const lastQuestion = questions[questions.length - 1];
        const newQuestion = {
            id: Date.now(),
            question: '',
            options: [
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null }
            ],
            correctAnswer: null,
            category: lastQuestion?.category || '',
            questionType: 'text',
            optionType: 'text',
            questionImage: null,
            optionImages: [null, null, null, null]
        };
        setQuestions((prev) => [...prev, newQuestion]);
    }, [questions]);

    const addQuestionToCategory = useCallback((categoryName) => {
        const newQuestion = {
            id: Date.now(),
            question: '',
            options: [
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null }
            ],
            correctAnswer: null,
            category: categoryName,
            questionType: 'text',
            optionType: 'text',
            questionImage: null,
            optionImages: [null, null, null, null]
        };
        setQuestions((prev) => [...prev, newQuestion]);
    }, []);

    const addNewSection = useCallback(() => {
        const newQuestion = {
            id: Date.now(),
            question: '',
            options: [
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null }
            ],
            correctAnswer: null,
            category: '',
            questionType: 'text',
            optionType: 'text',
            questionImage: null,
            optionImages: [null, null, null, null]
        };
        setQuestions((prev) => [...prev, newQuestion]);
        toast.info('New section created! Please enter a category name.');
    }, []);

    const deleteQuestion = useCallback((questionId) => {
        setQuestions((prev) => {
            const filtered = prev.filter((q) => q.id !== questionId);
            if (filtered.length === 0) {
                setShowQuestions(false);
                return [{
                    id: Date.now(),
                    question: '',
                    options: [
                        { text: '', type: 'text', image: null },
                        { text: '', type: 'text', image: null },
                        { text: '', type: 'text', image: null },
                        { text: '', type: 'text', image: null }
                    ],
                    correctAnswer: null,
                    category: '',
                    questionType: 'text',
                    optionType: 'text',
                    questionImage: null,
                    optionImages: [null, null, null, null]
                }];
            }
            return filtered;
        });
    }, []);

    const handleAddQuestions = useCallback(() => {
        setShowQuestions(true);
    }, []);

    const handleResetQuestions = useCallback(() => {
        setQuestions([{
            id: 1,
            question: '',
            options: [
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null },
                { text: '', type: 'text', image: null }
            ],
            correctAnswer: null,
            category: '',
            questionType: 'text',
            optionType: 'text',
            questionImage: null,
            optionImages: [null, null, null, null]
        }]);
        setShowQuestions(false);
        toast.success('Questions reset successfully!');
    }, []);
    const downloadSampleExcel = useCallback(() => {
        const sampleData = [
            {
                Question: 'What is the capital of France?',
                'Option 1': 'London',
                'Option 2': 'Berlin',
                'Option 3': 'Paris',
                'Option 4': 'Madrid',
                'Correct Answer': 'Paris',
            },
            {
                Question: 'Which planet is known as the Red Planet?',
                'Option 1': 'Venus',
                'Option 2': 'Mars',
                'Option 3': 'Jupiter',
                'Option 4': 'Saturn',
                'Correct Answer': 'Mars',
            },
            {
                Question: 'What is 2+2',
                'Option 1': '4',
                'Option 2': '5',
                'Option 3': '6',
                'Option 4': '7',
                'Correct Answer': '4',
            }
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

                const importedQuestions = [];
                let hasErrors = false;

                jsonData.forEach((row, index) => {
                    const rowNumber = index + 1;
                    const questionType = (row['Question Type'] || 'text').toString().toLowerCase();
                    const optionType = (row['Option Type'] || 'text').toString().toLowerCase();

                    if (questionType === 'text') {
                        if (!row['Question'] || !row['Question'].toString().trim()) {
                            toast.error(`Row ${rowNumber}: Question text is required when Question Type is text`);
                            hasErrors = true;
                            return;
                        }
                    }

                    if (questionType === 'image') {
                        if (!row['Question Image URL'] || !row['Question Image URL'].toString().trim()) {
                            toast.error(`Row ${rowNumber}: Question Image URL is required when Question Type is image`);
                            hasErrors = true;
                            return;
                        }
                    }

                    let options = ['', '', '', ''];
                    let optionImages = [null, null, null, null];

                    if (optionType === 'text') {
                        options = [
                            row['Option 1']?.toString().trim() || '',
                            row['Option 2']?.toString().trim() || '',
                            row['Option 3']?.toString().trim() || '',
                            row['Option 4']?.toString().trim() || ''
                        ];
                        if (options.some((opt) => !opt)) {
                            toast.error(`Row ${rowNumber}: All 4 text options are required when Option Type is text`);
                            hasErrors = true;
                            return;
                        }
                    }

                    if (optionType === 'image') {
                        optionImages = [
                            row['Option 1 Image URL']?.toString().trim() || null,
                            row['Option 2 Image URL']?.toString().trim() || null,
                            row['Option 3 Image URL']?.toString().trim() || null,
                            row['Option 4 Image URL']?.toString().trim() || null
                        ];
                        if (optionImages.some((img) => !img)) {
                            toast.error(`Row ${rowNumber}: All 4 option image URLs are required when Option Type is image`);
                            hasErrors = true;
                            return;
                        }
                    }

                    const correctAnswer = row['Correct Answer']?.toString().trim();
                    if (!correctAnswer) {
                        toast.error(`Row ${rowNumber}: Correct answer is required`);
                        hasErrors = true;
                        return;
                    }

                    let correctAnswerIndex = -1;
                    if (optionType === 'text') {
                        correctAnswerIndex = options.findIndex((opt) => opt === correctAnswer);
                        if (correctAnswerIndex === -1) {
                            toast.error(`Row ${rowNumber}: Correct answer must match one of the text options exactly`);
                            hasErrors = true;
                            return;
                        }
                    } else {
                        const correctAnswerNumber = parseInt(correctAnswer);
                        if (correctAnswerNumber >= 1 && correctAnswerNumber <= 4) {
                            correctAnswerIndex = correctAnswerNumber - 1;
                        } else {
                            toast.error(`Row ${rowNumber}: For image options, Correct Answer must be 1, 2, 3, or 4`);
                            hasErrors = true;
                            return;
                        }
                    }

                    importedQuestions.push({
                        id: Date.now() + index,
                        question: questionType === 'text' ? (row['Question']?.toString().trim() || '') : '',
                        questionImage: questionType === 'image' ? (row['Question Image URL']?.toString().trim() || null) : null,
                        options: [
                            { text: options[0], type: optionType, image: optionType === 'image' ? optionImages[0] : null },
                            { text: options[1], type: optionType, image: optionType === 'image' ? optionImages[1] : null },
                            { text: options[2], type: optionType, image: optionType === 'image' ? optionImages[2] : null },
                            { text: options[3], type: optionType, image: optionType === 'image' ? optionImages[3] : null }
                        ],
                        optionImages: optionImages,
                        correctAnswer: correctAnswerIndex,
                        category: row['Category']?.toString().trim() || '',
                        questionType: questionType,
                        optionType: optionType
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
                        prevQuestions[0].questionImage === null &&
                        prevQuestions[0].options.every(opt => opt.text === '' && opt.image === null) &&
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
                        const opts = item.options || ['', '', '', ''];
                        return {
                            id: Date.now() + index,
                            question: item.question,
                            options: [
                                { text: opts[0], type: 'text', image: null },
                                { text: opts[1], type: 'text', image: null },
                                { text: opts[2], type: 'text', image: null },
                                { text: opts[3], type: 'text', image: null }
                            ],
                            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
                            category: '',
                            questionType: 'text',
                            optionType: 'text',
                            questionImage: null,
                            optionImages: [null, null, null, null]
                        };
                    });

                    setQuestions((prevQuestions) => {
                        const hasEmptyQuestion = prevQuestions.length === 1 &&
                            prevQuestions[0].question === '' &&
                            prevQuestions[0].questionImage === null &&
                            prevQuestions[0].options.every(opt => opt.text === '' && opt.image === null) &&
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
                const opts = item.options || ['', '', '', ''];
                return {
                    id: Date.now() + index,
                    question: item.question,
                    options: [
                        { text: opts[0], type: 'text', image: null },
                        { text: opts[1], type: 'text', image: null },
                        { text: opts[2], type: 'text', image: null },
                        { text: opts[3], type: 'text', image: null }
                    ],
                    correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
                    category: '',
                    questionType: 'text',
                    optionType: 'text',
                    questionImage: null,
                    optionImages: [null, null, null, null]
                };
            });

            setQuestions((prevQuestions) => {
                const hasEmptyQuestion = prevQuestions.length === 1 &&
                    prevQuestions[0].question === '' &&
                    prevQuestions[0].questionImage === null &&
                    prevQuestions[0].options.every(opt => opt.text === '' && opt.image === null) &&
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

        const validQuestions = questions.filter((q) => {
            const questionInputMode = q.questionInputMode || 'text';
            const optionsInputMode = q.optionsInputMode || 'text';

            let hasQuestion = false;
            if (questionInputMode === 'text') {
                hasQuestion = q.question && q.question.trim() !== '';
            } else if (questionInputMode === 'image') {
                hasQuestion = q.questionImage !== null;
            } else if (questionInputMode === 'both') {
                hasQuestion = (q.question && q.question.trim() !== '') || q.questionImage !== null;
            }

            const hasOptions = q.options.every((opt) => {
                if (optionsInputMode === 'text') {
                    return opt.text && opt.text.trim() !== '';
                } else if (optionsInputMode === 'image') {
                    return opt.image !== null;
                } else if (optionsInputMode === 'both') {
                    return (opt.text && opt.text.trim() !== '') || opt.image !== null;
                }
                return false;
            });

            const hasCorrectAnswer = q.correctAnswer !== null;
            return hasQuestion && hasOptions && hasCorrectAnswer;
        });

        const invalidQuestions = questions.filter((q) => {
            const questionInputMode = q.questionInputMode || 'text';
            const optionsInputMode = q.optionsInputMode || 'text';

            let hasQuestion = false;
            if (questionInputMode === 'text') {
                hasQuestion = q.question && q.question.trim() !== '';
            } else if (questionInputMode === 'image') {
                hasQuestion = q.questionImage !== null;
            } else if (questionInputMode === 'both') {
                hasQuestion = (q.question && q.question.trim() !== '') || q.questionImage !== null;
            }

            const hasOptions = q.options.every((opt) => {
                if (optionsInputMode === 'text') {
                    return opt.text && opt.text.trim() !== '';
                } else if (optionsInputMode === 'image') {
                    return opt.image !== null;
                } else if (optionsInputMode === 'both') {
                    return (opt.text && opt.text.trim() !== '') || opt.image !== null;
                }
                return false;
            });

            const hasCorrectAnswer = q.correctAnswer !== null;
            return !hasQuestion || !hasOptions || !hasCorrectAnswer;
        });

        if (invalidQuestions.length > 0) {
            toast.error('All questions must have complete question content, all 4 options, and a correct answer selected');
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
            const validQuestions = questions.filter((q) => {
                const questionInputMode = q.questionInputMode || 'text';
                const optionsInputMode = q.optionsInputMode || 'text';
    
                let hasQuestion = false;
                if (questionInputMode === 'text') {
                    hasQuestion = q.question && q.question.trim() !== '';
                } else if (questionInputMode === 'image') {
                    hasQuestion = q.questionImage !== null;
                } else if (questionInputMode === 'both') {
                    hasQuestion = (q.question && q.question.trim() !== '') || q.questionImage !== null;
                }
    
                const hasOptions = q.options.every((opt) => {
                    if (optionsInputMode === 'text') {
                        return opt.text && opt.text.trim() !== '';
                    } else if (optionsInputMode === 'image') {
                        return opt.image !== null;
                    } else if (optionsInputMode === 'both') {
                        return (opt.text && opt.text.trim() !== '') || opt.image !== null;
                    }
                    return false;
                });
    
                const hasCorrectAnswer = q.correctAnswer !== null;
                return hasQuestion && hasOptions && hasCorrectAnswer;
            });
    
            const questionList = validQuestions.map((q) => {
                const questionObj = {};
                const questionInputMode = q.questionInputMode || 'text';
                const optionsInputMode = q.optionsInputMode || 'text';
    
                if (questionInputMode === 'text') {
                    questionObj.question = q.question.trim();
                } else if (questionInputMode === 'image') {
                    questionObj.questionImage = q.questionImage;
                } else if (questionInputMode === 'both') {
                    if (q.question && q.question.trim() !== '') {
                        questionObj.question = q.question.trim();
                    }
                    if (q.questionImage) {
                        questionObj.questionImage = q.questionImage;
                    }
                }
    
                if (optionsInputMode === 'text') {
                    questionObj.options = q.options.map((opt) => opt.text.trim());
                    questionObj.correctAnswer = q.options[q.correctAnswer].text.trim();
                } else if (optionsInputMode === 'image') {
                    questionObj.optionsImage = q.options.map((opt) => opt.image);
                    questionObj.correctAnswer = String(q.correctAnswer + 1);
                } else if (optionsInputMode === 'both') {
                    const hasTextOptions = q.options.some(opt => opt.text && opt.text.trim() !== '');
                    const hasImageOptions = q.options.some(opt => opt.image !== null);
    
                    if (hasTextOptions) {
                        questionObj.options = q.options.map((opt) => opt.text.trim());
                    }
                    if (hasImageOptions) {
                        questionObj.optionsImage = q.options.map((opt) => opt.image);
                    }
    
                    const correctOpt = q.options[q.correctAnswer];
                    if (correctOpt.text && correctOpt.text.trim() !== '') {
                        questionObj.correctAnswer = correctOpt.text.trim();
                    } else {
                        questionObj.correctAnswer = String(q.correctAnswer + 1);
                    }
                }
    
                if (q.category && q.category.trim() !== '') {
                    questionObj.category = q.category.trim();
                }
    
                return questionObj;
            });
    
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
                examDuration: '',
                isActive: true
            });
            setBatchSearchTerm('');
            setQuestions([{
                id: 1,
                question: '',
                options: [
                    { text: '', type: 'text', image: null },
                    { text: '', type: 'text', image: null },
                    { text: '', type: 'text', image: null },
                    { text: '', type: 'text', image: null }
                ],
                correctAnswer: null,
                category: '',
                questionType: 'text',
                optionType: 'text',
                questionImage: null,
                optionImages: [null, null, null, null]
            }]);
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

    const groupedQuestions = useMemo(() => {
        const groups = {};
        questions.forEach(q => {
            const category = q.category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(q);
        });
        return groups;
    }, [questions]);
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
                            <div className="relative" ref={batchDropdownRef}>
                                <input
                                    type="text"
                                    placeholder="Search Batch"
                                    value={batchSearchTerm}
                                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                                    onFocus={() => setBatchDropdownOpen(true)}
                                    disabled={isLoadingBatches}
                                    className="w-full !px-4 !py-3 pr-10 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                                {batchDropdownOpen && (
                                    <div className="absolute w-full !mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                        {isLoadingBatches ? (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                Loading batches...
                                            </div>
                                        ) : filteredBatches.length > 0 ? (
                                            filteredBatches.map((batch) => (
                                                <div
                                                    key={batch.id}
                                                    onClick={() => handleBatchSelect(batch)}
                                                    className="!px-4 !py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-medium text-gray-900">{batch.name}</div>
                                                    <div className="text-sm text-gray-500">{batch.description}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="!px-4 !py-3 text-sm text-gray-500 text-center">
                                                No batches found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                <span className="text-xs text-gray-400 !ml-2">(Can only be toggled if start date is more than 24 hours from now)</span>)}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 !mt-8 flex-wrap">
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

                    {showQuestions && questions.length > 0 && (
                        <div className="flex justify-center gap-4 !mt-6">
                            <button
                                onClick={addNewSection}
                                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white !px-8 !py-3 rounded-full font-medium hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                            >
                                Create New Category
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {showQuestions && (
                    <div className="!mb-6">
                        {Object.keys(groupedQuestions).sort().map((category) => (
                            <CategoryAccordion
                                key={category}
                                category={category}
                                questions={groupedQuestions[category]}
                                onQuestionChange={handleQuestionChange}
                                onOptionChange={handleOptionChange}
                                onCorrectAnswerChange={handleCorrectAnswerChange}
                                onDeleteQuestion={deleteQuestion}
                                onCategoryChange={handleCategoryChange}
                                onQuestionTypeChange={handleQuestionTypeChange}
                                onOptionTypeChange={handleOptionTypeChange}
                                onImageUpload={handleImageUpload}
                                onMoveQuestion={handleMoveQuestion}
                                onAddQuestion={addQuestionToCategory}
                            />
                        ))}
                    </div>
                )}

                <div className="flex flex-col items-center gap-4">
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