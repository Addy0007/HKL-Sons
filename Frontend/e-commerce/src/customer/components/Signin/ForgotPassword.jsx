import { useState } from "react";
import { Mail } from "lucide-react";
import { api } from "../../../Config/apiConfig";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setMessage("A reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h2>
          <p className="text-gray-600 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D8D7A] outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-semibold rounded-lg shadow transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: "#3D8D7A" }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder.
          </p>

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