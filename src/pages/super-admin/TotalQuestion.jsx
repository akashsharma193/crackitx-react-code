import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "../../api/axiosConfig";

const PAGE_SIZE = 10;
const MAX_PAGE_BUTTONS = 5;

const TotalQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchQuestions = async (page = 0) => {
    try {
      const payload = {
        pageSize: PAGE_SIZE,
        pageNumber: page,
        filter: searchTerm ? { subject: searchTerm.trim() } : {},
      };

      const res = await apiClient.post(
        "/questionGenerator/getQuestionList",
        payload,
      );

      if (res.data?.success) {
        const { content, page: pageInfo } = res.data.data;
        setQuestions(content || []);
        setTotalPages(pageInfo.totalPages);
        setTotalElements(pageInfo.totalElements);
        setCurrentPage(pageInfo.number);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions(0);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      fetchQuestions(page);
    }
  };

  /* ---------- PAGINATION BUTTONS ---------- */
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= MAX_PAGE_BUTTONS) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (start === 0) end = MAX_PAGE_BUTTONS - 1;
      if (end === totalPages - 1) start = totalPages - MAX_PAGE_BUTTONS;

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const startIndex = totalElements ? currentPage * PAGE_SIZE + 1 : 0;
  const endIndex = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* SEARCH */}
      <div className="bg-[#7966F1] !px-6 !py-4">
        <div className="relative w-[30%]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full !pl-10 !py-2 rounded-md bg-white outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="!p-6">
        <table className="w-full table-fixed border border-gray-400 border-collapse bg-white text-sm">
          <thead className="border-b-2 border-gray-400 font-bold">
            <tr>
              <th className="w-[80px] border border-gray-400 !px-3 !py-3">
                SR. NO
              </th>
              <th className="w-[55%] border border-gray-400 !px-4 !py-3">
                Question
              </th>
              <th className="w-[12%] border border-gray-400 !px-3 !py-3">
                Subject
              </th>
              <th className="w-[12%] border border-gray-400 !px-3 !py-3">
                Topic
              </th>
              <th className="w-[8%] border border-gray-400 !px-3 !py-3">
                Level
              </th>
              <th className="w-[7%] border border-gray-400 !px-3 !py-3">
                Lang
              </th>
            </tr>
          </thead>

          <tbody>
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <tr key={q.id || index} className="hover:bg-gray-50 align-top">
                  <td className="border border-gray-400 !px-3 !py-3">
                    {currentPage * PAGE_SIZE + index + 1}
                  </td>

                  {/* QUESTION (TEXT + IMAGE) */}
                  <td className="border border-gray-400 !px-4 !py-3">
                    <div className="space-y-3">
                      {q.question && (
                        <div className="max-h-[120px] overflow-y-auto leading-relaxed break-words">
                          {q.question}
                        </div>
                      )}

                      {q.questionImage && (
                        <img
                          src={q.questionImage}
                          alt="Question"
                          className="max-w-full max-h-[200px] border rounded object-contain"
                        />
                      )}
                    </div>
                  </td>

                  <td className="border border-gray-400 !px-3 !py-3 truncate">
                    {q.subject}
                  </td>

                  <td className="border border-gray-400 !px-3 !py-3 truncate">
                    {q.topic}
                  </td>

                  <td className="border border-gray-400 !px-3 !py-3">
                    <span
                      className={`text-xs font-semibold !px-2 !py-1 rounded ${
                        q.criticality === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : q.criticality === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {q.criticality}
                    </span>
                  </td>

                  <td className="border border-gray-400 !px-3 !py-3">
                    {q.language}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center !py-8 text-gray-500 border border-gray-400"
                >
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalElements > 0 && (
          <div className="flex items-center justify-between !mt-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex} to {endIndex} of {totalElements}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                className="!px-3 !py-2 border border-[#7966F1] rounded disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`!px-3 !py-2 rounded text-sm font-medium ${
                    page === currentPage
                      ? "bg-[#7966F1] text-white"
                      : "border border-[#7966F1] text-[#7966F1] hover:bg-[#7966F1] hover:text-white"
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                className="!px-3 !py-2 border border-[#7966F1] rounded disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalQuestion;
