import React, { useState, useCallback } from 'react';
import { Search, Trophy, Medal, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import apiClient from '../../api/axiosConfig';

const CircularLoader = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#7966F1] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#7966F1] text-lg font-semibold">
                    Loading Rankings...
                </div>
            </div>
        </div>
    );
};

const Ranking = () => {
    const [batchCode, setBatchCode] = useState('');
    const [questionId, setQuestionId] = useState('');
    const [rankingData, setRankingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-500" size={24} />;
            case 2:
                return <Medal className="text-gray-400" size={24} />;
            case 3:
                return <Award className="text-amber-600" size={24} />;
            default:
                return null;
        }
    };

    const getRankBadgeColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
            case 2:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
            case 3:
                return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
            default:
                return 'bg-[#7966F1] text-white';
        }
    };

    const fetchRankings = useCallback(async () => {
        if (!batchCode.trim()) {
            toast.error('Batch Code is required');
            return;
        }

        try {
            setLoading(true);
            setHasSearched(true);

            const requestBody = {
                id: batchCode.trim(),
                ...(questionId.trim() && { questionId: questionId.trim() })
            };

            console.log('Fetching rankings with body:', requestBody);

            const response = await apiClient.post('/report/student/reportCard', requestBody);

            if (response.data.success && response.data.data) {
                const sortedData = response.data.data
                    .map((student, index) => ({
                        ...student,
                        rank: student.ranking || index + 1,
                        percentage: ((student.marks / student.totalMarks) * 100).toFixed(2)
                    }))
                    .sort((a, b) => b.marks - a.marks);

                setRankingData(sortedData);

                if (sortedData.length === 0) {
                    toast.info('No ranking data found for the given criteria');
                }
            } else {
                throw new Error(response.data.message || 'Failed to fetch ranking data');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch ranking data';
            console.error('Error fetching rankings:', err);
            toast.error(errorMessage);
            setRankingData([]);
        } finally {
            setLoading(false);
        }
    }, [batchCode, questionId]);

    const handleSearchClick = useCallback(() => {
        fetchRankings();
    }, [fetchRankings]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            fetchRankings();
        }
    }, [fetchRankings]);

    return (
        <div className="h-full flex flex-col">
            <div className="bg-[#7966F1] flex flex-wrap items-center justify-between !px-6 !py-4.5 flex-shrink-0">
                <div className="flex items-center gap-4 flex-wrap w-full">
                    <div className="relative min-w-[280px]">
                        <input
                            type="text"
                            placeholder="Batch Code (Required)"
                            value={batchCode}
                            onChange={(e) => setBatchCode(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="!pl-4 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    <div className="relative min-w-[280px]">
                        <input
                            type="text"
                            placeholder="Question ID (Optional)"
                            value={questionId}
                            onChange={(e) => setQuestionId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="!pl-4 !pr-4 !py-2 rounded-md bg-white text-gray-600 placeholder:text-gray-400 border-none outline-none w-full"
                        />
                    </div>

                    <button
                        onClick={handleSearchClick}
                        className="bg-white text-[#7966F1] font-semibold !px-6 !py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <Search size={18} />
                        Search Rankings
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto !p-8">
                {loading && <CircularLoader />}

                {!loading && hasSearched && rankingData.length === 0 && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500 text-lg">No ranking data found</div>
                    </div>
                )}

                {!loading && rankingData.length > 0 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md !p-6 border border-[#7966F1]">
                            <h2 className="text-2xl font-bold text-[#7966F1] flex items-center gap-2">
                                <Trophy className="text-[#7966F1]" size={28} />
                                Leaderboard Rankings
                            </h2>
                            <div className="text-gray-600 mb-4">
                                Total Students: <span className="font-semibold text-[#7966F1]">{rankingData.length}</span>
                                {questionId && (
                                    <span className="ml-4">
                                        Question ID: <span className="font-semibold text-[#7966F1]">{questionId}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#7966F1] !mt-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-[#7966F1] text-white font-bold">
                                        <tr>
                                            <th className="!px-6 !py-4 text-center">Rank</th>
                                            <th className="!px-6 !py-4">Student Name</th>
                                            <th className="!px-6 !py-4">Email</th>
                                            <th className="!px-6 !py-4 text-center">Marks Obtained</th>
                                            <th className="!px-6 !py-4 text-center">Total Marks</th>
                                            <th className="!px-6 !py-4 text-center">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingData.map((student, index) => (
                                            <tr 
                                                key={student.userId} 
                                                className={`border-t transition-all ${
                                                    index < 3 ? 'bg-gradient-to-r from-purple-50 to-white hover:from-purple-100 hover:to-white' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className="!px-6 !py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getRankIcon(student.rank)}
                                                        <span className={`font-bold text-lg !px-3 !py-1 rounded-full ${getRankBadgeColor(student.rank)}`}>
                                                            #{student.rank}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-4 font-semibold text-gray-800">
                                                    {student.name}
                                                </td>
                                                <td className="!px-6 !py-4 text-gray-600">
                                                    {student.email}
                                                </td>
                                                <td className="!px-6 !py-4 text-center">
                                                    <span className="font-bold text-[#7966F1] text-lg">
                                                        {student.marks}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-4 text-center text-gray-600">
                                                    {student.totalMarks}
                                                </td>
                                                <td className="!px-6 !py-4 text-center">
                                                    <span className={`font-semibold !px-3 !py-1 rounded-full ${
                                                        parseFloat(student.percentage) >= 75 
                                                            ? 'bg-green-100 text-green-700'
                                                            : parseFloat(student.percentage) >= 50
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {student.percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !hasSearched && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Trophy size={64} className="mb-4 opacity-50" />
                        <p className="text-lg">Enter Batch Code and click Search to view rankings</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ranking;