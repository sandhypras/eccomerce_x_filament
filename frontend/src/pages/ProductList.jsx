import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function ProductList() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Pastikan endpoint ini sesuai dengan Laravel/Backend Anda
    // Biasanya: /api/categories/{id} yang mengembalikan data category + produknya
    fetch(`${API_URL}/api/categories/${id}`)
      .then((res) => res.json())
      .then((json) => {
        // PERHATIKAN: Sesuaikan 'json.data' dengan struktur API Anda
        // Jika API Anda mengembalikan { data: { name: '..', products: [] } }
        if (json.data) {
          setCategory(json.data);
          setProducts(json.data.products || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/400x400/eeeeee/f28d1a?text=No+Image";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Halaman */}
      <div className="bg-white border-b mb-8">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">{category ? category.name : "Loading..."}</h1>
          </div>
          <p className="text-sm text-gray-500 font-bold">{products.length} Products Found</p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#f28d1a] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">Memuat Produk...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                {/* Gambar Produk */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img src={product.image} alt={product.name} onError={handleImageError} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info Produk */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tight h-10 line-clamp-2 mb-2">{product.name}</h3>

                  <div className="mt-auto">
                    <p className="text-[#f28d1a] font-black text-lg">Rp {new Intl.NumberFormat("id-ID").format(product.price)}</p>

                    <button className="w-full mt-4 bg-[#f28d1a] text-white py-2.5 flex items-center justify-center gap-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#d97d15] transition-colors">
                      <ShoppingCart size={14} />
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest">Maaf, Produk belum tersedia di kategori ini.</p>
            <Link to="/" className="text-[#f28d1a] font-bold text-sm underline mt-4 inline-block">
              Kembali Belanja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
