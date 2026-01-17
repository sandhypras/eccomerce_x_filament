// src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, [isAuthenticated, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/cart");

      console.log("📦 Checkout - Cart API response:", response.data);

      // Handle different response formats
      let items = [];
      if (response.data.items && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      }

      console.log("✅ Checkout - Cart items:", items);
      setCartItems(items);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      alert("Gagal memuat keranjang");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price || item.product?.price || 0);
      const qty = parseInt(item.qty || item.quantity || 0);
      return total + price * qty;
    }, 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, paymentProof: "File harus berupa gambar" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, paymentProof: "Ukuran file maksimal 5MB" });
        return;
      }

      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
      setErrors({ ...errors, paymentProof: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = "Alamat pengiriman harus diisi";
    }

    if (!phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(phone)) {
      newErrors.phone = "Nomor telepon tidak valid";
    }

    if (paymentMethod === "transfer" && !paymentProof) {
      newErrors.paymentProof = "Bukti pembayaran harus diupload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong");
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Create order
      const orderData = {
        shipping_address: shippingAddress,
        phone: phone,
        notes: notes || "",
        payment_method: paymentMethod,
        total: calculateTotal(),
      };

      const orderResponse = await axiosInstance.post("/checkout", orderData);

      console.log("Order response:", orderResponse.data);

      const orderId = orderResponse.data.order?.id || orderResponse.data.id;

      if (!orderId) {
        throw new Error("Order ID tidak ditemukan dalam response");
      }

      // Step 2: Upload payment proof if exists
      if (paymentProof) {
        const formData = new FormData();
        formData.append("payment_proof", paymentProof);

        await axiosInstance.post(`/orders/${orderId}/upload-payment-proof`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Success
      alert("Pesanan berhasil dibuat! Kami akan memproses pesanan Anda segera.");
      navigate("/order-success", { state: { orderId } });
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || "Gagal melakukan checkout";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const total = calculateTotal();

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
          <p>Memuat data keranjang...</p>
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

  console.log("🛒 Current cart items:", cartItems);
  console.log("📊 Total items:", cartItems.length);

  if (cartItems.length === 0) {
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
          <ShoppingBag size={64} color="#bdc3c7" style={{ marginBottom: "20px" }} />
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Keranjang Kosong</h2>
          <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>Silakan tambahkan produk ke keranjang terlebih dahulu</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
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
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>Checkout</h1>
          <p style={{ fontSize: "16px", color: "#bdc3c7" }}>Lengkapi data pengiriman dan lakukan pembayaran</p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth > 768 ? "1fr 400px" : "1fr",
            gap: "30px",
          }}
        >
          {/* Left Column - Form */}
          <div>
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <MapPin size={24} color="#2c3e50" />
                  Informasi Pengiriman
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Nomor Telepon <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${errors.phone ? "#e74c3c" : "#e0e0e0"}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  {errors.phone && <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "5px" }}>{errors.phone}</p>}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Alamat Lengkap <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <textarea
                    placeholder="Masukkan alamat lengkap termasuk kode pos"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: `2px solid ${errors.shippingAddress ? "#e74c3c" : "#e0e0e0"}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                  {errors.shippingAddress && <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "5px" }}>{errors.shippingAddress}</p>}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Catatan (Opsional)
                  </label>
                  <textarea
                    placeholder="Catatan untuk penjual..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CreditCard size={24} color="#2c3e50" />
                  Informasi Pembayaran
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "12px",
                      fontSize: "14px",
                    }}
                  >
                    Metode Pembayaran
                  </label>

                  <div
                    style={{
                      padding: "20px",
                      border: "2px solid #3498db",
                      borderRadius: "8px",
                      backgroundColor: "#e3f2fd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <input type="radio" id="transfer" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: "10px" }} />
                      <label htmlFor="transfer" style={{ fontSize: "16px", fontWeight: "600" }}>
                        Transfer Bank
                      </label>
                    </div>

                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      <p style={{ fontWeight: "600", marginBottom: "10px" }}>Rekening Tujuan:</p>
                      <p>Bank BCA</p>
                      <p>
                        No. Rek: <strong>1234567890</strong>
                      </p>
                      <p>
                        A/N: <strong>TokoKu Electronics</strong>
                      </p>
                      <p style={{ marginTop: "10px", color: "#e74c3c", fontSize: "13px" }}>* Silakan upload bukti transfer setelah melakukan pembayaran</p>
                    </div>
                  </div>
                </div>

                {/* Upload Payment Proof */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "12px",
                      fontSize: "14px",
                    }}
                  >
                    Upload Bukti Pembayaran <span style={{ color: "#e74c3c" }}>*</span>
                  </label>

                  <div
                    style={{
                      border: `2px dashed ${errors.paymentProof ? "#e74c3c" : "#bdc3c7"}`,
                      borderRadius: "8px",
                      padding: "30px",
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "#3498db";
                      e.currentTarget.style.backgroundColor = "#e3f2fd";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = "#bdc3c7";
                      e.currentTarget.style.backgroundColor = "#fafafa";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "#bdc3c7";
                      e.currentTarget.style.backgroundColor = "#fafafa";
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        handleFileChange({ target: { files: [file] } });
                      }
                    }}
                  >
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="payment-proof-input" />
                    <label htmlFor="payment-proof-input" style={{ cursor: "pointer" }}>
                      {paymentProofPreview ? (
                        <div>
                          <img
                            src={paymentProofPreview}
                            alt="Payment proof preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              marginBottom: "10px",
                              borderRadius: "4px",
                            }}
                          />
                          <p style={{ color: "#27ae60", fontSize: "14px", fontWeight: "600" }}>✓ File berhasil dipilih</p>
                          <p style={{ color: "#7f8c8d", fontSize: "12px", marginTop: "5px" }}>Klik untuk mengganti file</p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} color="#bdc3c7" style={{ marginBottom: "10px" }} />
                          <p style={{ fontSize: "14px", color: "#7f8c8d" }}>Klik atau drag & drop file di sini</p>
                          <p style={{ fontSize: "12px", color: "#95a5a6", marginTop: "5px" }}>Format: JPG, PNG (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {errors.paymentProof && (
                    <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <AlertCircle size={14} />
                      {errors.paymentProof}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: submitting ? "#95a5a6" : "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.backgroundColor = "#229954";
                }}
                onMouseLeave={(e) => {
                  if (!submitting) e.currentTarget.style.backgroundColor = "#27ae60";
                }}
              >
                {submitting ? "Memproses..." : "Proses Pesanan"}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
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
                  paddingBottom: "15px",
                  borderBottom: "2px solid #f0f0f0",
                }}
              >
                Ringkasan Pesanan
              </h2>

              {/* Cart Items */}
              <div style={{ marginBottom: "20px" }}>
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = parseFloat(item.price || product.price || 0);
                  const qty = parseInt(item.qty || item.quantity || 1);
                  const itemTotal = price * qty;

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "15px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
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
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "#bdc3c7",
                            }}
                          >
                            {product.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "5px",
                            color: "#2c3e50",
                          }}
                        >
                          {product.name || "Produk"}
                        </h4>
                        <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Qty: {qty}</p>
                        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#27ae60" }}>Rp {itemTotal.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div
                style={{
                  paddingTop: "20px",
                  borderTop: "2px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    fontSize: "14px",
                    color: "#7f8c8d",
                  }}
                >
                  <span>Subtotal ({cartItems.length} item)</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    fontSize: "14px",
                    color: "#7f8c8d",
                  }}
                >
                  <span>Ongkos Kirim</span>
                  <span>Rp 0</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "20px",
                    borderTop: "2px solid #f0f0f0",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#2c3e50",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "#27ae60" }}>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
