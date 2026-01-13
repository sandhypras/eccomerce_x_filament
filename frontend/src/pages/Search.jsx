// src/pages/Search.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import axiosInstance from "../api/axios";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") {
      setProducts([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQuery)}`);

      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      }

      setProducts(productsData);
    } catch (error) {
      console.error("Error searching products:", error);
      setError(error.response?.data?.message || "Gagal mencari produk");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Cari Produk</h1>
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="text"
                placeholder="Cari produk..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#2c3e50",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cari
              </button>
            </div>
          </form>
        </div>

        {loading && <div style={{ textAlign: "center", padding: "40px" }}>Mencari...</div>}

        {!loading && searched && (
          <div>
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>{products.length > 0 ? `Ditemukan ${products.length} produk` : "Tidak ada produk ditemukan"}</p>

            {products.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ height: "200px", backgroundColor: "#f0f0f0" }}>{product.image_url && <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
                    <div style={{ padding: "15px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{product.name}</h3>
                      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2c3e50" }}>Rp {Number(product.price).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
