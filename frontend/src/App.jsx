import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import PromoDetail from "./pages/PromoDetail"; 

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/promo/:id" element={<PromoDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    );
}
