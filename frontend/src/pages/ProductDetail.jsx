// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < (product?.stock || 999)) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await axiosInstance.post("/cart", {
        product_id: product.id,
        quantity: quantity,
      });

      alert("Produk berhasil ditambahkan ke keranjang!");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Gagal menambahkan ke keranjang");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error || "Produk tidak ditemukan"}</p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        {/* Product Detail */}
        <div style={styles.productContainer}>
          {/* Product Image */}
          <div style={styles.imageSection}>
            <div style={styles.mainImageWrapper}>
              {product.image_url || product.image ? (
                <img
                  src={product.image_url || `http://localhost:8000/storage/${product.image}`}
                  alt={product.name}
                  style={styles.mainImage}
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
                <span style={styles.placeholderText}>No Image</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div style={styles.infoSection}>
            {/* Category Badge */}
            {product.category && <div style={styles.categoryBadge}>{product.category.name}</div>}

            {/* Product Name */}
            <h1 style={styles.productName}>{product.name}</h1>

            {/* Price */}
            <div style={styles.priceSection}>
              <span style={styles.price}>Rp {Number(product.price).toLocaleString("id-ID")}</span>
            </div>

            {/* Stock Info */}
            <div style={styles.stockSection}>{product.stock > 0 ? <span style={styles.stockAvailable}>Stok tersedia: {product.stock}</span> : <span style={styles.stockEmpty}>Stok habis</span>}</div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div style={styles.quantitySection}>
                <span style={styles.quantityLabel}>Jumlah:</span>
                <div style={styles.quantityControl}>
                  <button onClick={() => handleQuantityChange("decrease")} style={styles.quantityButton} disabled={quantity <= 1}>
                    <Minus size={16} />
                  </button>
                  <span style={styles.quantityValue}>{quantity}</span>
                  <button onClick={() => handleQuantityChange("increase")} style={styles.quantityButton} disabled={quantity >= product.stock}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                style={{
                  ...styles.addToCartButton,
                  opacity: addingToCart ? 0.7 : 1,
                  cursor: addingToCart ? "not-allowed" : "pointer",
                }}
                disabled={addingToCart}
              >
                <ShoppingCart size={20} />
                <span>{addingToCart ? "Menambahkan..." : "Tambah ke Keranjang"}</span>
              </button>
            )}

            {/* Description */}
            {product.description && (
              <div style={styles.descriptionSection}>
                <h3 style={styles.descriptionTitle}>Deskripsi Produk</h3>
                <p style={styles.descriptionText}>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  },
  productContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  mainImageWrapper: {
    width: "100%",
    height: "500px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  mainImage: {
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
  },
  placeholderText: {
    fontSize: "24px",
    color: "#999",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  categoryBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    fontSize: "14px",
    fontWeight: "500",
    padding: "6px 16px",
    borderRadius: "20px",
  },
  productName: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    lineHeight: "1.3",
  },
  priceSection: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "20px 0",
  },
  price: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  stockSection: {
    marginTop: "-10px",
  },
  stockAvailable: {
    fontSize: "14px",
    color: "#27ae60",
    fontWeight: "500",
  },
  stockEmpty: {
    fontSize: "14px",
    color: "#e74c3c",
    fontWeight: "500",
  },
  quantitySection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  quantityLabel: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    padding: "8px 12px",
  },
  quantityButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    color: "#333",
    transition: "opacity 0.2s",
  },
  quantityValue: {
    fontSize: "18px",
    fontWeight: "600",
    minWidth: "40px",
    textAlign: "center",
  },
  addToCartButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  descriptionSection: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  descriptionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "12px",
  },
  descriptionText: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.7",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    padding: "60px 20px",
  },
  errorContainer: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  errorText: {
    fontSize: "18px",
    color: "#e74c3c",
    marginBottom: "20px",
  },
};

// Add media query for responsive
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 768px) {
    .product-container {
      grid-template-columns: 1fr !important;
    }
  }
`;
if (!document.querySelector('style[data-component="product-detail"]')) {
  styleSheet.setAttribute("data-component", "product-detail");
  document.head.appendChild(styleSheet);
}

export default ProductDetail;
