// src/pages/Cart.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/cart");

      console.log("📦 Cart API response:", response.data);

      // Handle different response formats
      let items = [];
      if (response.data.items && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      }

      console.log("✅ Cart items:", items);
      setCartItems(items);
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Gagal memuat keranjang");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;

    setUpdating(itemId);
    try {
      await axiosInstance.put(`/cart/${itemId}`, { quantity: newQty });
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Gagal memperbarui jumlah");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm("Hapus item dari keranjang?")) return;

    try {
      await axiosInstance.delete(`/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Gagal menghapus item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || item.product?.price || 0);
      const qty = parseInt(item.qty || item.quantity || 0);
      return total + price * qty;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return total + parseInt(item.qty || item.quantity || 0);
    }, 0);
  };

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
          <p>Memuat keranjang...</p>
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>Keranjang Belanja</h1>
          <p style={{ fontSize: "16px", color: "#bdc3c7" }}>{getTotalItems()} item dalam keranjang</p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 40px" }}>
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
        ) : cartItems.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "60px 20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <ShoppingBag size={64} style={{ color: "#bdc3c7", margin: "0 auto 20px" }} />
            <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#2c3e50" }}>Keranjang Kosong</h2>
            <p style={{ fontSize: "16px", color: "#7f8c8d", marginBottom: "20px" }}>Belum ada produk di keranjang Anda</p>
            <button
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "20px",
            }}
          >
            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = parseFloat(item.price || product.price || 0);
                const qty = parseInt(item.qty || item.quantity || 1);
                const itemTotal = price * qty;

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        flexShrink: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#f0f0f0",
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
                          }}
                        >
                          {product.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#2c3e50",
                          marginBottom: "8px",
                        }}
                      >
                        {product.name || "Produk"}
                      </h3>

                      <p
                        style={{
                          fontSize: "14px",
                          color: "#7f8c8d",
                          marginBottom: "15px",
                        }}
                      >
                        {product.category?.name || "Kategori"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Quantity Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            disabled={qty <= 1 || updating === item.id}
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "2px solid #e0e0e0",
                              borderRadius: "6px",
                              backgroundColor: "white",
                              cursor: qty <= 1 || updating === item.id ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: qty <= 1 ? 0.5 : 1,
                            }}
                          >
                            <Minus size={16} />
                          </button>

                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              minWidth: "30px",
                              textAlign: "center",
                            }}
                          >
                            {updating === item.id ? "..." : qty}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            disabled={updating === item.id}
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "2px solid #e0e0e0",
                              borderRadius: "6px",
                              backgroundColor: "white",
                              cursor: updating === item.id ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#7f8c8d",
                              marginBottom: "4px",
                            }}
                          >
                            Rp {price.toLocaleString("id-ID")} × {qty}
                          </div>
                          <div
                            style={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "#27ae60",
                            }}
                          >
                            Rp {itemTotal.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor: "#fee",
                        color: "#e74c3c",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    color: "#2c3e50",
                  }}
                >
                  Ringkasan Belanja
                </h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "2px solid #ecf0f1",
                  }}
                >
                  <span style={{ color: "#7f8c8d" }}>Total Item</span>
                  <span style={{ fontWeight: "600" }}>{getTotalItems()} item</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "#27ae60" }}>Rp {calculateTotal().toLocaleString("id-ID")}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  style={{
                    width: "100%",
                    backgroundColor: "#27ae60",
                    color: "white",
                    padding: "15px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#229954";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#27ae60";
                  }}
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
