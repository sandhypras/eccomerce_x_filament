import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin"); // pastikan key sama dengan Login.jsx
  const location = useLocation();

  if (!isLogin) {
    // Simpan halaman asal di state
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
