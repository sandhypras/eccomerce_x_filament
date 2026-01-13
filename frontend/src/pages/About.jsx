import { Store, Award, Users, TrendingUp, Zap, Shield, Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    years: 0,
    customers: 0,
    products: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animateCounter = (key, target, duration) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters((prev) => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters((prev) => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    if (isVisible.stats) {
      animateCounter("years", 10, 1000);
      animateCounter("customers", 5000, 2000);
      animateCounter("products", 1000, 1500);
    }
  }, [isVisible.stats]);

  const features = [
    { icon: <Store size={60} />, title: "Kualitas Terjamin", desc: "Produk berkualitas tinggi dari brand ternama" },
    { icon: <Award size={60} />, title: "Harga Terbaik", desc: "Harga kompetitif dengan kualitas terbaik" },
    { icon: <Users size={60} />, title: "Layanan 24/7", desc: "Customer service siap membantu kapan saja" },
    { icon: <TrendingUp size={60} />, title: "Pengiriman Cepat", desc: "Pengiriman ke seluruh Indonesia" },
    { icon: <Shield size={60} />, title: "Garansi Resmi", desc: "Semua produk bergaransi resmi" },
    { icon: <Zap size={60} />, title: "Pembayaran Aman", desc: "Berbagai metode pembayaran aman" },
    { icon: <Heart size={60} />, title: "Produk Original", desc: "100% produk original dan bergaransi" },
    { icon: <Star size={60} />, title: "Trusted Store", desc: "Dipercaya ribuan pelanggan" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 animate-fade-in">Tentang Kami</h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto opacity-95" style={{ animationDelay: "0.2s" }}>
            Kami adalah toko elektronik terpercaya yang menyediakan berbagai produk berkualitas tinggi dengan harga terjangkau
          </p>
        </div>
      </section>

      {/* First Section - Image Left, Text Right */}
      <section id="section1" data-animate className={`max-w-6xl mx-auto px-5 py-20 transition-all duration-1000 ${isVisible.section1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 h-96 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 shadow-xl">
              <Store size={100} className="text-orange-600" />
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-5 text-gray-800">JUDUL</h2>
            <p className="text-base leading-relaxed text-gray-700 text-justify mb-4">
              Dalam kehidupan sehari-hari, kita sering berhadapan dengan berbagai konsep yang dapat mempengaruhi cara kita berpikir dan bertindak. Memahami terminologi dan implikasi. Dari sini dapat kita lihat bahwa setiap pilihan yang kita
              buat memiliki konsekuensi yang berbeda, dan penting untuk selalu mempertimbangkan berbagai sudut pandang sebelum mengambil keputusan.
            </p>
            <p className="text-base leading-relaxed text-gray-700 text-justify">
              Oleh karena itu, penting untuk selalu berpikir kritis dan terbuka terhadap berbagai perspektif yang ada. Dengan demikian, kita dapat membuat keputusan yang lebih baik dan lebih terinformasi dalam kehidupan sehari-hari yang
              mengitari dalam setiap situasi.
            </p>
          </div>
        </div>
      </section>

      {/* Second Section - Text Left, Image Right */}
      <section className="bg-white py-20">
        <div id="section2" data-animate className={`max-w-6xl mx-auto px-5 transition-all duration-1000 ${isVisible.section2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-5 text-gray-800">JUDUL</h2>
              <p className="text-base leading-relaxed text-gray-700 text-justify mb-4">
                Dalam kehidupan sehari-hari, kita sering berhadapan dengan berbagai konsep yang dapat mempengaruhi cara kita berpikir dan bertindak. Memahami terminologi dan implikasi. Dari sini dapat kita lihat bahwa setiap pilihan yang
                kita buat memiliki konsekuensi yang berbeda, dan penting untuk selalu mempertimbangkan berbagai sudut pandang sebelum mengambil keputusan.
              </p>
              <p className="text-base leading-relaxed text-gray-700 text-justify">
                Oleh karena itu, penting untuk selalu berpikir kritis dan terbuka terhadap berbagai perspektif yang ada. Dengan demikian, kita dapat membuat keputusan yang lebih baik dan lebih terinformasi dalam kehidupan sehari-hari yang
                mengitari dalam setiap situasi.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 h-96 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 shadow-xl">
                <Award size={100} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section - Grid Features */}
      <section id="features" data-animate className={`max-w-6xl mx-auto px-5 py-20 transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <h2 className="text-4xl font-bold mb-5 text-gray-800 text-center">SUBJUDUL</h2>
        <p className="text-base leading-relaxed text-gray-700 text-center max-w-4xl mx-auto mb-12">
          Dalam kehidupan sehari-hari kita sering berhadapan dengan berbagai konsep yang dapat mempengaruhi cara kita berpikir dan bertindak. Memahami terminologi dan implikasi. Dari sini dapat kita lihat bahwa setiap pilihan yang kita buat
          memiliki konsekuensi yang berbeda, dan penting untuk selalu mempertimbangkan berbagai sudut pandang.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {features.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-orange-600 mb-4 flex justify-center transform hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-lg font-bold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" data-animate className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className={`relative max-w-6xl mx-auto px-5 transition-all duration-1000 ${isVisible.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <h3 className="text-5xl md:text-6xl font-bold mb-2">{counters.years}+</h3>
              <p className="text-base text-orange-100">Tahun Pengalaman</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <h3 className="text-5xl md:text-6xl font-bold mb-2">{counters.customers}+</h3>
              <p className="text-base text-orange-100">Pelanggan Puas</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <h3 className="text-5xl md:text-6xl font-bold mb-2">{counters.products}+</h3>
              <p className="text-base text-orange-100">Produk Tersedia</p>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <h3 className="text-5xl md:text-6xl font-bold mb-2">24/7</h3>
              <p className="text-base text-orange-100">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h3 className="text-2xl font-bold mb-5">FOOTER</h3>
          <p className="text-sm text-gray-400 mb-5">© 2024 TokoKu. All rights reserved.</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
