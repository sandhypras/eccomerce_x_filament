import "./ProductCard.css";

export default function ProductCard() {
    return (
        <div className="product-card">
            <div className="product-image" />
            <h4>Product Name</h4>
            <p className="price">Rp 9.999.999</p>

            <div className="product-actions">
                <button>Add to cart</button>
                <button className="detail">View detail</button>
            </div>
        </div>
    );
}
