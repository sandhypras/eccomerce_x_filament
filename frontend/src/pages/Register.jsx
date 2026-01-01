import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(formData);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Pendaftaran Berhasil! Selamat berbelanja.");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`step-item ${step >= 1 ? "active" : ""}`}>Akun</div>
          <div className={`step-item ${step >= 2 ? "active" : ""}`}>Profil</div>
          <div className={`step-item ${step >= 3 ? "active" : ""}`}>Alamat</div>
        </div>

        <form onSubmit={handleRegister}>
          {/* STEP 1: AKUN */}
          {step === 1 && (
            <div className="form-fade">
              <h3>Informasi Akun</h3>
              <div className="input-group">
                <label>Username</label>
                <input name="username" type="text" placeholder="@username" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="contoh@mail.com" onChange={handleChange} required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Konfirmasi</label>
                  <input name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                </div>
              </div>
              <button type="button" className="btn-next" onClick={nextStep}>Selanjutnya</button>
            </div>
          )}

          {/* STEP 2: PROFIL */}
          {step === 2 && (
            <div className="form-fade">
              <h3>Data Penerima</h3>
              <div className="input-group">
                <label>Nama Lengkap</label>
                <input name="fullName" type="text" placeholder="Sesuai KTP" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Nomor WhatsApp</label>
                <input name="phone" type="tel" placeholder="0812xxxx" onChange={handleChange} required />
              </div>
              <div className="button-group">
                <button type="button" className="btn-back" onClick={prevStep}>Kembali</button>
                <button type="button" className="btn-next" onClick={nextStep}>Lanjut ke Alamat</button>
              </div>
            </div>
          )}

          {/* STEP 3: ALAMAT PENGIRIMAN */}
          {step === 3 && (
            <div className="form-fade">
              <h3>Alamat Pengiriman</h3>
              <div className="input-group">
                <label>Alamat Lengkap Rumah</label>
                <textarea name="address" placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Blok" onChange={handleChange} required rows="3" />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Kota/Kabupaten</label>
                  <input name="city" type="text" placeholder="Jakarta Selatan" onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Kode Pos</label>
                  <input name="postalCode" type="number" placeholder="12345" onChange={handleChange} required />
                </div>
              </div>
              <div className="button-group">
                <button type="button" className="btn-back" onClick={prevStep}>Kembali</button>
                <button type="submit" className="btn-submit">Daftar Akun Sekarang</button>
              </div>
            </div>
          )}
        </form>
        
        <p className="login-link">Sudah punya akun? <span onClick={() => navigate("/login")}>Masuk</span></p>
      </div>
    </div>
  );
}