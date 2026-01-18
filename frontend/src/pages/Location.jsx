// src/pages/Location.jsx
import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Package, HeadphonesIcon, Car } from "lucide-react";
import Footer from "../components/Footer";

const Location = () => {
  const storeInfo = {
    name: "TokoKu Electronics",
    address: "Jl. Contoh No. 123, Yogyakarta, DIY 55281",
    phone: "+62 274 123 4567",
    email: "info@tokoku.com",
    hours: [
      { day: "Senin - Jumat", time: "09:00 - 20:00" },
      { day: "Sabtu - Minggu", time: "10:00 - 18:00" },
    ],
    // Gunakan URL embed resmi dari Google Maps
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.973595511!2d110.37311!3d-7.7719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDYnMTguOCJTIDExMMKwMjInMjMuMiJF!5e0!3m2!1sid!2sid!4v1631234567890!5m2!1sid!2sid",
  };

  const features = [
    { title: "Produk Lengkap", desc: "Koleksi gadget dan elektronik terbaru.", icon: <Package className="w-8 h-8" />, color: "bg-blue-100 text-blue-600" },
    { title: "Garansi Resmi", desc: "Jaminan originalitas dan layanan purna jual.", icon: <ShieldCheck className="w-8 h-8" />, color: "bg-green-100 text-green-600" },
    { title: "Staff Ahli", desc: "Konsultasi teknis gratis dengan tim profesional.", icon: <HeadphonesIcon className="w-8 h-8" />, color: "bg-orange-100 text-orange-600" },
    { title: "Parkir Luas", desc: "Akses mudah dan aman untuk semua kendaraan.", icon: <Car className="w-8 h-8" />, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <>
      <div className="bg-gray-50 min-h-screen font-sans">
        {/* Hero Header */}
        <header className="bg-slate-900 text-white py-16 px-4 sm:py-24">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight">
              Kunjungi <span className="text-blue-400">Toko Kami</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">Temukan pengalaman belanja elektronik terbaik dengan layanan personal di lokasi strategis Yogyakarta.</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map Section (Besar di Kiri pada Desktop) */}
            <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
              <div className="p-4 bg-white border-b flex justify-between items-center">
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <MapPin size={18} className="text-red-500" /> Google Maps Interactive
                </span>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeInfo.address)}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  BUKA MAPS <ExternalLink size={12} />
                </a>
              </div>
              <iframe src={storeInfo.mapEmbed} className="w-full h-[400px] lg:h-[550px]" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Lokasi TokoKu" />
            </div>

            {/* Contact Information Card */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">Kontak & Alamat</h2>

                <div className="space-y-6">
                  {/* Address Item */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Alamat</h4>
                      <p className="text-slate-700 font-medium leading-relaxed">{storeInfo.address}</p>
                    </div>
                  </div>

                  {/* Phone Item */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Telepon</h4>
                      <a href={`tel:${storeInfo.phone}`} className="text-slate-700 font-bold hover:text-blue-600 transition-colors">
                        {storeInfo.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email Item */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email</h4>
                      <a href={`mailto:${storeInfo.email}`} className="text-slate-700 font-bold hover:text-blue-600 transition-colors">
                        {storeInfo.email}
                      </a>
                    </div>
                  </div>

                  {/* Hours Item */}
                  <div className="flex gap-4 pb-2">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Jam Operasional</h4>
                      {storeInfo.hours.map((h, i) => (
                        <p key={i} className="text-slate-700 text-sm font-medium">
                          <span className="text-slate-500">{h.day}:</span> {h.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeInfo.address)}`)}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Petunjuk Arah <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-800">Fasilitas Toko</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Location;
