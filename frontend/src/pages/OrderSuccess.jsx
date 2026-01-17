// src/pages/OrderSuccess.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, Package } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "50px 40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#d4edda",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
          }}
        >
          <CheckCircle size={48} color="#27ae60" />
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "15px",
          }}
        >
          Pesanan Berhasil!
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#7f8c8d",
            marginBottom: "10px",
            lineHeight: "1.6",
          }}
        >
          Terima kasih telah berbelanja di TokoKu!
        </p>

        {orderId && (
          <p
            style={{
              fontSize: "14px",
              color: "#95a5a6",
              marginBottom: "30px",
            }}
          >
            Order ID: <strong>#{orderId}</strong>
          </p>
        )}

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "15px",
            }}
          >
            Langkah Selanjutnya:
          </h3>
          <ul
            style={{
              fontSize: "14px",
              color: "#7f8c8d",
              lineHeight: "2",
              paddingLeft: "20px",
            }}
          >
            <li>Kami akan memverifikasi pembayaran Anda</li>
            <li>Pesanan akan diproses dalam 1-2 hari kerja</li>
            <li>Anda akan menerima notifikasi via email</li>
            <li>Pesanan akan dikirim ke alamat yang Anda berikan</li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: window.innerWidth < 500 ? "column" : "row",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              flex: 1,
              padding: "14px 20px",
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a252f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2c3e50")}
          >
            <Home size={20} />
            Kembali ke Home
          </button>

          <button
            onClick={() => navigate("/products")}
            style={{
              flex: 1,
              padding: "14px 20px",
              backgroundColor: "white",
              color: "#2c3e50",
              border: "2px solid #2c3e50",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2c3e50";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#2c3e50";
            }}
          >
            <Package size={20} />
            Belanja Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
