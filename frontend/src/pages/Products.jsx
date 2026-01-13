// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Test connection first
      console.log("🔍 Testing API connection...");

      const [productsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/products", { timeout: 30000 }), // 30 detik
        axiosInstance.get("/categories", { timeout: 30000 }),
      ]);

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

    // Debug: Log authentication status
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
      console.error("Full error object:", JSON.stringify(error.response, null, 2));

      // Better error messages
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
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #2c3e50",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          />
          <p>Memuat produk...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "40px 20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>Semua Produk</h1>
          <p style={{ fontSize: "16px", color: "#bdc3c7" }}>Temukan produk terbaik untuk kebutuhan Anda</p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px 40px" }}>
        {/* Filter Section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={20} />
              Filter & Pencarian
            </h3>
            <button
              onClick={clearFilters}
              style={{
                background: "none",
                border: "none",
                color: "#e74c3c",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Reset Semua Filter
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              >
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
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
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              >
                Harga Minimum (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 100000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              >
                Harga Maximum (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 5000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              >
                Urutkan Berdasarkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              >
                <option value="">Default</option>
                <option value="price_asc">Harga: Rendah ke Tinggi</option>
                <option value="price_desc">Harga: Tinggi ke Rendah</option>
                <option value="name_asc">Nama: A-Z</option>
                <option value="name_desc">Nama: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            padding: "0 5px",
          }}
        >
          <p style={{ fontSize: "16px", color: "#666", fontWeight: "500" }}>
            Menampilkan <strong style={{ color: "#2c3e50" }}>{filteredProducts.length}</strong> dari <strong style={{ color: "#2c3e50" }}>{products.length}</strong> produk
          </p>
        </div>

        {/* Products Grid */}
        {error ? (
          <div
            style={{
              backgroundColor: "#fee",
              color: "#c33",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "60px 20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: "18px", color: "#666", marginBottom: "10px" }}>Tidak ada produk ditemukan</p>
            <p style={{ fontSize: "14px", color: "#999" }}>Coba ubah filter pencarian Anda</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  onClick={() => handleViewDetail(product.id)}
                  style={{
                    height: "200px",
                    backgroundColor: "#f0f0f0",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px",
                        fontWeight: "bold",
                        color: "#bdc3c7",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {product.stock < 10 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: product.stock === 0 ? "#e74c3c" : "#f39c12",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {product.stock === 0 ? "Habis" : `Sisa ${product.stock}`}
                    </div>
                  )}
                </div>

                <div style={{ padding: "15px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7f8c8d",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    {product.category?.name || "Uncategorized"}
                  </div>

                  <h3
                    onClick={() => handleViewDetail(product.id)}
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: "#2c3e50",
                      minHeight: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.name}
                  </h3>

                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#27ae60",
                      marginBottom: "15px",
                    }}
                  >
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={product.stock === 0 || addingToCart === product.id}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: product.stock === 0 || addingToCart === product.id ? "#95a5a6" : "#27ae60",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: product.stock === 0 || addingToCart === product.id ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock > 0 && addingToCart !== product.id) {
                          e.currentTarget.style.backgroundColor = "#229954";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock > 0 && addingToCart !== product.id) {
                          e.currentTarget.style.backgroundColor = "#27ae60";
                        }
                      }}
                    >
                      <ShoppingCart size={16} />
                      {addingToCart === product.id ? "Menambahkan..." : product.stock === 0 ? "Habis" : "Keranjang"}
                    </button>

                    <button
                      onClick={() => handleViewDetail(product.id)}
                      style={{
                        padding: "10px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2980b9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#3498db";
                      }}
                    >
                      <Eye size={16} />
                    </button>
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

export default Products;
