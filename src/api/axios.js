import axios from "axios";

// ✅ Dynamic baseURL
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://grievience-portal-backend-production.up.railway.app/api";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token + LOG REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;