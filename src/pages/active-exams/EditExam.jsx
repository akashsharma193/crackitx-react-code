import React, { useState, useCallback } from 'react';
import { ArrowLeft, Download, Eye, ChevronDown, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponenet';

const EditExamDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
        <div className="text-center">
          <h2 className="text-green-600 text-xl font-bold !mb-3">Edit Exam?</h2>
          <p className="text-gray-800 !mb-2">Are you sure you want to edit this exam?</p>
          <p className="text-sm text-green-500 font-medium !mb-6">
            <span className="text-black font-semibold">Note:</span> You can go to Active Exams to edit the test.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="border border-[#7966F1] text-[#7966F1] font-semibold !px-6 !py-2 rounded-md hover:bg-[#f5f3ff] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-6 !py-2 rounded-md hover:opacity-90 transition cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home', { state: { activeTab: 'Active Exam' } });
  };

  const [formData, setFormData] = useState({
    subjectName: 'xyz@gmail.com',
    teacherName: 'Contentive',
    organizationCode: 'Contentive',
    batch: 'Contentive',
    startTime: '',
    endTime: '',
    examDuration: '30 mins'
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDatePickerData, setStartDatePickerData] = useState({
    selectedYear: 2024,
    selectedMonth: 4, // May (0-indexed)
    selectedDate: null
  });
  const [endDatePickerData, setEndDatePickerData] = useState({
    selectedYear: 2024,
    selectedMonth: 4, // May (0-indexed)
    selectedDate: null
  });
  const [showDialog, setShowDialog] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: null
    }
  ]);

  const durationOptions = ['5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 10 }, (_, i) => 2021 + i);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
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

  const handleSubmit = useCallback(() => {
    setShowDialog(true);
  }, []);

  const handleCreate = useCallback(() => {
    const examData = {
      ...formData,
      questions: questions.filter(q => q.question.trim() !== '')
    };
    console.log('Exam Data:', examData);
  }, [formData, questions]);

  const handleDateSelect = (date, isStartDate) => {
    const pickerData = isStartDate ? startDatePickerData : endDatePickerData;
    const monthName = months[pickerData.selectedMonth];
    const formattedDate = `${date} ${monthName} ${pickerData.selectedYear}`;

    if (isStartDate) {
      setFormData(prev => ({ ...prev, startTime: formattedDate }));
      setShowStartDatePicker(false);
    } else {
      setFormData(prev => ({ ...prev, endTime: formattedDate }));
      setShowEndDatePicker(false);
    }
  };

  const DatePicker = ({ isStartDate, pickerData, setPickerData, onDateSelect }) => {
    const daysInMonth = getDaysInMonth(pickerData.selectedYear, pickerData.selectedMonth);
    const firstDay = getFirstDayOfMonth(pickerData.selectedYear, pickerData.selectedMonth);
    const prevMonthDays = pickerData.selectedMonth === 0 ?
      getDaysInMonth(pickerData.selectedYear - 1, 11) :
      getDaysInMonth(pickerData.selectedYear, pickerData.selectedMonth - 1);

    const calendarDays = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isNextMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: true,
        isNextMonth: false
      });
    }

    // Next month days
    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }

    const navigateMonth = (direction) => {
      setPickerData(prev => {
        if (direction === 'prev') {
          if (prev.selectedMonth === 0) {
            return { ...prev, selectedMonth: 11, selectedYear: prev.selectedYear - 1 };
          } else {
            return { ...prev, selectedMonth: prev.selectedMonth - 1 };
          }
        } else {
          if (prev.selectedMonth === 11) {
            return { ...prev, selectedMonth: 0, selectedYear: prev.selectedYear + 1 };
          } else {
            return { ...prev, selectedMonth: prev.selectedMonth + 1 };
          }
        }
      });
    };

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 w-80 !px-4 !py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {months[pickerData.selectedMonth]} {pickerData.selectedYear}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Year and Month Selectors */}
        <div className="flex gap-2 mb-4">
          <select
            value={pickerData.selectedYear}
            onChange={(e) => setPickerData(prev => ({ ...prev, selectedYear: parseInt(e.target.value) }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={pickerData.selectedMonth}
            onChange={(e) => setPickerData(prev => ({ ...prev, selectedMonth: parseInt(e.target.value) }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] text-sm"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayObj, index) => (
            <button
              key={index}
              onClick={() => dayObj.isCurrentMonth && onDateSelect(dayObj.day, isStartDate)}
              className={`p-2 text-sm rounded-lg transition-colors
                                  ${dayObj.isCurrentMonth
                  ? 'text-gray-900 hover:bg-[#5E48EF] hover:text-white cursor-pointer'
                  : 'text-gray-300 cursor-not-allowed'
                }
                              `}
            >
              {dayObj.day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const QuestionCard = ({ question, questionIndex }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
      <div className="flex items-center justify-between !mb-4">
        <h3 className="text-[#5E48EF] text-lg font-medium">
          Question {questionIndex + 1}
        </h3>
        <button
          onClick={() => deleteQuestion(question.id)}
          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          aria-label="Delete question"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="!mb-6">
        <textarea
          value={question.question}
          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
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
                onClick={() => handleCorrectAnswerChange(question.id, index)}
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
                onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                className="flex-1 !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-1 overflow-hidden">
        <SidebarComponent activeTab="Active Exam" setActiveTab={() => { }} />

        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white bg-[#7966F1] !px-6 !py-5">
            <div className="flex items-center gap-3">
              <ArrowLeft className="cursor-pointer" size={20} onClick={handleBack} />
              <h2 className="text-lg font-semibold">Edit Exam</h2>
            </div>
            <div className="flex items-center gap-5">
              <Download className="w-5 h-5 text-white cursor-pointer" />
              <button className="bg-[#7966F1] border border-white text-white !px-4 !py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all cursor-pointer">
                Sample Excel
              </button>
            </div>
          </div>

          {/* Main Content Centered */}
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

                {/* Organization Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 !mb-2">
                    Organization Code
                  </label>
                  <input
                    type="text"
                    value={formData.organizationCode}
                    onChange={(e) => handleInputChange('organizationCode', e.target.value)}
                    className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5"
                    placeholder="Organization Code"
                  />
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

                {/* Start Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 !mb-2">
                    Start Date
                  </label>
                  <button
                    onClick={() => {
                      setShowStartDatePicker(!showStartDatePicker);
                      setShowEndDatePicker(false);
                    }}
                    className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 text-left"
                  >
                    {formData.startTime || "Select Start Date"}
                  </button>
                  {showStartDatePicker && (
                    <DatePicker
                      isStartDate={true}
                      pickerData={startDatePickerData}
                      setPickerData={setStartDatePickerData}
                      onDateSelect={handleDateSelect}
                    />
                  )}
                </div>

                {/* End Date */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 !mb-2">
                    End Date
                  </label>
                  <button
                    onClick={() => {
                      setShowEndDatePicker(!showEndDatePicker);
                      setShowStartDatePicker(false);
                    }}
                    className="w-full !px-4 !py-3 border border-[#5E48EF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E48EF] focus:border-transparent bg-[#5E48EF]/5 text-left"
                  >
                    {formData.endTime || "Select End Date"}
                  </button>
                  {showEndDatePicker && (
                    <DatePicker
                      isStartDate={false}
                      pickerData={endDatePickerData}
                      setPickerData={setEndDatePickerData}
                      onDateSelect={handleDateSelect}
                    />
                  )}
                </div>
              </div>

              {/* Exam Duration */}
              <div className="!mt-6">
                <label className="block text-sm font-medium text-gray-600 !mb-2">
                  Exam Duration (minutes)
                </label>
                <div className="relative md:w-1/2">
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
                className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] text-white !px-12 !py-3 rounded-full font-medium hover:from-[#9181F4] hover:to-[#5038ED] transition-all shadow-lg cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <EditExamDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={handleCreate}
        />
      )}
    </div>
  );
};

export default EditExam;
