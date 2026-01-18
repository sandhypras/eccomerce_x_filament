// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus, Heart, Share2, Package, Shield, Truck } from "lucide-react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
    fetchOtherProducts();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);

      // Fetch related products from same category
      if (response.data.category_id) {
        fetchRelatedProducts(response.data.category_id);
      } else {
        setLoadingRelated(false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Gagal memuat produk");
      setLoadingRelated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      setLoadingRelated(true);
      const response = await axiosInstance.get(`/products?category_id=${categoryId}&limit=4`);
      console.log("Related products response:", response.data);

      // Handle different response formats
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      }

      // Filter out current product
      const filtered = products.filter((p) => p.id !== parseInt(id));
      console.log("Filtered related products:", filtered);
      setRelatedProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const fetchOtherProducts = async () => {
    try {
      setLoadingOther(true);
      const response = await axiosInstance.get(`/products?limit=8`);
      console.log("Other products response:", response.data);

      // Handle different response formats
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        products = response.data.products;
      }

      // Filter out current product
      const filtered = products.filter((p) => p.id !== parseInt(id));
      console.log("Filtered other products:", filtered);
      setOtherProducts(filtered.slice(0, 8));
    } catch (error) {
      console.error("Error fetching other products:", error);
    } finally {
      setLoadingOther(false);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      // Add to cart first
      await axiosInstance.post("/cart", {
        product_id: product.id,
        quantity: quantity,
      });

      // Navigate directly to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Gagal memproses pesanan");
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Produk tidak ditemukan"}</p>
          <button onClick={() => navigate(-1)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition-colors">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image_url || product.image];
  const currentImage = images[selectedImage] || product.image_url || (product.image ? `http://localhost:8000/storage/${product.image}` : null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-6 font-medium transition-colors">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-xl">No Image</span>
                  </div>
                )}

                <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : "text-gray-600"} />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-orange-500" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              {/* Category & Share */}
              <div className="flex items-center justify-between">
                {product.category && <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded">{product.category.name}</span>}
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors">
                  <Share2 size={18} />
                  <span className="text-sm font-medium">Bagikan</span>
                </button>
              </div>

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>

              {/* Price */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-3xl font-bold text-orange-600">Rp {Number(product.price).toLocaleString("id-ID")}</p>
              </div>

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <Package size={18} />
                    <span>Stok tersedia: {product.stock}</span>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm font-medium">Stok habis</div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4 py-3 border-y border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Shield size={18} className="text-blue-600" />
                  <span>Garansi Resmi</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Truck size={18} className="text-green-600" />
                  <span>Gratis Ongkir</span>
                </div>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">Jumlah:</span>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[40px] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {product.stock > 0 && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} />
                    <span>{addingToCart ? "Menambahkan..." : "Keranjang"}</span>
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Beli Sekarang
                  </button>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url || (item.image ? `http://localhost:8000/storage/${item.image}` : "https://via.placeholder.com/300")}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    {item.category && <span className="text-xs font-medium text-orange-600">{item.category.name}</span>}
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-lg font-bold text-orange-600">Rp {Number(item.price).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Products */}
        {otherProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Produk Lainnya</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherProducts.map((item) => (
                <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url || (item.image ? `http://localhost:8000/storage/${item.image}` : "https://via.placeholder.com/300")}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    {item.category && <span className="text-xs font-medium text-orange-600">{item.category.name}</span>}
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">{item.name}</h3>
                    <p className="text-lg font-bold text-orange-600">Rp {Number(item.price).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
