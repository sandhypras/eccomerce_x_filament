import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = existingUsers.find(u => u.username === username && u.password === password);

    if ((username === "admin" && password === "1234") || user) {
      localStorage.setItem("isLogin", true);
      alert(`Selamat datang kembali, ${username}!`);
      navigate(from, { replace: true });
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="auth-page">
      <div className="background-shape shape1"></div>
      <div className="background-shape shape2"></div>
      
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in</p>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
          
          <div className="form-footer">
            <p>Don't have an account? <span className="link" onClick={() => navigate("/register")}>Register Now</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}