// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    console.log("🔍 Checking auth...");
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("❌ No token found");
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Fetching user data...");
      const response = await axiosInstance.get("/me");
      console.log("✅ User data received:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      // Token invalid, clear it
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login...");
      const response = await axiosInstance.post("/login", { email, password });

      console.log("Login response:", response.data);

      const { token, user: userData } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setUser(userData);
        console.log("✅ Login successful, token saved");
        return { success: true, user: userData }; // ← Return user data
      } else {
        console.error("❌ No token in response");
        return { success: false, message: "Invalid response from server" };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
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

      if (token) {
        localStorage.setItem("token", token);
        setUser(userData);
        return { success: true };
      }

      return { success: false, message: "Registration failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors,
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    checkAuth,
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #2c3e50",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          />
          <p>Loading...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
