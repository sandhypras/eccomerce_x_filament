import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import homeProducts from "../data/homeProduct";
import promoData from "../data/promoData";
import "./Home.css";

export default function Home() {
    const banners = [
        "/images/1banner.jpeg",
        "/images/2banner.jpeg",
    ];

    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % banners.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const categories = [
        { name: "Laptop", icon: "/icons/icon-laptop.png" },
        { name: "Kulkas", icon: "/icons/icon-kulkas.png" },
        { name: "Camera", icon: "/icons/icon-camera.png" },
        { name: "Smartphone", icon: "/icons/icon-hp.png" },
        { name: "Mouse", icon: "/icons/icon-mouse.png" },
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts =
        selectedCategory === "All"
            ? homeProducts
            : homeProducts.filter((item) => item.category === selectedCategory);

    return (
        <>
            <Navbar />

            {/*  HERO SLIDER  */}
            <section className="hero-slider">
                {banners.map((img, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${
                            index === activeSlide ? "active" : ""
                        }`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
            </section>

            {/*  CATEGORIES  */}
            <section className="section">
                <h2 className="section-title center">Categories</h2>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            className={`category-card ${
                                selectedCategory === cat.name ? "active" : ""
                            }`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            <img src={cat.icon} alt={cat.name} />
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/*  PROMO SALE  */}
            <section className="section">
                <h2 className="section-title center">Promo Sale</h2>
                <div className="promo-grid">
                    {promoData.map((promo) => (
                        <Link
                            to={`/promo/${promo.id}`}
                            className="promo-card"
                            key={promo.id}
                        >
                            <div className="promo-img">
                                <img src={promo.image} alt={promo.title} />
                            </div>
                            <div className="promo-info">
                                <h4>{promo.title}</h4>
                                <p>{promo.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/*  PRODUCTS  */}
            <section className="section">
                <h2 className="section-title center">
                    Products{" "}
                    {selectedCategory !== "All" && `- ${selectedCategory}`}
                </h2>

                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* REVIEWS  */}
            <section className="section review-section">
                <h2 className="section-title center">Customer Reviews</h2>

                <div className="review-grid">
                    <div className="review-card">
                        <div className="review-user">
                            <div className="avatar">A</div>
                            <div>
                                <strong>Andi Wijaya</strong>
                                <small>Verified Buyer</small>
                            </div>
                        </div>
                        <p>Produk original, pengiriman cepat dan aman.</p>
                    </div>

                    <div className="review-card">
                        <div className="review-user">
                            <div className="avatar">S</div>
                            <div>
                                <strong>Siti Rahma</strong>
                                <small>Verified Buyer</small>
                            </div>
                        </div>
                        <p>Pelayanan ramah dan produk sesuai.</p>
                    </div>

                    <div className="review-card">
                        <div className="review-user">
                            <div className="avatar">B</div>
                            <div>
                                <strong>Budi Santoso</strong>
                                <small>Verified Buyer</small>
                            </div>
                        </div>
                        <p>Harga oke, kualitas mantap.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
