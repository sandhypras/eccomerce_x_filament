// src/pages/Home.jsx
import Carousel from "../components/Carousel";
import CategorySection from "../components/CategorySection";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Carousel Section */}
      <Carousel />

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Products Section (Optional) */}
      <div style={styles.featuredSection}>
        <div style={styles.featuredGrid}>
          {[1, 2, 3].map((item) => (
            <div key={item} style={styles.featuredCard}>
              <div style={styles.featuredImage}></div>
              <div style={styles.featuredContent}>
                <h3 style={styles.featuredTitle}>Judul {item}</h3>
                <p style={styles.featuredText}>Tembahan sekolah teks ini</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>FOOTER</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  featuredSection: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  featuredCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  featuredImage: {
    width: "100%",
    height: "200px",
    backgroundColor: "#bbb",
  },
  featuredContent: {
    padding: "20px",
  },
  featuredTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  featuredText: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
  },
  footer: {
    backgroundColor: "#999",
    padding: "60px 20px",
    marginTop: "40px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  footerText: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
  },
};

export default Home;
