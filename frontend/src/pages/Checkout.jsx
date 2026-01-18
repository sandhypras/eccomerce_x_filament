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

      // Step 1: Create order dengan data pengiriman
      const orderData = {
        shipping_address: shippingAddress,
        phone: phone,
        notes: notes || "",
        payment_method: paymentMethod,
      };

      console.log("📤 Sending order data:", orderData);

      const orderResponse = await axiosInstance.post("/checkout", orderData);

      console.log("✅ Order response:", orderResponse.data);

      // Ambil order ID dari berbagai format response
      const orderId = orderResponse.data.order?.id || orderResponse.data.data?.id || orderResponse.data.id;

      if (!orderId) {
        throw new Error("Order ID tidak ditemukan dalam response");
      }

      console.log("🆔 Order ID:", orderId);

      // Step 2: Upload payment proof
      if (paymentProof) {
        const formData = new FormData();
        formData.append("payment_proof", paymentProof);

        console.log("📤 Uploading payment proof for order:", orderId);

        const uploadResponse = await axiosInstance.post(`/orders/${orderId}/upload-payment-proof`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("✅ Upload response:", uploadResponse.data);
      }

      // Success
      alert("✅ Pesanan berhasil dibuat! Email notifikasi telah dikirim ke admin.");
      navigate("/order-success", { state: { orderId } });
    } catch (error) {
      console.error("❌ Checkout error:", error);
      const errorMessage = error.response?.data?.message || "Gagal melakukan checkout";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const total = calculateTotal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data keranjang...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-6">Silakan tambahkan produk ke keranjang terlebih dahulu</p>
          <button onClick={() => navigate("/products")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all transform hover:scale-105">
            Belanja Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-blue-100">Lengkapi data pengiriman dan lakukan pembayaran</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <MapPin className="text-blue-600" size={28} />
                  Informasi Pengiriman
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Penerima</label>
                    <input type="text" value={user?.name || ""} disabled className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.phone ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Masukkan alamat lengkap termasuk kode pos"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-y ${
                        errors.shippingAddress ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.shippingAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan (Opsional)</label>
                    <textarea
                      placeholder="Catatan untuk penjual..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <CreditCard className="text-purple-600" size={28} />
                  Informasi Pembayaran
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Metode Pembayaran</label>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <input type="radio" id="transfer" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-blue-600 mr-3" />
                        <label htmlFor="transfer" className="text-lg font-bold text-gray-800">
                          Transfer Bank
                        </label>
                      </div>

                      <div className="bg-white rounded-lg p-5 space-y-2 text-sm">
                        <p className="font-bold text-gray-800 mb-3">Rekening Tujuan:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-semibold">BCA</span>

                          <span className="text-gray-600">No. Rekening:</span>
                          <span className="font-semibold">1234567890</span>

                          <span className="text-gray-600">Atas Nama:</span>
                          <span className="font-semibold">TokoKu Electronics</span>
                        </div>
                        <p className="text-red-600 text-xs mt-3 font-medium">* Silakan upload bukti transfer setelah melakukan pembayaran</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Payment Proof */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Bukti Pembayaran <span className="text-red-500">*</span>
                    </label>

                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${errors.paymentProof ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("border-blue-500", "bg-blue-100");
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove("border-blue-500", "bg-blue-100");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("border-blue-500", "bg-blue-100");
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          handleFileChange({ target: { files: [file] } });
                        }
                      }}
                    >
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="payment-proof-input" />
                      <label htmlFor="payment-proof-input" className="cursor-pointer">
                        {paymentProofPreview ? (
                          <div className="space-y-3">
                            <img src={paymentProofPreview} alt="Payment proof preview" className="max-w-full max-h-48 mx-auto rounded-lg shadow-md" />
                            <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              File berhasil dipilih
                            </p>
                            <p className="text-gray-500 text-xs">Klik untuk mengganti file</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload size={48} className="mx-auto text-gray-400" />
                            <p className="text-gray-600 font-medium">Klik atau drag & drop file di sini</p>
                            <p className="text-gray-400 text-xs">Format: JPG, PNG (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {errors.paymentProof && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.paymentProof}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform ${
                  submitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </span>
                ) : (
                  "Proses Pesanan"
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-gray-100">Ringkasan Pesanan</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = parseFloat(item.price || product.price || 0);
                  const qty = parseInt(item.qty || item.quantity || 1);
                  const itemTotal = price * qty;

                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300">{product.name?.charAt(0) || "?"}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name || "Produk"}</h4>
                        <p className="text-xs text-gray-500 mb-1">Qty: {qty}</p>
                        <p className="font-bold text-blue-600">Rp {itemTotal.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="space-y-3 pt-6 border-t-2 border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} item)</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className="text-green-600 font-semibold">GRATIS</span>
                </div>

                <div className="flex justify-between text-2xl font-bold text-gray-800 pt-4 border-t-2 border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {total.toLocaleString("id-ID")}</span>
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
