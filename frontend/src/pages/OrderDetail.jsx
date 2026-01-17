// src/pages/OrderDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Phone, CreditCard, FileText, Calendar, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrderDetail();
  }, [id, isAuthenticated, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/orders/${id}`);

      let orderData = null;
      if (response.data.order) {
        orderData = response.data.order;
      } else if (response.data.data) {
        orderData = response.data.data;
      } else {
        orderData = response.data;
      }

      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Gagal memuat detail pesanan");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPaymentProof = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("payment_proof", file);

      await axiosInstance.post(`/orders/${id}/upload-payment-proof`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage("Bukti pembayaran berhasil diupload!");
      setTimeout(() => setUploadMessage(""), 3000);

      // Refresh order data
      fetchOrderDetail();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Gagal mengupload bukti pembayaran");
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "#f39c12",
      processing: "#3498db",
      shipped: "#9b59b6",
      delivered: "#27ae60",
      cancelled: "#e74c3c",
    };
    return colorMap[status] || "#95a5a6";
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      pending: "#e74c3c",
      pending_verification: "#f39c12",
      verified: "#27ae60",
      rejected: "#c0392b",
    };
    return colorMap[status] || "#95a5a6";
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
        <p>Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
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
        <p>Pesanan tidak ditemukan</p>
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
          <button
            onClick={() => navigate("/orders")}
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
            Kembali ke Daftar Pesanan
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>Detail Pesanan #{order.id}</h1>
          <p style={{ fontSize: "16px", color: "#bdc3c7" }}>
            {new Date(order.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Upload Message */}
        {uploadMessage && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle size={20} />
            {uploadMessage}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth > 768 ? "1fr 400px" : "1fr",
            gap: "20px",
          }}
        >
          {/* Left Column */}
          <div>
            {/* Status Card */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#2c3e50",
                }}
              >
                Status Pesanan
              </h2>

              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <div
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "15px",
                    backgroundColor: getStatusColor(order.status) + "20",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${getStatusColor(order.status)}`,
                  }}
                >
                  <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Status Order</p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </p>
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "15px",
                    backgroundColor: getPaymentStatusColor(order.payment_status) + "20",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${getPaymentStatusColor(order.payment_status)}`,
                  }}
                >
                  <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Status Pembayaran</p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: getPaymentStatusColor(order.payment_status),
                    }}
                  >
                    {order.payment_status}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <MapPin size={20} />
                Informasi Pengiriman
              </h2>

              <div style={{ marginBottom: "15px" }}>
                <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>
                  <Phone size={14} style={{ display: "inline", marginRight: "5px" }} />
                  Nomor Telepon
                </p>
                <p style={{ fontSize: "14px", color: "#2c3e50", fontWeight: "500" }}>{order.phone}</p>
              </div>

              <div>
                <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Alamat Lengkap</p>
                <p style={{ fontSize: "14px", color: "#2c3e50", lineHeight: "1.6" }}>{order.shipping_address}</p>
              </div>

              {order.notes && (
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f0f0f0" }}>
                  <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>
                    <FileText size={14} style={{ display: "inline", marginRight: "5px" }} />
                    Catatan
                  </p>
                  <p style={{ fontSize: "14px", color: "#2c3e50", fontStyle: "italic" }}>{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Package size={20} />
                Produk Pesanan
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {(order.order_items || []).map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "15px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product?.name}
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
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#95a5a6",
                          }}
                        >
                          {item.product?.name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#2c3e50",
                          marginBottom: "5px",
                        }}
                      >
                        {item.product?.name || "Produk"}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "10px" }}>{item.product?.category?.name || "Kategori"}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ fontSize: "14px", color: "#7f8c8d" }}>
                          {item.quantity} × Rp {parseFloat(item.price || 0).toLocaleString("id-ID")}
                        </p>
                        <p style={{ fontSize: "16px", fontWeight: "bold", color: "#27ae60" }}>Rp {(parseFloat(item.price || 0) * item.quantity).toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Payment Proof Upload */}
            {order.payment_status === "pending" && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    color: "#2c3e50",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Upload size={20} />
                  Upload Bukti Pembayaran
                </h2>

                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "14px",
                    color: "#856404",
                  }}
                >
                  ⚠️ Silakan upload bukti transfer untuk memverifikasi pembayaran Anda.
                </div>

                <input type="file" accept="image/*" onChange={handleUploadPaymentProof} disabled={uploading} style={{ display: "none" }} id="payment-proof-upload" />
                <label
                  htmlFor="payment-proof-upload"
                  style={{
                    display: "block",
                    padding: "15px",
                    backgroundColor: uploading ? "#95a5a6" : "#3498db",
                    color: "white",
                    textAlign: "center",
                    borderRadius: "8px",
                    cursor: uploading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {uploading ? "Mengupload..." : "Pilih File"}
                </label>
                <p style={{ fontSize: "12px", color: "#7f8c8d", marginTop: "10px", textAlign: "center" }}>Format: JPG, PNG (Max 5MB)</p>
              </div>
            )}

            {/* Payment Proof Preview */}
            {order.payment_proof && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                    color: "#2c3e50",
                  }}
                >
                  Bukti Pembayaran
                </h2>
                <div
                  style={{
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={order.payment_proof_url || `${axiosInstance.defaults.baseURL.replace("/api", "")}/storage/${order.payment_proof}`}
                    alt="Bukti Pembayaran"
                    style={{
                      width: "100%",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CreditCard size={20} />
                Ringkasan Pembayaran
              </h2>

              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#7f8c8d" }}>Subtotal</span>
                  <span style={{ fontSize: "14px", color: "#2c3e50" }}>Rp {parseFloat(order.total || 0).toLocaleString("id-ID")}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#7f8c8d" }}>Ongkir</span>
                  <span style={{ fontSize: "14px", color: "#2c3e50" }}>Rp 0</span>
                </div>
              </div>

              <div
                style={{
                  paddingTop: "15px",
                  borderTop: "2px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>Total</span>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#27ae60" }}>Rp {parseFloat(order.total || 0).toLocaleString("id-ID")}</span>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "5px" }}>Metode Pembayaran</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>{order.payment_method === "transfer" ? "Transfer Bank" : order.payment_method}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
