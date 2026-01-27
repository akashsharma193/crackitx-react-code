import React, { useState, useEffect } from "react";
import WelcomeComponent from "../../components/auth/WelcomeComponent";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = ({ isSuperAdmin = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
  });

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const checkUserRole = (token) => {
    try {
      const decodedToken = decodeJWT(token);

      if (!decodedToken) {
        console.error("Failed to decode token");
        return null;
      }

      localStorage.setItem("userRole", decodedToken.Roles);
      return decodedToken.Roles;
    } catch (error) {
      console.error("Error checking user role:", error);
      return null;
    }
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId =
        "device_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!isPasswordValid()) {
      toast.error("Password must meet all security requirements");
      return false;
    }

    return true;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const deviceId = getDeviceId();

      const loginEndpoint = isSuperAdmin
        ? "/superAdminOpen/login"
        : "/user-open/login";

      const response = await apiClient.post(
        loginEndpoint,
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        {
          headers: {
            deviceId,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status !== 200 || !response.data?.data) {
        throw new Error("Invalid login response");
      }

      const { token, refreshToken, user } = response.data.data;

      if (!token) {
        throw new Error("Token not received");
      }

      // Store token FIRST
      localStorage.setItem("authToken", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Check role AFTER storing token
      const userRole = checkUserRole(token);

      if (isSuperAdmin && userRole !== "Super Admin") {
        toast.error("Access denied. Super Admin credentials required.");
        handleLogout();
        return;
      }

      if (!isSuperAdmin && userRole === "Super Admin") {
        toast.error("Please use the Super Admin login portal.");
        handleLogout();
        return;
      }

      // Store user data
      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));

        const userId = user.userId || user.id || user.user_id || user.ID;

        if (userId) {
          localStorage.setItem("userId", userId.toString());
        }
      }

      // Fallback: extract userId from token if missing
      const decoded = decodeJWT(token);
      if (decoded && !localStorage.getItem("userId")) {
        const tokenUserId =
          decoded.userId || decoded.id || decoded.user_id || decoded.sub;

        if (tokenUserId) {
          localStorage.setItem("userId", tokenUserId.toString());
        }
      }

      toast.success("Login successful");

      // Reset form
      setFormData({ email: "", password: "" });
      setPasswordValidation({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
        hasMinLength: false,
      });

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";

      if (status === 400) toast.error(message);
      else if (status === 401) toast.error("Invalid email or password");
      else if (status === 404) toast.error("User not found");
      else if (status === 422) toast.error("Invalid input");
      else if (status >= 500)
        toast.error("Server error. Please try again later");
      else toast.error(message);
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
                    md:!p-6
                    lg:!p-12
                    xl:!p-16
                "
      >
        <div className="w-full max-w-sm sm:max-w-sm">
          <div
            className="
                        bg-white border border-slate-300 shadow-md rounded-xl
                        !p-5
                        sm:!p-6
                        md:!px-8 md:!py-10
                        lg:!px-10 lg:!py-12
                        xl:rounded-2xl
                    "
          >
            <h1
              className="
                        text-lg font-bold text-gray-700 text-center
                        !mb-6
                        sm:!mb-8
                        xl:!mb-10
                        "
            >
              {isSuperAdmin ? "SUPER ADMIN LOGIN" : "LOGIN"}
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:gap-5 md:gap-6"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="
                            w-full bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                         border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#5E48EF] disabled:opacity-60 disabled:cursor-not-allowed
                            "
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
                  className="
                            w-full bg-gray-100 text-gray-900 placeholder-gray-500
                         !pl-12 !pr-12 !py-3 sm:!py-4 text-sm
                        rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#5E48EF] disabled:opacity-60 disabled:cursor-not-allowed
                            "
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
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

              {!isSuperAdmin && (
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#5E48EF] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="
                            w-full rounded-xl text-white font-semibold
                            !py-3 sm:!py-4
                            text-sm sm:text-base
                            bg-gradient-to-br from-[#735FF1] to-[#624CEF]
                            hover:opacity-90 transition-all
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {!isSuperAdmin && (
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    Don&apos;t have an account?{" "}
                  </span>
                  <Link
                    to="/register"
                    className="font-semibold text-gray-900 hover:text-[#5E48EF]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
