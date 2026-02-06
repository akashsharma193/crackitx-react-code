import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../api/axiosConfig";
import { Edit2, ChevronLeft, ChevronRight } from "lucide-react";

const CreateSubject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingSubject, setEditingSubject] = useState(null);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchSubjects();
  }, [pagination.pageNumber]);

  const fetchSubjects = async () => {
    try {
      const response = await apiClient.post("/subject/getAll", {
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
        filter: {},
      });

      const apiData = response.data?.data;

      setSubjects(apiData?.content || []);

      setPagination((prev) => ({
        ...prev,
        totalElements: apiData?.page?.totalElements || 0,
        totalPages: apiData?.page?.totalPages || 0,
      }));
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Subject name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const createSubject = async () => {
    setLoading(true);
    try {
      await apiClient.post("/subject/create", formData);
      toast.success("Subject created successfully");
      setPagination((prev) => ({ ...prev, pageNumber: 0 }));
      fetchSubjects();
    } catch {
      toast.error("Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async () => {
    setLoading(true);
    try {
      await apiClient.post("/subject/update", {
        id: editingSubject.id || editingSubject._id,
        ...formData,
      });
      toast.success("Subject updated successfully");
      setPagination((prev) => ({ ...prev, pageNumber: 0 }));
      fetchSubjects();
    } catch {
      toast.error("Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    editingSubject ? updateSubject() : createSubject();
    setFormData({ name: "", description: "", isActive: true });
    setEditingSubject(null);
    setErrors({});
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || "",
      description: subject.description || "",
      isActive: Boolean(subject.isActive),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "", isActive: true });
    setErrors({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white !px-6 !py-5">
        <h2 className="text-lg font-semibold uppercase">
          {editingSubject ? "Edit Subject" : "Create Subject"}
        </h2>
      </div>

      <div className="flex justify-center w-full !px-4 !py-6">
        <div className="w-full max-w-6xl space-y-6">
          <div className="bg-white border border-[#d9d9f3] rounded-lg shadow-md !px-8 !py-10">
            <h3 className="text-lg font-semibold text-gray-800 !mb-6 uppercase">
              Subject Information
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 !mb-1">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-[#5E48EF]"
                    }`}
                    placeholder="Enter subject name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs !mt-1">{errors.name}</p>
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
                    className={`w-full !px-4 !py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-[#5E48EF]"
                    }`}
                    placeholder="Enter subject description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs !mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {editingSubject && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="bg-gray-500 text-white !px-10 !py-3 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#7966F1] to-[#9F85FF] text-white !px-10 !py-3 rounded-lg"
                >
                  {loading
                    ? editingSubject
                      ? "Updating..."
                      : "Creating..."
                    : editingSubject
                      ? "Update Subject"
                      : "Create Subject"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-[#d9d9f3] rounded-lg shadow-md !px-8 !py-10 !mt-4">
            <h3 className="text-lg font-semibold text-gray-800 !mb-6 uppercase">
              Existing Subjects
            </h3>

            {subjects.length === 0 ? (
              <div className="text-center !py-8 text-red-600 uppercase">
                No subjects found
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
                      {subjects.map((subject, index) => (
                        <tr
                          key={subject.id || subject._id}
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
                              className="relative z-10 inline-flex items-center justify-center rounded-md !p-2 text-[#7966F1] bg-gray-100 hover:bg-[#7966F1]/10 transition-colors"
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
                      Showing {pagination.pageNumber * pagination.pageSize + 1}{" "}
                      to{" "}
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
  );
};

export default CreateSubject;
