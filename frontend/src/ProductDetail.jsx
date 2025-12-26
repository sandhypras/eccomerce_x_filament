import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import homeProducts from "../data/homeProducts";
import "./ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();

    const product = homeProducts.find((item) => item.id === Number(id));

    if (!product) {
        return <h2 style={{ padding: "40px" }}>Produk tidak ditemukan</h2>;
    }

    return (
        <>
            <Navbar />

            <section className="product-detail">
                <div className="detail-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="detail-info">
                    <h1>{product.name}</h1>
                    <p className="detail-price">{product.price}</p>

                    <p className="detail-desc">
                        Produk berkualitas tinggi dengan performa terbaik dan
                        dukungan layanan profesional.
                    </p>

                    <button className="btn-primary">Add to Cart</button>
                </div>
            </section>

            <Footer />
        </>
    );
}
