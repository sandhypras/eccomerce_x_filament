import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";
import homeProducts from "../data/homeProducts";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
    const categories = [
        "All",
        "Laptop",
        "Printer",
        "Smartphone",
        "CCTV",
        "Networking",
        "Accesoris",
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");

    // FILTER PRODUK
    const filteredProducts = homeProducts.filter((product) => {
        const matchCategory =
            selectedCategory === "All" || product.category === selectedCategory;

        const matchSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <>
            <Navbar />

            {/* HERO */}
            <section className="hero">
                <h1>Solusi Elektronik & IT Terpercaya</h1>
                <p>
                    Menyediakan laptop, printer, dan perangkat teknologi terbaik
                    untuk kebutuhan bisnis dan personal.
                </p>
            </section>

            {/* SEARCH */}
            <section className="section">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </section>

            {/* CATEGORIES */}
            <section className="section">
                <h2 className="section-title">Categories</h2>

                <div className="category-grid">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat}
                            title={cat}
                            active={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
                        />
                    ))}
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="section">
                <h2 className="section-title">Produk {selectedCategory}</h2>

                <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>Tidak ada produk ditemukan.</p>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
