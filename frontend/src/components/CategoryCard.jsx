import { Link } from "react-router-dom";
import "./CategoryCard.css";

export default function CategoryCard({ title, active, onClick }) {
  if (title === "All") {
    return (
      <div
        className={`category-card ${active ? "active" : ""}`}
        onClick={onClick}
      >
        <h3>{title}</h3>
        <p>Lihat semua produk</p>
      </div>
    );
  }

  return (
    <Link to={`/category/${title}`} className="category-link">
      <div className="category-card">
        <h3>{title}</h3>
        <p>Lihat produk</p>
      </div>
    </Link>
  );
}