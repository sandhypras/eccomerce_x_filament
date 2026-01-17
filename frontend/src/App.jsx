// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import CategoryProducts from "./pages/CategoryProducts";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import { Component } from "react";
import Products from "./pages/Products";
import Location from "./pages/Location";
import Footer from "./components/Footer";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetail";
import Profile from "./pages/Profile";
// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "#e74c3c", marginBottom: "20px" }}>Terjadi Kesalahan</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>{this.state.error?.message || "Silakan refresh halaman"}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Refresh Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Layout Component with conditional Navbar
function AppLayout() {
  const location = useLocation();

  // Daftar path yang tidak memerlukan Navbar
  const noNavbarRoutes = ["/login", "/register", "/login-otp"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/location" element={<Location />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/MyOrders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
