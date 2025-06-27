import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, X, Download } from 'lucide-react';
import apiClient from '../../api/axiosConfig';

const DeleteExamDialog = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl !px-6 !py-8 max-w-md w-full mx-4 border border-gray-200">
                <div className="text-center">
                    <h2 className="text-red-600 text-xl font-bold !mb-3">Alert !</h2>
                    <p className="text-gray-800 !mb-2">Do you want to delete the test?</p>
                    <p className="text-sm text-red-500 font-medium !mb-6">
                        <span className="text-black font-semibold">Note:</span> Test once deleted cannot be restored.
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
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActiveExams = () => {
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [examToDelete, setExamToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    // Fetch data from API
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await apiClient.get('/answerPaper/getAllTest');

                if (response.data.success && response.data.data) {
                    // Transform API data to match the component's expected format
                    const transformedData = response.data.data.map((item, index) => ({
                        srNo: index + 1,
                        testName: item.subjectName || 'N/A',
                        conductedBy: item.teacherName || 'N/A',
                        startTime: item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A',
                        endTime: item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A',
                        isVisible: true, // Default visibility
                        questionId: item.questionId,
                        orgCode: item.orgCode,
                        batch: item.batch,
                        userId: item.userId
                    }));

                    setExamData(transformedData);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch exam data');
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch exam data');
                console.error('Error fetching exam data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, []);

    const handleViewClick = (examId) => {
        // Navigate to edit exam page - replace with your routing logic
        console.log('Navigate to edit exam:', examId);
    };

    const handleToggleVisibility = (index) => {
        setExamData(prevData =>
            prevData.map((exam, i) =>
                i === index ? { ...exam, isVisible: !exam.isVisible } : exam
            )
        );
    };

    const handleDeleteClick = (examId) => {
        setExamToDelete(examId);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = () => {
        setExamData(prevData => prevData.filter(exam => exam.srNo !== examToDelete));
        setShowDeleteDialog(false);
        setExamToDelete(null);
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setExamToDelete(null);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterTerm('');
    };

    // Filter data based on search and filter terms
    const filteredExamData = examData.filter(exam => {
        const matchesSearch = searchTerm === '' ||
            exam.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.conductedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterTerm === '' ||
            exam.testName.toLowerCase().includes(filterTerm.toLowerCase()) ||
            exam.conductedBy.toLowerCase().includes(filterTerm.toLowerCase());

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex-1 !py-0 overflow-y-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-[#7966F1] text-lg">Loading exams...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 !py-0 overflow-y-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-500 text-lg">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 !py-0 overflow-y-auto">
            {/* Header */}
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search */}
                    <div className="relative min-w-[320px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative min-w-[100px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter"
                            value={filterTerm}
                            onChange={(e) => setFilterTerm(e.target.value)}
                            className="!pl-10 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    {/* Clear Button */}
                    <button
                        onClick={handleClear}
                        className="bg-white text-gray-500 font-semibold !px-4 !py-2 rounded-md flex items-center gap-2"
                    >
                        <X size={16} className="text-gray-500" />
                        Clear
                    </button>
                </div>

                {/* Download Button */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button className="text-white hover:text-[#7966F1] bg-white/10 hover:bg-white !p-2 rounded-full transition">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-[#7966F1] !m-8">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-white text-[#7966F1] font-bold border-b">
                        <tr>
                            <th className="!px-6 !py-4">Sr.no.</th>
                            <th className="!px-6 !py-4">Test Name</th>
                            <th className="!px-6 !py-4">Test Conducted By</th>
                            <th className="!px-6 !py-4">Start Time</th>
                            <th className="!px-6 !py-4">End Time</th>
                            <th className="!px-6 !py-4">Test Visibility</th>
                            <th className="!px-6 !py-4">View</th>
                            <th className="!px-6 !py-4">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExamData.length > 0 ? (
                            filteredExamData.map((exam, index) => (
                                <tr key={exam.questionId || index} className="border-t hover:bg-gray-50">
                                    <td className="!px-6 !py-4">{exam.srNo}</td>
                                    <td className="!px-6 !py-4">{exam.testName}</td>
                                    <td className="!px-6 !py-4">{exam.conductedBy}</td>
                                    <td className="!px-6 !py-4">{exam.startTime}</td>
                                    <td className="!px-6 !py-4">{exam.endTime}</td>
                                    <td className="!px-6 !py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={exam.isVisible}
                                                onChange={() => handleToggleVisibility(index)}
                                            />
                                            <div className={`relative w-11 h-6 rounded-full peer transition-colors duration-200 ease-in-out ${exam.isVisible ? 'bg-[#7966F1]' : 'bg-gray-200'
                                                }`}>
                                                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${exam.isVisible ? 'translate-x-5' : 'translate-x-0'
                                                    }`} />
                                            </div>
                                        </label>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <Eye className="text-[#7966F1] cursor-pointer" size={20} onClick={() => handleViewClick(exam.srNo)} />
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <Trash2 className="text-[#ef4444] cursor-pointer" size={20} onClick={() => handleDeleteClick(exam.srNo)} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="!px-6 !py-8 text-center text-gray-500">
                                    {examData.length === 0 ? 'No exams found' : 'No exams match your search criteria'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Exam Dialog */}
            <DeleteExamDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default ActiveExams;