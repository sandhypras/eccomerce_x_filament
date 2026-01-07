import { useState } from "react";
import axios from "../api/axios";

export default function UploadPayment() {
  const [file, setFile] = useState(null);
  const [orderId, setOrderId] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("payment_proof", file);

    await axios.post(`/orders/${orderId}/upload-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Bukti pembayaran berhasil dikirim");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="number" placeholder="Order ID" className="border p-2 w-full" onChange={(e) => setOrderId(e.target.value)} />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full" required />

      <button className="bg-orange-500 text-white px-4 py-2">Upload Bukti</button>
    </form>
  );
}
