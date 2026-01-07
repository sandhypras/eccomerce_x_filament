import api from "./axios";

export const login = async (credentials) => {
  // 1. Ambil CSRF Cookie (Wajib untuk Laravel Sanctum)
  await api.get("/sanctum/csrf-cookie", { baseURL: "http://localhost:8000" });
  // 2. Kirim data login
  const response = await api.post("/login", credentials);
  // 3. Simpan token ke localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = (data) => api.post("/register", data);
export const logout = () => {
  localStorage.removeItem("token");
  return api.post("/logout");
};
