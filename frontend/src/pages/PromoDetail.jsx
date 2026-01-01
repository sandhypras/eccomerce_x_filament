import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import promoData from "../data/promoData";
import "./PromoDetail.css";

export default function PromoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const promo = promoData.find(item => item.id === Number(id));

    if (!promo) {
        return (
            <>
                <Navbar />
                <div className="promo-notfound">
                    <h2>Promo tidak ditemukan</h2>
                    <Link to="/" className="btn-back-home">
                        ⬅ Kembali ke Home
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    // 🔥 HANDLE CART
    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ ...promo, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Produk berhasil ditambahkan ke keranjang");
    };

    return (
        <>
            <Navbar />

            {/* HERO */}
            <section className="promo-hero">
                <h1>{promo.title}</h1>
                <span className="promo-badge">Diskon {promo.discount}</span>
            </section>

            {/* DETAIL */}
            <section className="promo-wrapper">
                <div className="promo-container">

                    {/* IMAGE */}
                    <div className="promo-image">
                        <img src={promo.image} alt={promo.title} />
                    </div>

                    {/* INFO */}
                    <div className="promo-info">
                        <h2>{promo.title}</h2>

                        <p className="promo-desc">{promo.description}</p>

                        <div className="promo-price">
                            <span className="old-price">
                                Rp {promo.priceBefore.toLocaleString("id-ID")}
                            </span>
                            <span className="new-price">
                                Rp {promo.priceAfter.toLocaleString("id-ID")}
                            </span>
                        </div>

                        <ul className="promo-feature">
                            <li>✔ Produk Original & Bergaransi</li>
                            <li>✔ Promo Terbatas</li>
                            <li>✔ Pengiriman Aman</li>
                        </ul>

                        <div className="promo-action">
                            <button
                                className="btn-cart"
                                onClick={handleAddToCart}
                            >
                                🛒 Tambah ke Keranjang
                            </button>

                            <button
                                className="btn-buy"
                                onClick={() => navigate("/")}
                            >
                                ⚡ Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🔥 BACK BUTTON RAPI */}
                <div className="back-wrapper">
                    <Link to="/" className="btn-back-home">
                        ⬅ Kembali ke Home
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
