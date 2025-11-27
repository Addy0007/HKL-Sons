import { useState, useEffect } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../../State/Auth/Action";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, jwt, user } = useSelector((state) => state.auth);

  const [isSignIn, setIsSignIn] = useState(location.pathname === "/login");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsSignIn(location.pathname === "/login");
  }, [location.pathname]);

  // After login success → redirect
  useEffect(() => {
    if (jwt && user) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [jwt, user, navigate, location.state]);

  // EMAIL validator
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // MOBILE validator
  const validateMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile); // 10-digit Indian number

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Common validations
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // SignUp validations
    if (!isSignIn) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";

      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";

      if (!validateMobile(formData.mobile))
        newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Dispatch login or register
    if (isSignIn) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(
        register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
        })
      );
    }
  };

  const toggleMode = () => {
    navigate(isSignIn ? "/signup" : "/login");
    setErrors({});
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: "",
    });
  };

  const navigateHome = () => navigate("/");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFFEC2" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
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
            {isSignIn ? "Sign in to continue" : "Join HKL Sons today"}
          </p>
        </div>

        {/* Success message (from reset password redirect) */}
        {location.state?.message && (
          <div className="bg-green-100 text-green-800 border border-green-300 p-3 rounded-md mb-4 text-center text-sm">
            {location.state.message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignIn && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    placeholder="John"
                  />

                  <InputField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    placeholder="Doe"
                  />
                </div>

                <InputField
                  id="mobile"
                  name="mobile"
                  label="Mobile Number"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  error={errors.mobile}
                  placeholder="9876543210"
                />
              </>
            )}

            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  } rounded-lg focus:ring-2 focus:ring-[#3D8D7A]`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            {isSignIn && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm hover:underline"
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
              className={`w-full py-2.5 rounded-lg text-white font-semibold shadow-lg ${
                isLoading ? "opacity-60" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: "#3D8D7A" }}
            >
              {isLoading
                ? "Processing…"
                : isSignIn
                ? "Sign In"
                : "Create Account"}
            </button>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 mt-3 rounded">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </form>

          {/* Toggle */}
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
            className="text-sm hover:underline"
            style={{ color: "#3D8D7A" }}
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Reusable Input Component ----------
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
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
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2.5 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-[#3D8D7A]`}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
