// src/components/Carousel.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default slides jika tidak ada data
  const defaultSlides = [
    {
      id: 1,
      color: "#3498db",
      title: "Welcome to Our Store",
    },
    {
      id: 2,
      color: "#e74c3c",
      title: "Latest Products",
    },
    {
      id: 3,
      color: "#2ecc71",
      title: "Special Offers",
    },
  ];

  const displaySlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displaySlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  return (
    <div style={styles.carousel}>
      {/* Slides */}
      <div style={styles.slidesContainer}>
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              ...styles.slide,
              opacity: index === currentSlide ? 1 : 0,
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            {slide.image ? (
              <img src={slide.image} alt={slide.title || `Slide ${index + 1}`} style={styles.slideImage} />
            ) : (
              <div style={{ ...styles.slideColor, backgroundColor: slide.color || "#999" }}>
                <h2 style={styles.slideTitle}>{slide.title || `Slide ${index + 1}`}</h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button onClick={prevSlide} style={{ ...styles.navButton, left: "20px" }} type="button">
        <ChevronLeft size={32} />
      </button>

      {/* Next Button */}
      <button onClick={nextSlide} style={{ ...styles.navButton, right: "20px" }} type="button">
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div style={styles.indicators}>
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            type="button"
            style={{
              ...styles.indicator,
              backgroundColor: index === currentSlide ? "white" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  carousel: {
    position: "relative",
    width: "100%",
    height: "400px",
    overflow: "hidden",
    backgroundColor: "#999",
  },
  slidesContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  slide: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "all 0.5s ease-in-out",
  },
  slideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  slideColor: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  slideTitle: {
    color: "white",
    fontSize: "48px",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s",
    zIndex: 10,
  },
  indicators: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
    zIndex: 10,
  },
  indicator: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "background-color 0.3s",
  },
};

export default Carousel;
