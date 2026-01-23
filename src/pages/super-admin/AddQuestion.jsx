import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ImageIcon, Type } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const AddQuestion = () => {
    const [formData, setFormData] = useState({
        question: '',
        correctAnswer: null,
        color: '#7966F1',
        subject: '',
        topic: '',
        criticality: 'HIGH',
        language: 'English'
    });
    const [options, setOptions] = useState(['', '', '', '']);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [questionInputMode, setQuestionInputMode] = useState('text');
    const [optionsInputMode, setOptionsInputMode] = useState('text');
    const [questionImage, setQuestionImage] = useState(null);
    const [optionImages, setOptionImages] = useState([null, null, null, null]);
    
    const questionImageRef = useRef(null);
    const optionImageRefs = useRef([]);

    useEffect(() => {
        fetchSubjects();
        fetchTopics();
    }, []);

    const fetchSubjects = async () => {
        setIsLoadingSubjects(true);
        try {
            const response = await apiClient.post('/subject/getAll', {
                pageSize: 100,
                pageNumber: 0,
                filter: {}
            });
            if (response.data && response.data.content) {
                setSubjects(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to load subjects';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('Failed to load subjects');
            }
        } finally {
            setIsLoadingSubjects(false);
        }
    };

    const fetchTopics = async () => {
        setIsLoadingTopics(true);
        try {
            const response = await apiClient.post('/topic/getAll', {
                pageSize: 100,
                pageNumber: 0,
                filter: {}
            });
            if (response.data && response.data.content) {
                setTopics(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to load topics';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('Failed to load topics');
            }
        } finally {
            setIsLoadingTopics(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        if (errors.options) {
            setErrors(prev => ({ ...prev, options: '' }));
        }
    };

    const handleCorrectAnswerChange = (index) => {
        setFormData(prev => ({ ...prev, correctAnswer: index }));
        if (errors.correctAnswer) {
            setErrors(prev => ({ ...prev, correctAnswer: '' }));
        }
    };

    const handleQuestionImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setQuestionImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOptionImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...optionImages];
                newImages[index] = reader.result;
                setOptionImages(newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuestionInputModeChange = (mode) => {
        setQuestionInputMode(mode);
        if (mode === 'text') {
            setQuestionImage(null);
        } else if (mode === 'image') {
            setFormData(prev => ({ ...prev, question: '' }));
        }
    };

    const handleOptionsInputModeChange = (mode) => {
        setOptionsInputMode(mode);
        if (mode === 'text') {
            setOptionImages([null, null, null, null]);
        } else if (mode === 'image') {
            setOptions(['', '', '', '']);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (questionInputMode === 'text' && !formData.question.trim()) {
            newErrors.question = 'Question text is required';
        }
        if (questionInputMode === 'image' && !questionImage) {
            newErrors.question = 'Question image is required';
        }
        if (questionInputMode === 'both' && !formData.question.trim() && !questionImage) {
            newErrors.question = 'Either question text or image is required';
        }

        if (optionsInputMode === 'text') {
            if (options.some(opt => !opt.trim())) {
                newErrors.options = 'All 4 options are required';
            }
        }
        if (optionsInputMode === 'image') {
            if (optionImages.some(img => !img)) {
                newErrors.options = 'All 4 option images are required';
            }
        }
        if (optionsInputMode === 'both') {
            const hasTextOptions = options.some(opt => opt.trim());
            const hasImageOptions = optionImages.some(img => img);
            if (!hasTextOptions && !hasImageOptions) {
                newErrors.options = 'At least text or images for all options are required';
            }
        }

        if (formData.correctAnswer === null) {
            newErrors.correctAnswer = 'Please select the correct answer';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.topic.trim()) {
            newErrors.topic = 'Topic is required';
        }

        if (!formData.language.trim()) {
            newErrors.language = 'Language is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const questionData = {
                // id: '',
                question: questionInputMode === 'text' || questionInputMode === 'both' ? formData.question : '',
                isImage: questionInputMode === 'image',
                color: formData.color,
                subject: formData.subject,
                topic: formData.topic,
                criticality: formData.criticality,
                language: formData.language
            };

            if (questionInputMode === 'image' || questionInputMode === 'both') {
                if (questionImage) {
                    questionData.questionImage = questionImage;
                }
            }

            if (optionsInputMode === 'text' || optionsInputMode === 'both') {
                questionData.options = options;
                questionData.correctAnswer = options[formData.correctAnswer];
            }

            if (optionsInputMode === 'image') {
                questionData.optionsImage = optionImages;
                questionData.correctAnswer = String(formData.correctAnswer + 1);
            }

            if (optionsInputMode === 'both') {
                const validImages = optionImages.filter(img => img !== null);
                if (validImages.length > 0) {
                    questionData.optionsImage = optionImages;
                }
                const correctOpt = options[formData.correctAnswer];
                if (correctOpt && correctOpt.trim() !== '') {
                    questionData.correctAnswer = correctOpt.trim();
                } else {
                    questionData.correctAnswer = String(formData.correctAnswer + 1);
                }
            }

            const response = await apiClient.post('/questionGenerator/createQuestionList', [questionData]);

            if (response.status === 200 || response.status === 201) {
                toast.success('Question added successfully!');
                setFormData({
                    question: '',
                    correctAnswer: null,
                    color: '#7966F1',
                    subject: '',
                    topic: '',
                    criticality: 'HIGH',
                    language: 'English'
                });
                setOptions(['', '', '', '']);
                setQuestionImage(null);
                setOptionImages([null, null, null, null]);
                setQuestionInputMode('text');
                setOptionsInputMode('text');
                setErrors({});
            }
        } catch (error) {
            console.error('Error adding question:', error);

            if (error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || errorData?.detail || 'Failed to add question';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('Network error. Please check your connection and try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const criticalityOptions = ['LOW', 'MEDIUM', 'HIGH'];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-4">
                <h1 className="text-white text-xl font-medium">Add Question</h1>
            </div>

            <div className="!p-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                disabled={isLoadingSubjects}
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'}`}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subject && <p className="text-red-500 text-xs !mt-1">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Topic <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.topic}
                                onChange={(e) => handleInputChange('topic', e.target.value)}
                                disabled={isLoadingTopics}
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.topic ? 'border-red-500 focus:ring-red-500' : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'}`}
                            >
                                <option value="">Select Topic</option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.name}>
                                        {topic.name}
                                    </option>
                                ))}
                            </select>
                            {errors.topic && <p className="text-red-500 text-xs !mt-1">{errors.topic}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Criticality <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.criticality}
                                onChange={(e) => handleInputChange('criticality', e.target.value)}
                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] bg-[#5E48EF]/5"
                            >
                                {criticalityOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Language <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${errors.language ? 'border-red-500 focus:ring-red-500' : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'}`}
                                placeholder="Enter language"
                            />
                            {errors.language && <p className="text-red-500 text-xs !mt-1">{errors.language}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 !mb-2">
                                Color <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => handleInputChange('color', e.target.value)}
                                    className="w-16 h-12 border border-[#5E48EF] rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => handleInputChange('color', e.target.value)}
                                    className="flex-1 !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] bg-[#5E48EF]/5"
                                    placeholder="#7966F1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="!mb-6">
                        <div className="flex items-center justify-between !mb-2">
                            <label className="block text-sm font-medium text-gray-600">
                                Question Input Mode <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleQuestionInputModeChange('text')}
                                    className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${questionInputMode === 'text' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <Type className="w-4 h-4" />
                                    Text Only
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuestionInputModeChange('image')}
                                    className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${questionInputMode === 'image' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Image Only
                                </button>
                                <button
                                    type="button"
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
                                        value={formData.question}
                                        onChange={(e) => handleInputChange('question', e.target.value)}
                                        className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${errors.question ? 'border-red-500 focus:ring-red-500' : 'border-[#5E48EF] focus:ring-[#5E48EF] bg-[#5E48EF]/5'}`}
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
                                    {questionImage ? (
                                        <div className="relative">
                                            <img src={questionImage} alt="Question" className="w-full max-h-64 object-contain border border-[#5E48EF] rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => setQuestionImage(null)}
                                                className="absolute top-2 right-2 bg-red-500 text-white !p-2 rounded-full hover:bg-red-600 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => questionImageRef.current?.click()}
                                            className="w-full !px-4 !py-8 border-2 border-dashed border-[#5E48EF] rounded-lg hover:bg-[#5E48EF]/5 transition cursor-pointer flex flex-col items-center gap-2"
                                        >
                                            <ImageIcon className="w-8 h-8 text-[#5E48EF]" />
                                            <span className="text-sm text-gray-600">Click to upload question image</span>
                                        </button>
                                    )}
                                </div>
                            )}
                            {errors.question && <p className="text-red-500 text-xs !mt-1">{errors.question}</p>}
                        </div>
                    </div>

                    <div className="!mb-6">
                        <div className="flex items-center justify-between !mb-3">
                            <h4 className="text-sm font-medium text-gray-600">
                                Options Input Mode <span className="text-red-500">*</span>
                            </h4>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleOptionsInputModeChange('text')}
                                    className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${optionsInputMode === 'text' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <Type className="w-4 h-4" />
                                    Text Only
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOptionsInputModeChange('image')}
                                    className={`flex items-center gap-1 !px-3 !py-1 rounded-md text-sm transition cursor-pointer ${optionsInputMode === 'image' ? 'bg-[#5E48EF] text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Image Only
                                </button>
                                <button
                                    type="button"
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
                            {options.map((option, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleCorrectAnswerChange(index)}
                                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all cursor-pointer flex items-center justify-center !mt-3 ${formData.correctAnswer === index ? 'border-[#5E48EF] bg-[#5E48EF]' : 'border-[#5E48EF] bg-transparent'}`}
                                    >
                                        {formData.correctAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </button>

                                    <div className="flex-1 space-y-2">
                                        <span className="text-xs text-gray-500">Option {index + 1}</span>

                                        {(optionsInputMode === 'text' || optionsInputMode === 'both') && (
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] bg-[#5E48EF]/5"
                                                placeholder={`Option ${index + 1} text`}
                                            />
                                        )}

                                        {(optionsInputMode === 'image' || optionsInputMode === 'both') && (
                                            <div className="!mt-3">
                                                <input
                                                    type="file"
                                                    ref={(el) => (optionImageRefs.current[index] = el)}
                                                    onChange={(e) => handleOptionImageUpload(index, e)}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                {optionImages[index] ? (
                                                    <div className="relative">
                                                        <img src={optionImages[index]} alt={`Option ${index + 1}`} className="w-full max-h-32 object-contain border border-[#5E48EF] rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = [...optionImages];
                                                                newImages[index] = null;
                                                                setOptionImages(newImages);
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white !p-1 rounded-full hover:bg-red-600 cursor-pointer"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
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
                        {errors.options && <p className="text-red-500 text-xs !mt-1">{errors.options}</p>}
                        {errors.correctAnswer && <p className="text-red-500 text-xs !mt-1">{errors.correctAnswer}</p>}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-12 !py-3 rounded-full shadow-md transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {loading ? 'Adding...' : 'Add Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;