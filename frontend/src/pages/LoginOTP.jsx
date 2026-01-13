// src/pages/LoginOTP.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const LoginOTP = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/send-otp", { email });

      if (response.data.success) {
        setStep(2);
        setDebugOtp(response.data.otp_debug || "");
        alert("Kode OTP telah dikirim ke email Anda!");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.response?.data?.message || "Gagal mengirim OTP");
      setDebugOtp(err.response?.data?.otp_debug || "");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        await checkAuth();
        navigate("/");
      } else {
        setError("Verifikasi OTP gagal");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.response?.data?.message || "Kode OTP tidak valid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "500px", width: "100%" }}>
        {/* Back Button */}
        <button
          onClick={() => (step === 1 ? navigate("/login") : setStep(1))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#666",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={20} />
          {step === 1 ? "Kembali ke Login Biasa" : "Kirim Ulang OTP"}
        </button>

        {/* Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "40px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#e3f2fd",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Mail style={{ color: "#1976d2" }} size={32} />
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#2c3e50",
                marginBottom: "8px",
              }}
            >
              {step === 1 ? "Login dengan OTP" : "Masukkan Kode OTP"}
            </h1>
            <p style={{ color: "#666" }}>{step === 1 ? "Masukkan email Anda untuk menerima kode OTP" : `Kode telah dikirim ke ${email}`}</p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "24px",
              }}
            >
              {error}
            </div>
          )}

          {debugOtp && (
            <div
              style={{
                backgroundColor: "#fffbf0",
                border: "1px solid #ffe066",
                color: "#856404",
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "24px",
              }}
            >
              <strong>DEBUG MODE:</strong> OTP Anda adalah: <strong style={{ fontSize: "20px" }}>{debugOtp}</strong>
              <br />
              <small>(Pesan ini hanya muncul di development)</small>
            </div>
          )}

          {step === 1 ? (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#2c3e50",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                    }}
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    style={{
                      width: "100%",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "6px",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || !email}
                style={{
                  width: "100%",
                  backgroundColor: loading || !email ? "#ccc" : "#1976d2",
                  color: "white",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading || !email ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Mengirim..." : "Kirim Kode OTP"}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#2c3e50",
                    marginBottom: "8px",
                  }}
                >
                  Kode OTP (6 digit)
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                    }}
                    size={20}
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    placeholder="123456"
                    maxLength={6}
                    style={{
                      width: "100%",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "6px",
                      fontSize: "24px",
                      textAlign: "center",
                      letterSpacing: "8px",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
                <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>Kode berlaku selama 5 menit</p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                style={{
                  width: "100%",
                  backgroundColor: loading || otp.length !== 6 ? "#ccc" : "#27ae60",
                  color: "white",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Memverifikasi..." : "Verifikasi & Login"}
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Belum punya akun?{" "}
            <Link
              to="/register"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOTP;
