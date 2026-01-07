import { useState } from "react";
import api from "../api/axios";

export default function UploadPayment() {
  const [file, setFile] = useState(null);
  const [orderId, setOrderId] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("payment_proof", file);

    await api.post(`/orders/${orderId}/upload-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Bukti pembayaran berhasil diupload");
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Upload Bukti Pembayaran</h2>

      <form onSubmit={submit} className="space-y-3">
        <input type="text" placeholder="Order ID" className="border p-2 w-full" value={orderId} onChange={(e) => setOrderId(e.target.value)} />

        <input type="file" className="border p-2 w-full" onChange={(e) => setFile(e.target.files[0])} />

        <button className="bg-blue-600 text-white px-4 py-2">Upload</button>
      </form>
    </div>
  );
}
