import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import homeProducts from "../data/homeProducts";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function CategoryPage() {
    const { category } = useParams();

    const products = homeProducts.filter(
        (product) => product.category === category
    );

    return (
        <>
            <Navbar />

            <section className="section">
                <h2 className="section-title">Kategori: {category}</h2>

                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>Tidak ada produk di kategori ini.</p>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
