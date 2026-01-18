// src/pages/Cart.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";

// Sesuaikan URL ini dengan URL Backend Laravel Anda
const BASE_URL = "http://localhost:8000";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Helper untuk menangani URL Gambar Laravel
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl; // Jika sudah URL lengkap
    return `${BASE_URL}/storage/${imageUrl}`; // Jika hanya path (misal: products/image.jpg)
  };

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

      let items = [];
      if (response.data.items && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      }

      // Log untuk debug image
      items.forEach((item) => {
        console.log("📦 Cart Item:", item);
        console.log("📦 Product:", item.product);
        console.log("📦 Image URL:", item.product?.image_url);
        console.log("📦 Image:", item.product?.image);
      });

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-orange-500 text-white py-12 px-5 mb-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white hover:text-orange-100 mb-4 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Keranjang Belanja</h1>
          <p className="text-orange-100">{getTotalItems()} item dalam keranjang</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 pb-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-lg text-center">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center shadow-sm">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
            <button onClick={() => navigate("/products")} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = parseFloat(item.price || product.price || 0);
                const qty = parseInt(item.qty || item.quantity || 1);
                const itemTotal = price * qty;
                const finalImageUrl = getImageUrl(product.image_url || product.image);

                return (
                  <div key={item.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {finalImageUrl ? (
                        <img
                          src={finalImageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("❌ Failed to load image:", finalImageUrl);
                            e.target.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className = "w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300";
                            fallback.textContent = product.name?.charAt(0).toUpperCase() || "?";
                            e.target.parentElement.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">{product.name?.charAt(0).toUpperCase() || "?"}</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">{product.name || "Produk"}</h3>
                      <p className="text-sm text-gray-500 mb-3">{product.category?.name || "Kategori"}</p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            disabled={qty <= 1 || updating === item.id}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-semibold min-w-[30px] text-center">{updating === item.id ? "..." : qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, qty + 1)}
                            disabled={updating === item.id}
                            className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            Rp {price.toLocaleString("id-ID")} × {qty}
                          </div>
                          <div className="text-lg font-bold text-orange-600">Rp {itemTotal.toLocaleString("id-ID")}</div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button onClick={() => removeItem(item.id)} className="self-start bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-5 pb-4 border-b border-gray-200">Ringkasan Belanja</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Item</span>
                    <span className="font-semibold">{getTotalItems()} item</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-200">
                    <span>Ongkos Kirim</span>
                    <span className="text-green-600 font-semibold">GRATIS</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-800 mb-5">
                  <span>Total</span>
                  <span className="text-orange-600">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                </div>

                <button onClick={() => navigate("/checkout")} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
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
