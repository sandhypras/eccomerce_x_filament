// src/pages/Home.jsx
import Carousel from "../components/Carousel";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Carousel Section */}
        <Carousel />

        {/* Categories Section */}
        <CategorySection />

        {/* Featured Products Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
                alt: "Featured Product 1",
              },
              {
                image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop",
                alt: "Featured Product 2",
              },
              {
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=600&fit=crop",
                alt: "Featured Product 3",
              },
            ].map((item, index) => (
              <div key={index} className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="relative h-80 overflow-hidden">
                  <img src={item.image} alt={item.alt} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
