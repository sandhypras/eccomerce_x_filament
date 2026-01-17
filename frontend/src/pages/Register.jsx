import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, ShoppingBag, ArrowLeft } from "lucide-react";

const RegisterWithOTP = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    setError("");
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Semua field harus diisi");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Kode OTP telah dikirim ke email Anda");
        setStep(2);
        setCountdown(300);
        setCanResend(false);
      } else {
        setError(data.message || "Gagal mengirim OTP");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Masukkan kode OTP 6 digit");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.data.access_token);
        setSuccess("Registrasi berhasil! Mengalihkan...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError(data.message || "Kode OTP tidak valid");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/register/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Kode OTP baru telah dikirim");
        setOtp(["", "", "", "", "", ""]);
        setCountdown(300);
        setCanResend(false);
      } else {
        setError(data.message || "Gagal mengirim ulang OTP");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 md:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <ShoppingBag size={48} className="text-orange-600" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{step === 1 ? "Bergabung dengan TokoKu" : "Verifikasi Email"}</h1>

              <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-md">{step === 1 ? "Daftar sekarang dan nikmati pengalaman berbelanja" : "Masukkan kode OTP yang dikirim ke email Anda"}</p>

              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span>🎁</span>
                  </div>
                  <span className="text-orange-50">Promo Member Baru</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span>🚚</span>
                  </div>
                  <span className="text-orange-50">Gratis Ongkir Pertama</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span>💳</span>
                  </div>
                  <span className="text-orange-50">Cashback & Rewards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className={`flex items-center ${step === 1 ? "text-orange-600" : "text-green-600"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? "bg-orange-600" : "bg-green-600"} text-white`}>{step === 1 ? "1" : "✓"}</div>
                  <span className="ml-2 text-sm font-medium">Data Diri</span>
                </div>
                <div className={`w-12 h-0.5 mx-3 ${step === 2 ? "bg-orange-600" : "bg-gray-300"}`}></div>
                <div className={`flex items-center ${step === 2 ? "text-orange-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? "bg-orange-600 text-white" : "bg-gray-200"}`}>2</div>
                  <span className="ml-2 text-sm font-medium">Verifikasi</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* STEP 1: Registration Form */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
                  <p className="text-gray-600 text-sm mb-6">Lengkapi data diri Anda</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nama@email.com"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="08123456789"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Ulangi password"
                          className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Mengirim OTP..." : "Kirim Kode OTP"}
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Sudah punya akun?{" "}
                    <a href="/login" className="text-orange-600 font-semibold">
                      Login
                    </a>
                  </p>
                </div>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 2 && (
                <div>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-orange-600 font-medium mb-4 hover:text-orange-700">
                    <ArrowLeft size={20} />
                    Kembali
                  </button>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi OTP</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Kode OTP telah dikirim ke <strong>{formData.email}</strong>
                  </p>

                  <div className="flex gap-2 justify-center mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      />
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    {countdown > 0 ? (
                      <p className="text-gray-600 text-sm">
                        Kode akan kadaluarsa dalam <span className="font-bold text-orange-600">{formatTime(countdown)}</span>
                      </p>
                    ) : (
                      <p className="text-red-600 text-sm font-medium">Kode OTP telah kadaluarsa</p>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join("").length !== 6}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold shadow-lg disabled:opacity-50 mb-4"
                  >
                    {loading ? "Memverifikasi..." : "Verifikasi & Daftar"}
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="w-full bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Mengirim..." : canResend ? "Kirim Ulang OTP" : "Tunggu untuk kirim ulang"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithOTP;
