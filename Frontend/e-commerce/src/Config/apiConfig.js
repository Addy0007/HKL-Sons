import axios from "axios";

export const API_BASE_URL = "http://localhost:5454";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
