import { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../../State/Auth/Action"; // ✅ fixed import path
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const { isLoading, error, jwt, user } = useSelector((state) => state.auth);

  // Determine initial mode (SignIn or SignUp)
  const getInitialMode = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname === "/signup" ? false : true;
    }
    return true;
  };

  const [isSignIn, setIsSignIn] = useState(getInitialMode());
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Update URL when mode changes
  useEffect(() => {
    const newPath = isSignIn ? "/login" : "/signup";
    if (typeof window !== "undefined" && window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  }, [isSignIn]);

  // Redirect user after successful login/signup
  useEffect(() => {
    if (jwt || user) {
      navigate("/");
    }
  }, [jwt, user, navigate]);

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isSignIn) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 🔥 Dispatch login or register action
    if (isSignIn) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      dispatch(register(userData));
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setErrors({});
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
  };

  const navigateHome = () => navigate("/");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFFEC2" }}
    >
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              <span className="text-2xl font-bold text-white">HKL</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-gray-600">
            {isSignIn
              ? "Sign in to continue to HKL Sons"
              : "Join HKL Sons today"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sign Up Fields */}
            {!isSignIn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  icon={<User />}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  placeholder="John"
                />
                <InputField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  icon={<User />}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  placeholder="Doe"
                />
              </div>
            )}

            {/* Email Field */}
            <InputField
              id="email"
              name="email"
              label="Email Address"
              icon={<Mail />}
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            {isSignIn && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#3D8D7A" }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: "#3D8D7A" }}
            >
              {isLoading
                ? "Processing..."
                : isSignIn
                ? "Sign In"
                : "Create Account"}
            </button>

            {error && (
              <p className="text-center text-sm text-red-600 mt-2">{error}</p>
            )}
          </form>

          {/* Toggle Sign In/Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold hover:underline"
                style={{ color: "#3D8D7A" }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={navigateHome}
            className="text-sm font-medium hover:underline"
            style={{ color: "#3D8D7A" }}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Input Component
function InputField({
  id,
  name,
  label,
  type = "text",
  icon,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-3 py-2.5 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
