import { useState, useEffect } from "react";
import Footer from "../components/Footer";

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
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      title: "Kualitas Terjamin",
      desc: "Setiap produk yang kami tawarkan telah melalui proses seleksi ketat dan berasal dari brand-brand ternama dunia yang terpercaya",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
      title: "Harga Terbaik",
      desc: "Kami berkomitmen memberikan harga yang kompetitif tanpa mengorbankan kualitas produk untuk kepuasan pelanggan",
    },
    {
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      title: "Layanan 24/7",
      desc: "Tim customer service kami siap melayani dan menjawab pertanyaan Anda kapan saja, di mana saja",
    },
    {
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop",
      title: "Pengiriman Cepat",
      desc: "Jaringan distribusi yang luas memastikan produk Anda sampai dengan cepat dan aman ke seluruh Indonesia",
    },
    {
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop",
      title: "Garansi Resmi",
      desc: "Semua produk dilengkapi dengan garansi resmi dari distributor untuk memberikan ketenangan pikiran Anda",
    },
    {
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      title: "Pembayaran Aman",
      desc: "Berbagai pilihan metode pembayaran yang aman dan terpercaya untuk kemudahan transaksi Anda",
    },
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      title: "Produk Original",
      desc: "Kami menjamin 100% keaslian produk dengan sertifikat dan hologram resmi dari produsen",
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      title: "Toko Terpercaya",
      desc: "Dipercaya oleh ribuan pelanggan di seluruh Indonesia dengan rating kepuasan pelanggan yang tinggi",
    },
  ];

  return (
    <>
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
              Lebih dari sekadar toko elektronik - kami adalah mitra terpercaya Anda dalam memenuhi kebutuhan teknologi dengan produk berkualitas premium dan layanan yang mengutamakan kepuasan pelanggan
            </p>
          </div>
        </section>

        {/* First Section - Image Left, Text Right */}
        <section id="section1" data-animate className={`max-w-6xl mx-auto px-5 py-20 transition-all duration-1000 ${isVisible.section1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative h-96 rounded-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500 shadow-xl">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" alt="Our Store" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-5 text-gray-800">Visi Kami</h2>
              <p className="text-base leading-relaxed text-gray-700 text-justify mb-4">
                Menjadi destinasi utama bagi setiap konsumen yang mencari produk elektronik berkualitas tinggi di Indonesia. Kami percaya bahwa teknologi harus dapat diakses oleh semua orang, dan kami berkomitmen untuk menjembatani
                kesenjangan antara inovasi teknologi terkini dengan kebutuhan masyarakat melalui produk-produk pilihan yang kami kurasi dengan cermat.
              </p>
              <p className="text-base leading-relaxed text-gray-700 text-justify">
                Dengan pengalaman lebih dari satu dekade di industri elektronik, kami telah membangun reputasi sebagai toko yang tidak hanya menjual produk, tetapi juga memberikan solusi teknologi yang tepat untuk setiap kebutuhan
                pelanggan. Kepercayaan yang Anda berikan adalah aset paling berharga bagi kami.
              </p>
            </div>
          </div>
        </section>

        {/* Second Section - Text Left, Image Right */}
        <section className="bg-white py-20">
          <div id="section2" data-animate className={`max-w-6xl mx-auto px-5 transition-all duration-1000 ${isVisible.section2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-5 text-gray-800">Misi Kami</h2>
                <p className="text-base leading-relaxed text-gray-700 text-justify mb-4">
                  Memberikan pengalaman berbelanja yang luar biasa melalui kombinasi produk berkualitas tinggi, harga yang kompetitif, dan layanan pelanggan yang responsif. Kami senantiasa berupaya untuk memahami kebutuhan unik setiap
                  pelanggan dan menyediakan solusi yang paling sesuai dengan gaya hidup dan anggaran mereka.
                </p>
                <p className="text-base leading-relaxed text-gray-700 text-justify">
                  Komitmen kami tidak berhenti setelah transaksi selesai. Kami membangun hubungan jangka panjang dengan pelanggan melalui layanan purna jual yang prima, dukungan teknis yang handal, dan program loyalitas yang memberikan
                  nilai tambah. Kepuasan Anda adalah kesuksesan kami.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative h-96 rounded-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500 shadow-xl">
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop" alt="Our Mission" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Section - Grid Features */}
        <section id="features" data-animate className={`max-w-6xl mx-auto px-5 py-20 transition-all duration-1000 ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-4xl font-bold mb-5 text-gray-800 text-center">Mengapa Memilih Kami</h2>
          <p className="text-base leading-relaxed text-gray-700 text-center max-w-4xl mx-auto mb-12">
            Kami memahami bahwa dalam memilih toko elektronik, Anda tidak hanya mencari produk berkualitas, tetapi juga pengalaman berbelanja yang menyenangkan dan layanan yang dapat diandalkan. Inilah yang membuat kami berbeda dari yang
            lain dan menjadi pilihan utama ribuan pelanggan setia kami.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {features.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
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
      </div>
      <Footer />
    </>
  );
};

export default About;
