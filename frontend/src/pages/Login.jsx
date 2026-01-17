import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Import hook context

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Gunakan fungsi login dari AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Memanggil fungsi login dari AuthContext
    const result = await login(email, password);

    if (result.success) {
      console.log("✅ Login Berhasil");
      navigate("/"); // Redirect ke home setelah login sukses
    } else {
      setError(result.message || "Email atau password salah");
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    const adminUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    window.location.href = `${adminUrl}/admin/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-10 text-white flex flex-col justify-center items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3">TokoKu</h1>
          <p className="text-orange-100 text-center">Belanja elektronik terbaik dengan harga terjangkau</p>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
          <p className="text-gray-600 mb-6">Login untuk melanjutkan</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="email@gmail.com" />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="********"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className={`w-full py-3 rounded-lg font-semibold mb-4 text-white transition-all ${loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}>
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mb-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-orange-600 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <button onClick={handleAdminLogin} className="w-full bg-gray-50 hover:bg-gray-100 py-2 border border-gray-200 rounded-lg flex justify-center items-center gap-2">
            <ShieldCheck size={18} className="text-gray-600" />
            <span className="text-gray-700">Login sebagai Admin</span>
            <ArrowRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
