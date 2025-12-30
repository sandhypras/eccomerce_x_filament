import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`} className="product-link">
            <div className="product-card">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-body">
                    <h4>{product.name}</h4>
                    <p className="price">{product.price}</p>

                    <button className="btn-primary">Add to cart</button>
                </div>
            </div>
        </Link>
    );
}
