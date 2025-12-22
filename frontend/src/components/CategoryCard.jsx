import "./CategoryCard.css";

export default function CategoryCard({ title }) {
    return (
        <div className="category-card">
            <h3>{title}</h3>
            <p>Tambahkan sedikit teks isi</p>
        </div>
    );
}
