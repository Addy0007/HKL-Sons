import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../../../Config/apiConfig";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, newPassword: password });
      setMessage("Password changed successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password changed successfully — please login again." },
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Invalid or expired token.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#FFFEC2" }}
    >
      <div className="w-full max-w-md">

        {/* ✅ Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/web-app-manifest-192x192.png"
              alt="HKL Sons"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h2>
          <p className="text-sm text-gray-600">Enter your new password below.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          {message && (
            <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center text-sm">
              {message}
            </p>
          )}

          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D8D7A] outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold text-white rounded-lg shadow transition hover:opacity-90"
              style={{ backgroundColor: "#3D8D7A" }}
            >
              Reset Password
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm hover:underline"
              style={{ color: "#3D8D7A" }}
            >
              ← Back to Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}