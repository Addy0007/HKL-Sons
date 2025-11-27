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
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage("Password changed successfully! Please login again.");
      
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password changed successfully — please login again.",
          },
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
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          Reset Password
        </h2>

        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center animate-fadeIn">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center animate-fadeIn">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-700 text-white font-semibold rounded-lg shadow hover:opacity-90"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
