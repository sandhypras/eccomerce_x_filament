import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import homeProducts from "../data/homeProduct";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = homeProducts.find(
    (item) => item.id === parseInt(id)
  );

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="detail-notfound">
          <h2>Produk tidak ditemukan</h2>
          <Link to="/" className="btn-back">Kembali ke Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  /* =========================
     TAMBAHAN LOGIC DI SINI
     ========================= */

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} berhasil ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    // pastikan produk masuk cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === product.id);

    if (!exists) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    const isLogin = localStorage.getItem("isLogin");

    if (!isLogin) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  /* ========================= */

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="detail-hero">
        <h1>{product.name}</h1>
        <p>{product.category}</p>
      </section>

      {/* DETAIL */}
      <section className="detail-wrapper">
        <div className="detail-container">

          {/* LEFT IMAGE */}
          <div className="detail-image">
            {product.popular && <span className="badge-popular">Popular</span>}
            <img src={product.image} alt={product.name} />
          </div>

          {/* RIGHT INFO */}
          <div className="detail-info">
            <h2>{product.name}</h2>
            <p className="detail-price">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <div className="detail-rating">⭐ 4.8 / 5</div>

            <div className="detail-box">
              <h4>Deskripsi Produk</h4>
              <p>
                Produk elektronik berkualitas tinggi dengan desain modern dan
                performa optimal. Cocok untuk kebutuhan rumah tangga maupun bisnis.
              </p>
            </div>

            <div className="detail-box">
              <h4>Spesifikasi</h4>
              <table className="spec-table">
                <tbody>
                  <tr>
                    <td>Merek</td>
                    <td>{product.name.split(" ")[0]}</td>
                  </tr>
                  <tr>
                    <td>Kategori</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Garansi</td>
                    <td>Resmi 1 Tahun</td>
                  </tr>
                  <tr>
                    <td>Kondisi</td>
                    <td>Baru</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ACTION BUTTON */}
            <div className="detail-actions">
              <button className="btn-cart" onClick={handleAddToCart}>
                Tambah ke Keranjang
              </button>

              <button className="btn-buy" onClick={handleBuyNow}>
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="related">
        <h2 className="related-title">Produk Terkait</h2>

        <div className="related-grid">
          {homeProducts
            .filter(
              (item) =>
                item.category === product.category &&
                item.id !== product.id
            )
            .slice(0, 3)
            .map((item) => (
              <Link
                to={`/product/${item.id}`}
                className="related-card"
                key={item.id}
              >
                <div className="related-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <h4>{item.name}</h4>
                <p>Rp {item.price.toLocaleString("id-ID")}</p>
              </Link>
            ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
