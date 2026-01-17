import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import gambar1 from "../assets/gambarr.png";
import gambar2 from "../assets/gambar2.png";
import gambar3 from "../assets/gambar3.png";

const Carousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [customSlides, setCustomSlides] = useState([]);

  // Default slides dengan placeholder untuk gambar
  const defaultSlides = [
    {
      id: 1,
      color: "from-orange-500 to-amber-600",
      image: gambar1,
    },
    {
      id: 2,
      color: "from-red-500 to-pink-600",
      image: gambar2,
    },
    {
      id: 3,
      color: "from-green-500 to-emerald-600",
      image: gambar3,
    },
  ];

  const [editableSlides, setEditableSlides] = useState(defaultSlides);
  const displaySlides = slides.length > 0 ? slides : editableSlides;

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

  const handleImageUpload = (index, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSlides = [...editableSlides];
        newSlides[index] = {
          ...newSlides[index],
          image: reader.result,
        };
        setEditableSlides(newSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newSlides = [...editableSlides];
    newSlides[index] = {
      ...newSlides[index],
      image: null,
    };
    setEditableSlides(newSlides);
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative w-full h-full">
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            {slide.image ? (
              <div className="relative w-full h-full group">
                <img src={slide.image} alt={slide.title || `Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">{slide.title}</h2>
                    {slide.subtitle && (
                      <p className="text-lg md:text-2xl drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                {/* Remove Image Button */}
                {slides.length === 0 && (
                  <button onClick={() => removeImage(index)} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20" type="button">
                    <X size={20} />
                  </button>
                )}
              </div>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${slide.color} flex items-center justify-center relative group`}>
                <div className="text-center text-white px-4 z-10">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">{slide.title}</h2>
                  {slide.subtitle && (
                    <p className="text-lg md:text-2xl drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                {/* Upload Image Overlay */}
                {slides.length === 0 && (
                  <label htmlFor={`upload-${index}`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20">
                    <div className="text-center text-white">
                      <Upload size={48} className="mx-auto mb-3" />
                      <p className="text-lg font-semibold">Upload Gambar</p>
                      <p className="text-sm mt-1">Klik untuk menambahkan gambar</p>
                    </div>
                    <input id={`upload-${index}`} type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e)} className="hidden" />
                  </label>
                )}

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all z-30 group" type="button">
        <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Next Button */}
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all z-30 group" type="button">
        <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            type="button"
            className={`transition-all duration-300 ${index === currentSlide ? "w-8 h-3 bg-white rounded-full" : "w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full"}`}
          />
        ))}
      </div>

      {/* Upload Instructions (only shown when using default slides) */}
    </div>
  );
};

export default Carousel;
