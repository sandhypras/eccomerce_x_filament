import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import homeProducts from "../data/homeProduct";

export default function CategoryPage() {
    const { category } = useParams();

    const products = homeProducts.filter(
        (product) => product.category === category
    );

    return (
        <>
            <Navbar />

            <div style={{ padding: "60px 40px" }}>
                <h2>Kategori: {category}</h2>

                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>Tidak ada produk di kategori ini.</p>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
