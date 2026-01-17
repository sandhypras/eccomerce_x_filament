import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, Heart, ArrowUp, ShoppingBag, CreditCard, Truck, Shield } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
              <span className="text-2xl font-bold">TokoKu</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">TokoKu adalah platform e-commerce terpercaya yang menyediakan berbagai produk berkualitas dengan harga terbaik untuk memenuhi kebutuhan Anda.</p>

            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Tautan Cepat
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {["Tentang Kami", "Produk", "Kategori", "Promo", "Blog", "Karir"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all">
                    → {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Layanan Pelanggan
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {["Pusat Bantuan", "Cara Berbelanja", "Pengiriman", "Pengembalian", "Syarat & Ketentuan", "Kebijakan Privasi"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all">
                    → {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Hubungi Kami
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-400 text-sm">
                  Jl. Raya Contoh No. 123
                  <br />
                  Jakarta Selatan, 12345
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-orange-500 flex-shrink-0" size={20} />
                <p className="text-gray-400 text-sm">+62 812-3456-7890</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-orange-500 flex-shrink-0" size={20} />
                <p className="text-gray-400 text-sm">info@tokoku.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm mb-3 font-semibold">📧 Subscribe Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Anda" className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                <button className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all hover:scale-105">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} <span className="font-bold text-white">TokoKu</span>. All rights reserved. Made with <Heart className="inline text-red-500" size={14} /> in Indonesia
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </footer>
  );
};

export default Footer;
