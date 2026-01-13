// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Set token to axios header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axiosInstance.get("/me");
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      // Token invalid, clear it
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { token, user: userData } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Set token to axios header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const response = await axiosInstance.post("/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      const { token, user: userData } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Set token to axios header
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registrasi gagal",
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and user
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
