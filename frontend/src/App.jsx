import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UploadPayment from "./pages/UploadPayment";
import ProductList from "./pages/ProductList"; // Import halaman baru
import ProtectedRoute from "../routes/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute untuk menampilkan produk berdasarkan ID kategori */}
        <Route path="/category/:id" element={<ProductList />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-payment/:orderId"
          element={
            <ProtectedRoute>
              <UploadPayment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
