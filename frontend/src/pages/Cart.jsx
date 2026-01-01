import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-container">
      <h1>Keranjang</h1>

      {cart.length === 0 ? (
        <p>Keranjang masih kosong</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Qty: {item.qty}</p>
                <p>Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}

          <h3>Total: Rp {total.toLocaleString("id-ID")}</h3>
          <button onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
