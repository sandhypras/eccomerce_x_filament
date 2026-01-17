// src/pages/MyOrders.jsx
import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, Loader2, Phone, CreditCard, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sesuaikan dengan URL Backend Anda
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrders(result.data);
      } else {
        throw new Error(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk gambar (dari perbaikan sebelumnya)
  const getImageUrl = (item) => {
    const path = item.image_url || item.image || item.product?.image_url || item.product?.image;
    if (!path) return `https://ui-avatars.com/api/?name=${item.name || "P"}&background=f3f4f6&color=9ca3af`;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `${BASE_URL}/storage/${cleanPath}`;
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Menunggu Pembayaran", text: "Menunggu Pembayaran" },
      pending_payment: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Menunggu Pembayaran", text: "Belum Dibayar" },
      waiting_confirmation: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle, label: "Menunggu Konfirmasi", text: "Sedang Dicek Admin" },
      processing: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package, label: "Diproses", text: "Sedang Dikemas" },
      shipped: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck, label: "Dikirim", text: "Dalam Pengiriman" },
      completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Selesai", text: "Transaksi Selesai" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Dibatalkan", text: "Dibatalkan" },
    };
    return statusMap[status?.toLowerCase()] || statusMap.pending;
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleUploadPayment = async (orderId, file) => {
    try {
      const formData = new FormData();
      formData.append("payment_proof", file);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/orders/${orderId}/upload-payment-proof`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert("Bukti pembayaran berhasil diunggah! Mohon tunggu konfirmasi admin.");
        fetchOrders();
      } else {
        alert("Gagal mengunggah bukti pembayaran.");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 transition">
            <ArrowLeft size={20} /> <span className="font-medium">Kembali</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Belum ada pesanan</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusConfig(order.status);
              const Icon = status.icon;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
                  {/* HEADER KARTU */}
                  <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Invoice</p>
                      <p className="font-bold text-gray-900">{order.order_number}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
                      <Icon size={14} /> {status.label}
                    </div>
                  </div>

                  {/* BODY KARTU */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          {/* Gambar Produk */}
                          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white flex items-center justify-center">
                            <img
                              src={getImageUrl(item)}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=f3f4f6&color=9ca3af`;
                              }}
                            />
                          </div>
                          {/* Info Produk */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 leading-tight mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.quantity} barang x {formatRupiah(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatRupiah(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Singkat & Tombol */}
                    <div className="mt-6 pt-5 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="text-center md:text-left">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Total Belanja</p>
                        <p className="text-xl font-black text-orange-600">{formatRupiah(order.total)}</p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="flex-1 md:flex-none px-5 py-2 rounded-xl border-2 font-bold text-gray-600 hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"
                        >
                          {selectedOrder === order.id ? "Tutup Detail" : "Lihat Detail"}
                        </button>

                        {/* Tombol Upload Bukti (Hanya muncul jika status pending) */}
                        {(order.status === "pending" || order.status === "pending_payment") && (
                          <label className="flex-1 md:flex-none bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-sm text-center cursor-pointer hover:bg-orange-700 transition shadow-sm hover:shadow-md">
                            Upload Bukti
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && handleUploadPayment(order.id, e.target.files[0])} />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* === BAGIAN DETAIL YANG DIUBAH === */}
                    {selectedOrder === order.id && (
                      <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-dashed border-gray-300 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Info size={18} className="text-blue-500" /> Detail Transaksi
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Kiri: Tanggal & ID */}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase">Tanggal Pemesanan</p>
                              <p className="text-gray-800 font-semibold">{new Date(order.created_at).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase">Alamat Pengiriman</p>
                              <p className="text-gray-800 font-medium text-sm mt-1">
                                {/* Sesuaikan field alamat dengan DB Anda */}
                                {order.shipping_address || "Sesuai alamat profil user"}
                              </p>
                            </div>
                          </div>

                          {/* Kanan: Status Pembayaran */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard size={18} className="text-gray-500" />
                              <p className="text-xs text-gray-500 font-bold uppercase">Status Pembayaran</p>
                            </div>
                            <p className={`text-lg font-bold ${status.color.replace("bg-", "text-").replace("100", "600")}`}>{status.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{order.payment_method || "Transfer Bank"}</p>
                          </div>
                        </div>

                        {/* KONFIRMASI PENGIRIMAN - INFO BOX */}
                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
                            <Phone size={20} />
                          </div>
                          <div>
                            <h5 className="font-bold text-blue-800 text-sm">Konfirmasi Pengiriman</h5>
                            <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                              Terima kasih telah berbelanja! Admin kami akan segera menghubungi Anda melalui
                              <span className="font-bold"> WhatsApp / Email</span> untuk mengonfirmasi detail pengiriman dan nomor resi.
                            </p>
                            <p className="text-xs text-blue-500 mt-2">Mohon pastikan nomor telepon di profil Anda aktif.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* === END DETAIL === */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
