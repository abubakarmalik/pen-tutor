import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ; // change if needed

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token automatically from localStorage
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("access_token");
    if (raw) config.headers.Authorization = `Bearer ${raw}`;
  } catch (e) {
    // noop
  }
  return config;
});

export default api;