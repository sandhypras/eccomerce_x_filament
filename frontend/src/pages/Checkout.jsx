import React from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const navigate = useNavigate();

  const handlePay = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    alert("Pembayaran berhasil!");
    localStorage.removeItem("cart");
    navigate("/login"); // kembali ke Home setelah bayar
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Keranjang kosong</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-card">
            <div className="cart-image">
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
              />
              <span className="qty-badge">{item.qty}</span>
            </div>
            <div className="cart-info">
              <p className="item-name">{item.name}</p>
              <p className="item-price">
                Rp {(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}

      <div className="total-section">
        <h3>Total Belanja</h3>
        <p className="total-price">Rp {total.toLocaleString()}</p>
      </div>

      <button className="pay-button" onClick={handlePay}>
        Bayar Sekarang
      </button>
    </div>
  );
}

export default Checkout;
