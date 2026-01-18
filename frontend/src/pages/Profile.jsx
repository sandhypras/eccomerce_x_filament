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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-orange-500 text-white py-12 px-5 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profil Saya</h1>
          <p className="text-orange-100">Kelola informasi akun dan keamanan Anda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={24} className="text-orange-600" />
                  Informasi Profil
                </h2>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Profil
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile}>
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors ${
                      !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                    }`}
                  />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-colors ${
                      !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                    }`}
                  />
                </div>

                {/* Member Since */}
                <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3 mb-5">
                  <Calendar size={20} className="text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bergabung Sejak</p>
                    <p className="text-sm font-semibold text-gray-800">
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
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X size={18} />
                      Batal
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Lock size={24} className="text-orange-600" />
                  Keamanan Akun
                </h2>

                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    Ubah Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistics Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                Statistik Belanja
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-orange-600" />
                      <span className="text-sm text-gray-700">Total Pesanan</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{stats.totalOrders}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={20} className="text-blue-600" />
                      <span className="text-sm text-gray-700">Diproses</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="text-sm text-gray-700">Selesai</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                Aksi Cepat
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/MyOrders")}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-orange-600 text-left transition-colors"
                >
                  📦 Lihat Pesanan Saya
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-sm font-semibold text-gray-700 hover:text-orange-600 text-left transition-colors"
                >
                  🛍️ Lanjut Belanja
                </button>

                <button
                  onClick={logout}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-semibold text-red-600 text-left transition-colors"
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