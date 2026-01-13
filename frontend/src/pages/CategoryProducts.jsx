// src/pages/CategoryProducts.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [id]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category details
      const categoryResponse = await axiosInstance.get(`/categories/${id}`);
      setCategory(categoryResponse.data);

      // Fetch products by category
      const productsResponse = await axiosInstance.get(`/products?category_id=${id}`);

      // Handle berbagai format response
      let productsData = [];
      if (Array.isArray(productsResponse.data)) {
        productsData = productsResponse.data;
      } else if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
        productsData = productsResponse.data.data;
      } else if (productsResponse.data.products && Array.isArray(productsResponse.data.products)) {
        productsData = productsResponse.data.products;
      } else {
        console.error("Unexpected products response format:", productsResponse.data);
        productsData = [];
      }

      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error: {error}</p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Kembali
        </button>
        <h1 style={styles.title}>{category?.name || "Kategori"}</h1>
        {category?.description && <p style={styles.description}>{category.description}</p>}
      </div>

      {!Array.isArray(products) || products.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Tidak ada produk dalam kategori ini</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCard} onClick={() => handleProductClick(product.id)}>
              <div style={styles.imageWrapper}>
                {product.image_url || product.image ? (
                  <img
                    src={product.image_url || `http://localhost:8000/storage/${product.image}`}
                    alt={product.name}
                    style={styles.productImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{
                    ...styles.placeholderImage,
                    display: product.image_url || product.image ? "none" : "flex",
                  }}
                >
                  No Image
                </div>
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                {product.description && (
                  <p style={styles.productDescription}>
                    {product.description.substring(0, 60)}
                    {product.description.length > 60 ? "..." : ""}
                  </p>
                )}
                <div style={styles.priceWrapper}>
                  <span style={styles.price}>Rp {Number(product.price).toLocaleString("id-ID")}</span>
                  {product.stock !== undefined && product.stock !== null && (product.stock > 0 ? <span style={styles.stockAvailable}>Stok: {product.stock}</span> : <span style={styles.stockEmpty}>Habis</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 40px",
  },
  backButton: {
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  imageWrapper: {
    width: "100%",
    height: "250px",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    color: "#999",
    fontSize: "16px",
  },
  productInfo: {
    padding: "15px",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  productDescription: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.4",
    marginBottom: "12px",
  },
  priceWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  stockAvailable: {
    fontSize: "12px",
    color: "#27ae60",
    fontWeight: "500",
  },
  stockEmpty: {
    fontSize: "12px",
    color: "#e74c3c",
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    padding: "40px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  emptyText: {
    fontSize: "18px",
    color: "#999",
  },
  errorContainer: {
    textAlign: "center",
    padding: "60px 20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  errorText: {
    fontSize: "18px",
    color: "#e74c3c",
    marginBottom: "20px",
  },
};

export default CategoryProducts;
