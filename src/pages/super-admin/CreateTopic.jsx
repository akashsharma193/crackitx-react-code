import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../api/axiosConfig";
import { Edit2, ChevronLeft, ChevronRight } from "lucide-react";

const CreateTopic = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingTopic, setEditingTopic] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchTopics();
  }, [pagination.pageNumber]);

  const fetchTopics = async () => {
    setIsLoadingTopics(true);
    try {
      const response = await apiClient.post("/topic/getAll", {
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
        filter: {},
      });

      const apiData = response.data?.data;

      if (apiData?.content) {
        setTopics(apiData.content);
      }

      if (apiData?.page) {
        setPagination((prev) => ({
          ...prev,
          totalElements: apiData.page.totalElements || 0,
          totalPages: apiData.page.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to load topics");
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Topic name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = editingTopic ? "/topic/update" : "/topic/create";
      const requestBody = editingTopic
        ? {
            id: editingTopic.id,
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive,
          }
        : {
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive,
          };

      const response = await apiClient.post(endpoint, requestBody);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          editingTopic
            ? "Topic updated successfully!"
            : "Topic created successfully!",
        );

        setFormData({
          name: "",
          description: "",
          isActive: true,
        });
        setEditingTopic(null);

        fetchTopics();
      }
    } catch (error) {
      console.error("Error saving topic:", error);

      if (error.response) {
        const errorData = error.response.data;
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          "An error occurred while saving the topic";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      isActive: topic.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setErrors({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        pageNumber: newPage,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="flex items-center gap-3 text-white bg-gradient-to-r from-[#7966F1] to-[#9F85FF] !px-6 !py-5">
            <h2 className="text-lg font-semibold uppercase">
              {editingTopic ? "Edit Topic" : "Create Topic"}
            </h2>
          </div>

          <div className="flex justify-center items-center w-full !px-4 !py-6">
            <div className="w-full max-w-6xl space-y-6">
              <div className="bg-white border border-[#d9d9f3] rounded-xl shadow-md !px-8 !py-10">
                <h3 className="text-lg font-semibold text-gray-800 !mb-6 uppercase">
                  Topic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 !mb-1">
                      Topic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#5E48EF]"}`}
                      placeholder="Enter topic name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs !mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between !px-4 !py-2 border border-gray-400 bg-gray-50 rounded-md !mt-6">
                    <span className="text-sm font-medium text-gray-700">
                      Active Status
                    </span>
                    <button
                      type="button"
                      onClick={handleSwitchChange}
                      disabled={loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        formData.isActive ? "bg-[#7966F1]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-white rounded-full transform transition-transform ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 !mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      disabled={loading}
                      className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 ${errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#5E48EF]"}`}
                      placeholder="Enter topic description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs !mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  {editingTopic && (
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="bg-gray-500 text-white font-semibold !px-10 !py-3 rounded-full shadow-md transition-all cursor-pointer hover:opacity-90"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white font-semibold !px-10 !py-3 rounded-lg shadow-md transition-all cursor-pointer ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90"
                    }`}
                  >
                    {loading
                      ? editingTopic
                        ? "Updating..."
                        : "Creating..."
                      : editingTopic
                        ? "Update Topic"
                        : "Create Topic"}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#d9d9f3] rounded-lg shadow-md !px-8 !py-10 !mt-4">
                <h3 className="text-lg font-semibold text-gray-800 !mb-6 uppercase">
                  Existing Topics
                </h3>

                {topics.length === 0 ? (
                  <div className="text-center !py-8 text-red-600 uppercase">
                    No topics found
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg border border-gray-400 bg-white">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-400">
                            <th className="text-center text-sm font-semibold text-gray-700 !px-6 !py-4 border-r border-gray-400">
                              Name
                            </th>
                            <th className="text-center text-sm font-semibold text-gray-700 !px-6 !py-4 border-r border-gray-400">
                              Description
                            </th>
                            <th className="text-center text-sm font-semibold text-gray-700 !px-6 !py-4 border-r border-gray-400">
                              Status
                            </th>
                            <th className="text-center text-sm font-semibold text-gray-700 !px-6 !py-4">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {topics.map((subject, index) => (
                            <tr
                              key={subject.id}
                              className={`border-b border-gray-300 transition-colors hover:bg-gray-50 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                              }`}
                            >
                              <td className="text-sm text-gray-600 !px-6 !py-4 text-center font-medium border-r border-gray-400">
                                {subject.name}
                              </td>

                              <td className="text-sm text-gray-600 !px-6 !py-4 text-center border-r border-gray-400">
                                {subject.description}
                              </td>

                              <td className="!px-6 !py-4 text-center border-r border-gray-400">
                                <span
                                  className={`inline-flex justify-center rounded text-xs font-medium !px-3 !py-1 ${
                                    subject.isActive
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {subject.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>

                              <td className="!px-6 !py-4 text-center">
                                <button
                                  onClick={() => handleEdit(subject)}
                                  className="inline-flex items-center justify-center rounded-md !p-2 text-[#7966F1] bg-gray-100 hover:bg-[#7966F1]/10 transition-colors"
                                >
                                  <Edit2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between !mt-6">
                        <div className="text-sm text-gray-600">
                          Showing{" "}
                          {pagination.pageNumber * pagination.pageSize + 1} to{" "}
                          {Math.min(
                            (pagination.pageNumber + 1) * pagination.pageSize,
                            pagination.totalElements,
                          )}{" "}
                          of {pagination.totalElements} subjects
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handlePageChange(pagination.pageNumber - 1)
                            }
                            disabled={pagination.pageNumber === 0}
                            className={`!p-2 rounded-md border ${
                              pagination.pageNumber === 0
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-[#7966F1] text-[#7966F1] hover:bg-[#7966F1] hover:text-white"
                            } transition-colors`}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {pagination.pageNumber + 1} of{" "}
                            {pagination.totalPages}
                          </span>
                          <button
                            onClick={() =>
                              handlePageChange(pagination.pageNumber + 1)
                            }
                            disabled={
                              pagination.pageNumber >= pagination.totalPages - 1
                            }
                            className={`!p-2 rounded-md border ${
                              pagination.pageNumber >= pagination.totalPages - 1
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-[#7966F1] text-[#7966F1] hover:bg-[#7966F1] hover:text-white"
                            } transition-colors`}
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTopic;
