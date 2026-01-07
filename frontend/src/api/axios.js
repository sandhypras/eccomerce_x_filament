import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Penting untuk Laravel Sanctum
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor untuk menyisipkan token secara otomatis ke setiap request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
