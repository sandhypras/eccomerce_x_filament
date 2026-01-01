import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            {/* BADGE POPULAR */}
            {product.popular && <span className="badge-popular">Popular</span>}

            {/* GAMBAR */}
            <img
                src={product.image}
                alt={product.name}
                className="product-image"
            />

            {/* NAMA */}
            <h3 className="product-name">{product.name}</h3>

            {/* RATING */}
            <div className="product-rating">⭐ {product.rating}</div>

            {/* HARGA */}
            <p className="price">Rp {product.price.toLocaleString("id-ID")}</p>

            {/* ACTION */}
            <div className="actions">
                <button className="btn-cart">Add to Cart</button>

                <Link to={`/product/${product.id}`} className="btn-detail">
                    View Detail
                </Link>
            </div>
        </div>
    );
}
