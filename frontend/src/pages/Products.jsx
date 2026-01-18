import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Filter, Search, Package, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  // Mobile filter dropdown
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
      setCurrentPage(1);
    }
  }, [categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([axiosInstance.get("/products", { timeout: 30000 }), axiosInstance.get("/categories", { timeout: 30000 })]);

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

    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    setAddingToCart(productId);

    try {
      await axiosInstance.post("/cart", {
        product_id: productId,
        quantity: 1,
      });

      alert("Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      let errorMessage = "Gagal menambahkan ke keranjang";

      if (error.response?.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        navigate("/login");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
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
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const applyMobileFilter = () => {
    setShowMobileFilter(false);
    setCurrentPage(1);
  };

  const filteredProducts = getFilteredProducts();

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg font-semibold transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-orange-600 hover:bg-orange-50 border border-gray-300"}`}
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-all ${currentPage === page ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg font-semibold transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-orange-600 hover:bg-orange-50 border border-gray-300"}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-12 px-5 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Semua Produk</h1>
          <p className="text-lg text-orange-100">Temukan produk elektronik berkualitas dengan harga terbaik</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 pb-12">
        {/* Search Bar */}
        <div className="mb-6 -mt-12">
          <div className="bg-white rounded-lg shadow-md p-3 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari produk yang Anda inginkan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 text-base border-none focus:outline-none rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Desktop Filter Section */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="bg-gray-100 px-5 py-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center gap-2 text-gray-800">
                <Filter size={18} className="text-orange-600" />
                Filter & Urutkan
              </h3>
              <button onClick={clearFilters} className="text-red-600 text-sm font-semibold hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors">
                Reset
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-sm text-gray-700">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
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
                <label className="block font-semibold mb-2 text-sm text-gray-700">Harga Min (Rp)</label>
                <input
                  type="number"
                  placeholder="100.000"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm text-gray-700">Harga Max (Rp)</label>
                <input
                  type="number"
                  placeholder="5.000.000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm text-gray-700">Urutkan</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors">
                  <option value="">Default</option>
                  <option value="price_asc">Harga: Rendah ke Tinggi</option>
                  <option value="price_desc">Harga: Tinggi ke Rendah</option>
                  <option value="name_asc">Nama: A-Z</option>
                  <option value="name_desc">Nama: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Filter size={18} className="text-orange-600" />
              Filter & Urutkan
            </span>
            <ChevronDown size={20} className={`transition-transform ${showMobileFilter ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Mobile Filter Dropdown */}
        {showMobileFilter && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={() => setShowMobileFilter(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Filter & Urutkan</h3>
                <button onClick={() => setShowMobileFilter(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-5 space-y-5">
                <div>
                  <label className="block font-semibold mb-2 text-sm text-gray-700">Kategori</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors">
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-sm text-gray-700">Harga Min (Rp)</label>
                  <input
                    type="number"
                    placeholder="100.000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-sm text-gray-700">Harga Max (Rp)</label>
                  <input
                    type="number"
                    placeholder="5.000.000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-sm text-gray-700">Urutkan</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors">
                    <option value="">Default</option>
                    <option value="price_asc">Harga: Rendah ke Tinggi</option>
                    <option value="price_desc">Harga: Tinggi ke Rendah</option>
                    <option value="name_asc">Nama: A-Z</option>
                    <option value="name_desc">Nama: Z-A</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white border-t p-5 flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-3 px-4 bg-white border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  Reset
                </button>
                <button onClick={applyMobileFilter} className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors">
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-bold text-gray-900">
              {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}
            </span>{" "}
            dari <span className="font-bold text-gray-900">{filteredProducts.length}</span> produk
          </div>

          {totalPages > 1 && (
            <div className="hidden sm:block text-sm text-gray-600">
              Halaman <span className="font-bold text-orange-600">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-lg text-center">
            <p className="font-semibold">{error}</p>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center shadow-sm">
            <Package size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-700 mb-2">Tidak ada produk ditemukan</p>
            <p className="text-gray-500 mb-4">Coba ubah filter atau kata kunci pencarian</p>
            <button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors">
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div onClick={() => handleViewDetail(product.id)} className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-300">{product.name.charAt(0).toUpperCase()}</div>
                    )}

                    {product.stock < 10 && (
                      <div className={`absolute top-2 right-2 ${product.stock === 0 ? "bg-red-500" : "bg-orange-500"} text-white px-2 py-1 rounded text-xs font-bold`}>{product.stock === 0 ? "Habis" : `${product.stock} Tersisa`}</div>
                    )}
                  </div>

                  <div className="p-4">
                    <span className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold mb-2">{product.category?.name || "Kategori"}</span>

                    <h3 onClick={() => handleViewDetail(product.id)} className="text-sm font-semibold mb-2 text-gray-800 h-10 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="text-xl font-bold text-orange-600 mb-3">Rp {Number(product.price).toLocaleString("id-ID")}</div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={product.stock === 0 || addingToCart === product.id}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                          product.stock === 0 || addingToCart === product.id ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        <ShoppingCart size={16} />
                        {addingToCart === product.id ? "..." : product.stock === 0 ? "Habis" : "Beli"}
                      </button>

                      <button onClick={() => handleViewDetail(product.id)} className="py-2 px-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-500 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
