// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Edit2, Save, X, Lock, Package, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }

    fetchStats();
  }, [isAuthenticated, user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/orders/my-orders");
      const orders = Array.isArray(response.data) ? response.data : response.data.orders || [];

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending" || o.status === "processing").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axiosInstance.put("/profile/update", profileData);

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      setIsEditing(false);

      // Refresh auth context (optional, jika ada method refresh)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Gagal memperbarui profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: "error", text: "Password konfirmasi tidak cocok" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axiosInstance.put("/profile/change-password", passwordData);

      setMessage({ type: "success", text: "Password berhasil diubah!" });
      setShowPasswordForm(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Gagal mengubah password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      name: user.name || "",
      email: user.email || "",
    });
  };

  if (!user) {
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
        <p>Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "60px 20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>👤 Profil Saya</h1>
          <p style={{ fontSize: "16px", opacity: 0.9 }}>Kelola informasi akun dan keamanan Anda</p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Message Alert */}
        {message.text && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
              border: `2px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              color: message.type === "success" ? "#155724" : "#721c24",
            }}
          >
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span style={{ fontWeight: "500" }}>{message.text}</span>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth > 768 ? "1fr 350px" : "1fr",
            gap: "20px",
          }}
        >
          {/* Main Content */}
          <div>
            {/* Profile Info Card */}
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <User size={24} />
                  Informasi Profil
                </h2>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <Edit2 size={16} />
                    Edit Profil
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile}>
                {/* Avatar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                      fontWeight: "bold",
                      color: "white",
                      boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name Field */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      backgroundColor: isEditing ? "white" : "#f8fafc",
                      color: "#1e293b",
                      transition: "all 0.2s",
                    }}
                  />
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#64748b",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      backgroundColor: isEditing ? "white" : "#f8fafc",
                      color: "#1e293b",
                      transition: "all 0.2s",
                    }}
                  />
                </div>

                {/* Member Since */}
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Calendar size={20} color="#64748b" />
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Bergabung Sejak</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                      {new Date(user.created_at || Date.now()).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "14px",
                        background: loading ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      <Save size={18} />
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "14px",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      <X size={18} />
                      Batal
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Card */}
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: showPasswordForm ? "25px" : "0",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Lock size={24} />
                  Keamanan Akun
                </h2>

                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#f1f5f9",
                      color: "#64748b",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Ubah Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword}>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: loading ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Mengubah..." : "Ubah Password"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          current_password: "",
                          new_password: "",
                          new_password_confirmation: "",
                        });
                      }}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "14px",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Statistics Card */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "20px",
                }}
              >
                📊 Statistik Belanja
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div
                  style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                    borderRadius: "12px",
                    border: "2px solid #667eea30",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Package size={20} color="#667eea" />
                      <span style={{ fontSize: "14px", color: "#64748b" }}>Total Pesanan</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}>{stats.totalOrders}</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #f39c1220 0%, #f39c1220 100%)",
                    borderRadius: "12px",
                    border: "2px solid #f39c1230",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <ShoppingCart size={20} color="#f39c12" />
                      <span style={{ fontSize: "14px", color: "#64748b" }}>Sedang Diproses</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#f39c12" }}>{stats.pendingOrders}</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #27ae6020 0%, #27ae6020 100%)",
                    borderRadius: "12px",
                    border: "2px solid #27ae6030",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CheckCircle size={20} color="#27ae60" />
                      <span style={{ fontSize: "14px", color: "#64748b" }}>Selesai</span>
                    </div>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#27ae60" }}>{stats.completedOrders}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "15px",
                }}
              >
                ⚡ Aksi Cepat
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => navigate("/MyOrders")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#64748b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0e7ff";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  📦 Lihat Pesanan Saya
                </button>

                <button
                  onClick={() => navigate("/products")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#64748b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0e7ff";
                    e.currentTarget.style.borderColor = "#667eea";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  🛍️ Lanjut Belanja
                </button>

                <button
                  onClick={logout}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#fee",
                    border: "2px solid #fdd",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#e74c3c",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fdd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee";
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
