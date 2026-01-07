import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fungsi untuk menangani gambar error
  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x400/f28d1a/ffffff?text=Image";
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SLIDER */}
      <section className="relative h-[300px] md:h-[400px] bg-gradient-to-r from-[#a34a00] to-[#f28d1a] flex items-center justify-center text-white">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Laptop Gaming Terbaru</h2>
        <button className="absolute left-4 text-white/50 hover:text-white">
          <ChevronLeft size={48} />
        </button>
        <button className="absolute right-4 text-white/50 hover:text-white">
          <ChevronRight size={48} />
        </button>
      </section>

      {/* 2. CATEGORIES (Centered) */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-tighter italic text-gray-800">Categories</h2>

        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {loading ? (
            <p className="text-[#f28d1a] font-bold">Loading...</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`} // Navigasi ke ID kategori
                className="group flex flex-col items-center w-28 md:w-36 cursor-pointer"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#f28d1a] transition-all duration-300 p-1">
                  <img src={cat.image} alt={cat.name} onError={handleImageError} className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="mt-5 text-[11px] font-black uppercase tracking-widest text-center group-hover:text-[#f28d1a] transition-colors">{cat.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 3. FEATURED GRID (3 Squares) */}
      <section className="container mx-auto px-6 py-12 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-gray-50 border border-gray-100 hover:border-[#f28d1a] transition-colors overflow-hidden group">
              <img src={`https://placehold.co/600x600/eeeeee/f28d1a?text=Product+${i}`} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER INFO (Dark ELS Style) */}
      <section className="bg-[#3d3d3d] py-20 text-white mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="flex flex-col items-center">
              <Handshake size={44} className="mb-4 text-[#f28d1a]" />
              <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Layanan Profesional</h3>
              <p className="text-gray-400 text-[11px] max-w-[250px]">Tambahkan teks isi mengenai layanan atau keunggulan toko Anda.</p>
            </div>
            <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-gray-600 py-10 md:py-0">
              <Truck size={44} className="mb-4 text-[#f28d1a]" />
              <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Pengiriman Cepat</h3>
              <p className="text-gray-400 text-[11px] max-w-[250px]">Tambahkan teks isi mengenai layanan atau keunggulan toko Anda.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={44} className="mb-4 text-[#f28d1a]" />
              <h3 className="font-bold text-xs uppercase tracking-widest mb-3">Garansi Resmi</h3>
              <p className="text-gray-400 text-[11px] max-w-[250px]">Tambahkan teks isi mengenai layanan atau keunggulan toko Anda.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
