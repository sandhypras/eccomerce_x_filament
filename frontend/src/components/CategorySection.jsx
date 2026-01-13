// src/components/CategorySection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await axiosInstance.get("/categories");

      // Handle berbagai format response
      let categoriesData = [];

      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (response.data.categories && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      } else {
        console.error("Unexpected API response format:", response.data);
        categoriesData = [];
      }

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>CATEGORIES</h2>
        <div style={styles.grid}>
          {[...Array(6)].map((_, index) => (
            <div key={index} style={styles.skeletonCard}>
              <div style={styles.skeletonCircle}></div>
              <div style={styles.skeletonText}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>CATEGORIES</h2>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Gagal memuat kategori: {error}</p>
          <button onClick={fetchCategories} style={styles.retryButton}>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>CATEGORIES</h2>
      {!Array.isArray(categories) || categories.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Belum ada kategori</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} style={styles.categoryCard} onClick={() => handleCategoryClick(category.id)}>
              <div style={styles.imageWrapper}>
                {category.image_url ? (
                  <>
                    <img
                      src={category.image_url}
                      alt={category.name}
                      style={styles.image}
                      onError={(e) => {
                        console.error("Failed to load image:", category.image_url);
                        e.target.style.display = "none";
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = "flex";
                        }
                      }}
                      onLoad={(e) => {
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = "none";
                        }
                      }}
                    />
                    <div
                      style={{
                        ...styles.placeholder,
                        display: "none",
                      }}
                    >
                      {category.name ? category.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  </>
                ) : (
                  <div style={styles.placeholder}>{category.name ? category.name.charAt(0).toUpperCase() : "?"}</div>
                )}
              </div>
              <p style={styles.categoryName}>{category.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "30px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  categoryCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  imageWrapper: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#bbb",
    marginBottom: "15px",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#999",
  },
  categoryName: {
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#333",
    textAlign: "center",
  },
  skeletonCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  skeletonCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    marginBottom: "15px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonText: {
    width: "80px",
    height: "16px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#fee",
    borderRadius: "8px",
  },
  errorText: {
    fontSize: "16px",
    color: "#e74c3c",
    marginBottom: "20px",
  },
  retryButton: {
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#999",
  },
};

// Add CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
if (!document.querySelector('style[data-component="category-section"]')) {
  styleSheet.setAttribute("data-component", "category-section");
  document.head.appendChild(styleSheet);
}

export default CategorySection;
