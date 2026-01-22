import React, { useState, useEffect, useRef } from "react";
import WelcomeComponent from "../../components/auth/WelcomeComponent";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import { toast } from "react-toastify";
import {
  User,
  Phone,
  Mail,
  Users,
  Building,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    batch: "",
    orgCode: "",
    password: "",
    confirmPassword: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
  });

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
  const [orgSearchTerm, setOrgSearchTerm] = useState("");
  const [batchSearchTerm, setBatchSearchTerm] = useState("");

  const orgDropdownRef = useRef(null);
  const batchDropdownRef = useRef(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(event.target)
      ) {
        setOrgDropdownOpen(false);
      }
      if (
        batchDropdownRef.current &&
        !batchDropdownRef.current.contains(event.target)
      ) {
        setBatchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrganizations = async () => {
    setIsLoadingOrgs(true);
    try {
      const response = await apiClient.get("/user-open/getAllOrganization");
      if (response.data && response.data.success && response.data.data) {
        setOrganizations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setIsLoadingOrgs(false);
    }
  };

  const fetchBatches = async (organizationName) => {
    setIsLoadingBatches(true);
    setBatches([]);
    setFormData((prev) => ({ ...prev, batch: "" }));
    setBatchSearchTerm("");
    try {
      const response = await apiClient.post(
        "/user-open/getAllBatchByOrganization",
        {
          organization: organizationName,
        },
      );
      if (response.data && response.data.success && response.data.data) {
        setBatches(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches");
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const handleOrgSelect = (org) => {
    setFormData((prev) => ({ ...prev, orgCode: org.name }));
    setOrgSearchTerm(org.name);
    setOrgDropdownOpen(false);
    fetchBatches(org.name);
  };

  const handleBatchSelect = (batch) => {
    setFormData((prev) => ({ ...prev, batch: batch.name }));
    setBatchSearchTerm(batch.name);
    setBatchDropdownOpen(false);
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(orgSearchTerm.toLowerCase()),
  );

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(batchSearchTerm.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const validation = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasMinLength: password.length >= 8,
    };
    setPasswordValidation(validation);
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every((condition) => condition);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (!formData.number.trim()) {
      toast.error("Please enter your mobile number");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    if (!formData.orgCode.trim()) {
      toast.error("Please select an organization");
      return false;
    }

    if (!formData.batch.trim()) {
      toast.error("Please select a batch");
      return false;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return false;
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.number)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!isPasswordValid()) {
      toast.error("Password must meet all security requirements");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        name: formData.name.trim(),
        mobile: formData.number.trim(),
        email: formData.email.trim().toLowerCase(),
        batch: formData.batch.trim(),
        password: formData.password,
        orgCode: formData.orgCode.trim(),
      };

      console.log("Sending registration data:", {
        ...registrationData,
        password: "[HIDDEN]",
      });

      const response = await apiClient.post(
        "/user-open/registration",
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
          retry: 3,
          retryDelay: 1000,
        },
      );

      console.log("Registration response:", response);

      if (
        response.data &&
        (response.status === 200 || response.status === 201)
      ) {
        toast.success("Email is sent Please activate your account");

        setFormData({
          name: "",
          number: "",
          email: "",
          batch: "",
          orgCode: "",
          password: "",
          confirmPassword: "",
        });

        setOrgSearchTerm("");
        setBatchSearchTerm("");
        setBatches([]);

        setPasswordValidation({
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
          hasMinLength: false,
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        toast.error("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "ECONNABORTED") {
        toast.error(
          "Request timeout. Please check your connection and try again.",
        );
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.log("Error response:", { status, data });

        let errorMessage = "Registration failed";

        if (typeof data === "string") {
          errorMessage = data;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(", ");
        }

        switch (status) {
          case 400:
            toast.error(errorMessage);
            break;
          case 401:
            toast.error(errorMessage);
            break;
          case 403:
            toast.error(
              "Access forbidden. Please check your organization code.",
            );
            break;
          case 409:
            toast.error(
              "User already exists with this email or mobile number.",
            );
            break;
          case 422:
            toast.error(
              errorMessage || "Please check your input and try again.",
            );
            break;
          case 429:
            toast.error("Too many requests. Please wait and try again later.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          case 502:
            toast.error("Bad gateway. Server is temporarily unavailable.");
            break;
          case 503:
            toast.error("Service unavailable. Please try again later.");
            break;
          case 504:
            toast.error("Gateway timeout. Please try again.");
            break;
          default:
            toast.error(
              errorMessage || `Server error (${status}). Please try again.`,
            );
        }
      } else if (error.request) {
        console.log("Network error:", error.request);
        toast.error(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        console.log("Other error:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col sm:flex-col md:flex-row lg:flex-row">
      <WelcomeComponent />
      <div
        className="
            flex-1 bg-gray-50 flex items-center justify-center
            !p-4
            sm:!p-6
            md:!p-4
            lg:!p-0
            xl:!p-12
            "
      >
        <div
          className="
                w-full
                sm:w-[95%]
                md:w-[90%]
                lg:w-[85%]
                xl:w-[90%]
            "
        >
          <div
            className="
            bg-white rounded-lg border border-slate-300 shadow-md
            !px-5 !py-6
            sm:!px-6 sm:!py-8
            md:!px-6 md:!py-10
            lg:!px-6 lg:!py-12
            xl:rounded-2xl
            "
          >
            <h1
              className="
                text-base font-bold text-gray-700 text-center
                !mb-6
                sm:text-lg sm:!mb-8
                md:text-lg
                lg:text-xl
                xl:!mb-10
            "
            >
              REGISTER
            </h1>

            <form onSubmit={handleSubmit}>
              <div
                className="
                grid grid-cols-1 gap-4
                sm:grid-cols-2
                sm:gap-5
                md:grid-cols-1
                md:gap-4
                lg:grid-cols-2
                xl:gap-6
                "
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-4 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF] focus:bg-white"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="number"
                    placeholder="Mobile Number"
                    value={formData.number}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    maxLength={10}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-4 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF]"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-4 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF]"
                  />
                </div>

                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Organization"
                    value={orgSearchTerm}
                    onChange={(e) => setOrgSearchTerm(e.target.value)}
                    disabled={isLoading || isLoadingOrgs}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF]"
                  />
                </div>

                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Batch"
                    value={batchSearchTerm}
                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                    disabled={
                      isLoading || isLoadingBatches || !formData.orgCode
                    }
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF] disabled:cursor-not-allowed"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF]"
                  />
                </div>

                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#5E48EF]"
                  />
                </div>
              </div>
              {formData.password && (
                <div className="bg-gray-50 rounded-lg !p-3 sm:!p-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 !mb-2">
                    Password Requirements:
                  </p>
                  <div className="space-y-1 text-xs">
                    {[
                      [
                        "At least 8 characters",
                        passwordValidation.hasMinLength,
                      ],
                      [
                        "One uppercase letter (A-Z)",
                        passwordValidation.hasUppercase,
                      ],
                      [
                        "One lowercase letter (a-z)",
                        passwordValidation.hasLowercase,
                      ],
                      ["One number (0-9)", passwordValidation.hasNumber],
                      [
                        "One special character (!@#$%^&*)",
                        passwordValidation.hasSpecial,
                      ],
                    ].map(([label, valid], i) => (
                      <div
                        key={i}
                        className={`flex items-center ${
                          valid ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        <span className="mr-2">{valid ? "✓" : "○"}</span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="
                    w-full rounded-lg text-white font-semibold
                    !py-3 sm:!py-4 text-sm
                    !mt-6
                    bg-gradient-to-br from-[#735FF1] to-[#624CEF]
                    hover:opacity-90 transition-all
                "
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>

              <div className="text-center !mt-3 text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  to="/"
                  className="font-semibold text-gray-900 hover:text-[#5E48EF]"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
