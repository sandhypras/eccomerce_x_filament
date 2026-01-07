import { useEffect, useState } from "react";
import api from "../api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Riwayat Pesanan</h1>

      {orders.map((o) => (
        <div key={o.id} className="border p-3 mb-2">
          <p>Invoice: {o.invoice_number}</p>
          <p>Status: {o.status}</p>
          <p>Total: {o.total_price}</p>
        </div>
      ))}
    </div>
  );
}
