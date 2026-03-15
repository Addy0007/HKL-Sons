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

  useEffect(() => {
    if (jwt && user) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [jwt, user, navigate, location.state]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

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

    if (isSignIn) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      }));
    }
  };

  const toggleMode = () => {
    navigate(isSignIn ? "/signup" : "/login");
    setErrors({});
    setFormData({ firstName: "", lastName: "", email: "", password: "", mobile: "" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#D8C7A3" }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/web-app-manifest-192x192.png"
              alt="HKL Sons"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-2">
            {isSignIn ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-[#3D3D3D]">
            {isSignIn ? "Sign in to continue" : "Join HKL Sons today"}
          </p>
        </div>

        {/* Success message */}
        {location.state?.message && (
          <div className="bg-green-100 text-green-800 border border-green-300 p-3 rounded-md mb-4 text-center text-sm">
            {location.state.message}
          </div>
        )}

        {/* Form */}
        <div className="bg-[#F6F3EC] rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignIn && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    id="firstName" name="firstName" label="First Name"
                    icon={<User className="h-5 w-5 text-[#C6A15B]" />}
                    value={formData.firstName} onChange={handleInputChange}
                    error={errors.firstName} placeholder="John"
                  />
                  <InputField
                    id="lastName" name="lastName" label="Last Name"
                    icon={<User className="h-5 w-5 text-[#C6A15B]" />}
                    value={formData.lastName} onChange={handleInputChange}
                    error={errors.lastName} placeholder="Doe"
                  />
                </div>
                <InputField
                  id="mobile" name="mobile" label="Mobile Number"
                  icon={<Phone className="h-5 w-5 text-[#C6A15B]" />}
                  value={formData.mobile} onChange={handleInputChange}
                  error={errors.mobile} placeholder="9876543210"
                />
              </>
            )}

            <InputField
              id="email" name="email" label="Email" type="email"
              icon={<Mail className="h-5 w-5 text-[#C6A15B]" />}
              value={formData.email} onChange={handleInputChange}
              error={errors.email} placeholder="you@example.com"
            />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#C6A15B]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? "border-red-500" : "border-[#C6A15B]/30"
                  } rounded-lg bg-[#F6F3EC] text-[#2C2C2C] focus:ring-2 focus:ring-[#1F3D2B] outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#C6A15B] hover:text-[#a8843d]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            {isSignIn && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm hover:underline"
                  style={{ color: "#1F3D2B" }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-white font-semibold shadow-lg transition ${
                isLoading ? "opacity-60" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: "#1F3D2B" }}
            >
              {isLoading ? "Processing…" : isSignIn ? "Sign In" : "Create Account"}
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
            <p className="text-sm text-[#3D3D3D]">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold hover:underline"
                style={{ color: "#1F3D2B" }}
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
            onClick={() => navigate("/")}
            className="text-sm hover:underline"
            style={{ color: "#1F3D2B" }}
          >
            ← Back to home
          </button>
        </div>

      </div>
    </div>
  );
}

// ---------- Reusable Input Component ----------
function InputField({ id, name, label, type = "text", icon, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
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
            error ? "border-red-500" : "border-[#C6A15B]/30"
          } rounded-lg bg-[#F6F3EC] text-[#2C2C2C] focus:ring-2 focus:ring-[#1F3D2B] outline-none`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}