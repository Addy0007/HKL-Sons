import axios from "axios";

 export const API_BASE_URL = "http://localhost:5454";


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached to:", config.method.toUpperCase(), config.url);
    } else {
      console.warn("⚠️ No JWT token for:", config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.error("🚫 Unauthorized - Token may be expired");
    }

    if (error.response?.status === 403) {
      console.error("🚫 Forbidden - Insufficient permissions");
    }

    return Promise.reject(error);
  }
);

export default api;