import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Filter, Search, TrendingUp, Package, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import Footer from "../components/Footer";

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Testing API connection...");

      const [productsRes, categoriesRes] = await Promise.all([axiosInstance.get("/products", { timeout: 30000 }), axiosInstance.get("/categories", { timeout: 30000 })]);

      console.log("✅ Products response:", productsRes.data);
      console.log("✅ Categories response:", categoriesRes.data);

      let productsData = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.data || [];
      let categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.data || [];

      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === parseInt(selectedCategory));
    }

    if (minPrice) {
      filtered = filtered.filter((p) => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();

    console.log("🔍 Debug Add to Cart:");
    console.log("- isAuthenticated:", isAuthenticated);
    console.log("- user:", user);
    console.log("- token:", localStorage.getItem("token"));

    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    setAddingToCart(productId);

    try {
      console.log("📦 Menambahkan produk ke keranjang...", { product_id: productId, quantity: 1 });

      const response = await axiosInstance.post("/cart", {
        product_id: productId,
        quantity: 1,
      });

      console.log("✅ Response dari server:", response.data);
      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Gagal menambahkan ke keranjang";

      if (error.response?.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        alert(errorMessage);
        navigate("/login");
      } else if (error.response?.status === 404) {
        errorMessage = "Endpoint tidak ditemukan. URL: " + error.config?.url;
        alert(errorMessage);
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors || {};
        const errorDetails = Object.values(validationErrors).flat().join(", ");
        errorMessage = "Validasi gagal: " + (errorDetails || error.response.data.message);
        alert(errorMessage);
      } else if (error.response?.data?.error) {
        errorMessage = "Server error: " + error.response.data.error;
        alert(errorMessage);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        errorMessage = "Error: " + (error.message || "Unknown error");
        alert(errorMessage);
      }
    } finally {
      setAddingToCart(null);
    }
  };

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setSearchQuery("");
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
          </div>
          <p className="text-gray-700 font-medium text-lg">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        {/* Hero Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white py-16 px-5 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={32} className="text-yellow-400" />
              <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">Produk Terbaik</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">Semua Produk</h1>
            <p className="text-xl text-blue-100 max-w-2xl">Temukan produk terbaik dengan harga terjangkau untuk kebutuhan Anda</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 pb-12">
          {/* Search Bar - Featured */}
          <div className="mb-8 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                <input type="text" placeholder="Cari produk yang Anda inginkan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-4 py-4 text-lg border-none focus:outline-none rounded-xl" />
              </div>
            </div>
          </div>

          {/* Filter Section - Modern Card Design */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                  <Filter size={20} className="text-blue-600" />
                  Filter & Urutkan
                </h3>
                <button onClick={clearFilters} className="text-red-600 text-sm font-semibold hover:text-red-700 hover:underline transition-all px-4 py-2 rounded-lg hover:bg-red-50">
                  Reset Semua
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700 uppercase tracking-wide">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm cursor-pointer bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700 uppercase tracking-wide">Harga Min (Rp)</label>
                  <input
                    type="number"
                    placeholder="100.000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700 uppercase tracking-wide">Harga Max (Rp)</label>
                  <input
                    type="number"
                    placeholder="5.000.000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm text-gray-700 uppercase tracking-wide">Urutkan</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm cursor-pointer bg-white hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">💰 Termurah</option>
                    <option value="price_desc">💎 Termahal</option>
                    <option value="name_asc">🔤 A-Z</option>
                    <option value="name_desc">🔤 Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info with Stats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-1">
            <div className="flex items-center gap-4">
              <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Produk</p>
                <p className="text-2xl font-bold text-blue-600">{filteredProducts.length}</p>
              </div>
              {filteredProducts.length !== products.length && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md">
                  <p className="text-xs opacity-90">Terfilter dari</p>
                  <p className="text-lg font-bold">{products.length} produk</p>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-lg">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="font-semibold text-lg">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-16 rounded-2xl text-center shadow-lg border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-gray-700 mb-2">Tidak ada produk ditemukan</p>
              <p className="text-gray-500 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
              <button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md">
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100">
                  {/* Image Container */}
                  <div onClick={() => handleViewDetail(product.id)} className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300 bg-gradient-to-br from-gray-200 to-gray-300">{product.name.charAt(0).toUpperCase()}</div>
                    )}

                    {/* Stock Badge */}
                    {product.stock < 10 && (
                      <div
                        className={`absolute top-3 right-3 ${
                          product.stock === 0 ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-500 to-orange-600"
                        } text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}
                      >
                        {product.stock === 0 ? "❌ Habis" : `⚡ ${product.stock} Tersisa`}
                      </div>
                    )}

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(product.id);
                          }}
                          className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                          <Eye size={18} />
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{product.category?.name || "Uncategorized"}</span>
                    </div>

                    {/* Product Name */}
                    <h3 onClick={() => handleViewDetail(product.id)} className="text-base font-bold mb-3 text-gray-800 min-h-12 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Rp {Number(product.price).toLocaleString("id-ID")}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={product.stock === 0 || addingToCart === product.id}
                        className={`flex-1 py-3 px-4 ${
                          product.stock === 0 || addingToCart === product.id
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
                        } rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all`}
                      >
                        <ShoppingCart size={18} />
                        {addingToCart === product.id ? "..." : product.stock === 0 ? "Habis" : "Beli"}
                      </button>

                      <button
                        onClick={() => handleViewDetail(product.id)}
                        className="py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Products;
