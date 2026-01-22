import React, { useState } from "react";
import WelcomeComponent from "../../components/auth/WelcomeComponent";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { Mail, Lock, LockOpen, Eye, EyeOff } from "lucide-react";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    tempPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [tempSent, setTempSent] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
  });

  const validateEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const validatePassword = (password) => {
    const validation = {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };
    setPasswordValidation(validation);
    return validation;
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every((condition) => condition);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "newPassword") {
      validatePassword(value);
    }
  };

  const sendTempPassword = async () => {
    const email = formData.email.trim();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/user-open/sendTempPassword", {
        id: email,
      });

      if (response.data && response.status === 200) {
        setTempSent(true);
        toast.success("Temporary password sent. Check your email.");
      }
    } catch (error) {
      console.error("Send temp password error:", error);

      if (error.response) {
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to send temporary password";
        toast.error(message);
      } else if (error.request) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    const { email, tempPassword, newPassword, confirmPassword } = formData;

    if (
      !email.trim() ||
      !tempPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("Password must meet all security requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setIsResetLoading(true);

    try {
      const response = await apiClient.post("/user-open/resetPassword", {
        email: email.trim(),
        tempPassword: tempPassword.trim(),
        password: newPassword.trim(),
      });

      if (response.data && response.status === 200) {
        toast.success("Password reset successfully");
        setTempSent(false);
        setFormData({
          email: "",
          tempPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordValidation({
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
          hasMinLength: false,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response) {
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to reset password";
        toast.error(message);
      } else if (error.request) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsResetLoading(false);
    }
  };

  const resendTempPassword = () => {
    setTempSent(false);
    setFormData((prev) => ({
      ...prev,
      tempPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setPasswordValidation({
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
      hasMinLength: false,
    });
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
            sm:w-[65%]
            md:w-[90%]
            lg:w-[80%]
            xl:max-w-md
            "
        >
          <div
            className="
                bg-white rounded-lg border border-slate-300 shadow-md
                !px-4 !py-6
                sm:!px-6 sm:!py-8
                md:!px-8 md:!py-10
                lg:!px-10 lg:!py-12
                xl:rounded-2xl
            "
          >
            <h1
              className="
                text-base font-bold text-gray-900 text-center
                !mb-6
                sm:text-lg sm:!mb-8
                md:text-lg
                lg:text-xl
                xl:!mb-10
                "
            >
              FORGOT PASSWORD
            </h1>

            <div
              className="
                flex flex-col
                gap-4
                sm:gap-5
                md:gap-6
                "
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading || tempSent}
                  className="
              w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
              !pl-12 !pr-4 !py-3 sm:!py-4 text-sm
              focus:outline-none focus:ring-1 focus:ring-[#7460F1] focus:bg-white
              transition-all disabled:opacity-60 disabled:cursor-not-allowed
            "
                />
              </div>
              <button
                type="button"
                onClick={sendTempPassword}
                disabled={isLoading || tempSent}
                className={`
            w-full rounded-lg border border-slate-300 text-white font-semibold
            !py-3 sm:!py-4 !px-6 text-sm
            transition-all hover:opacity-90
            disabled:opacity-60 disabled:cursor-not-allowed
            ${
              tempSent
                ? "bg-gray-400"
                : "bg-gradient-to-br from-[#735FF1] to-[#624CEF]"
            }
          `}
              >
                {isLoading
                  ? "Sending..."
                  : tempSent
                    ? "Temporary Password Sent"
                    : "Send Temporary Password"}
              </button>

              {tempSent && (
                <>
                  <div className="relative">
                    <LockOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7460F1]" />
                    <input
                      type={showTempPassword ? "text" : "password"}
                      name="tempPassword"
                      placeholder="Temporary Password"
                      value={formData.tempPassword}
                      onChange={handleInputChange}
                      disabled={isResetLoading}
                      className="
                  w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                  !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                  focus:outline-none focus:ring-1 focus:ring-[#7460F1] focus:bg-white
                  transition-all disabled:cursor-not-allowed
                "
                    />
                    <button
                      type="button"
                      onClick={() => setShowTempPassword(!showTempPassword)}
                      disabled={isResetLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showTempPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7460F1]" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={isResetLoading}
                      className="
                  w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                  !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                  focus:outline-none focus:ring-1 focus:ring-[#7460F1] focus:bg-white
                  transition-all disabled:cursor-not-allowed
                "
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7460F1]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isResetLoading}
                      className="
                  w-full bg-gray-100 rounded-lg border border-slate-300 text-gray-900 placeholder-gray-500
                  !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                  focus:outline-none focus:ring-1 focus:ring-[#7460F1] focus:bg-white
                  transition-all disabled:cursor-not-allowed
                "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={resetPassword}
                    disabled={isResetLoading}
                    className="
                w-full rounded-lg border border-slate-300 text-white font-semibold
                !py-3 sm:!py-4 !px-6 text-sm
                bg-gradient-to-br from-[#735FF1] to-[#624CEF]
                hover:opacity-90 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
              "
                  >
                    {isResetLoading ? "Resetting..." : "Reset Password"}
                  </button>

                  <div className="text-center !mt-2 text-sm">
                    <button
                      type="button"
                      onClick={resendTempPassword}
                      disabled={isResetLoading}
                      className="text-[#7460F1] font-semibold hover:underline"
                    >
                      Resend Temporary Password
                    </button>
                  </div>
                </>
              )}

              <div className="text-center !mt-2 text-sm">
                <span className="text-gray-600">Remember your password? </span>
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:text-[#7460F1]"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
