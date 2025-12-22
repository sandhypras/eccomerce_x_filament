import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
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

            {/* CATEGORIES */}
            <section className="section">
                <h2 className="section-title">Categories</h2>
                <div className="category-grid">
                    <CategoryCard title="Laptop" />
                    <CategoryCard title="Printer" />
                    <CategoryCard title="Komputer" />
                    <CategoryCard title="CCTV" />
                    <CategoryCard title="Networking" />
                    <CategoryCard title="Accesoris" />
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="section">
                <h2 className="section-title">Produk Unggulan</h2>
                <div className="product-grid">
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </div>
            </section>

            <Footer />
        </>
    );
}
