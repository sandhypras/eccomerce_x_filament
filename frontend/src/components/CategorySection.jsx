import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Loader2, AlertCircle } from "lucide-react";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Mengambil data dari endpoint API Anda
        const response = await fetch("http://localhost:8000/api/categories");

        if (!response.ok) {
          throw new Error("Gagal terhubung ke server. Pastikan backend menyala.");
        }

        const data = await response.json();

        // Menangani jika data dibungkus dalam properti 'data' (standar API Resource)
        const finalData = Array.isArray(data) ? data : data.data || [];
        setCategories(finalData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Navigasi ke halaman produk dengan filter kategori
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-gray-500 animate-pulse">Memuat kategori dari database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 bg-gray-50 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">Kategori Populer</h2>
            <p className="text-gray-500 mt-2">Temukan produk terbaik berdasarkan kategori pilihan Anda</p>
          </div>
          <button onClick={() => navigate("/products")} className="text-orange-600 font-bold hover:text-orange-700 transition-colors flex items-center gap-1">
            Lihat Semua Produk
          </button>
        </div>

        {/* Grid Categories */}
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Package size={60} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Belum ada kategori tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div key={category.id} onClick={() => handleCategoryClick(category.id)} className="group cursor-pointer">
                <div className="relative h-64 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                  {/* Category Image */}
                  <div className="h-2/3 w-full bg-gray-100 relative overflow-hidden">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50">
                        <Package className="text-orange-200" size={48} />
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  {/* Category Info */}
                  <div className="h-1/3 p-4 flex flex-col justify-center items-center">
                    <h3 className="text-center font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 truncate w-full px-2">{category.name}</h3>
                    <div className="mt-2 h-1 w-8 bg-orange-500 rounded-full scale-x-0 group-hover:scale-x-150 transition-transform duration-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
