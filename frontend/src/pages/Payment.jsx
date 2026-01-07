import { useParams } from "react-router-dom";
import UploadPayment from "./UploadPayment";

export default function Payment() {
  const { orderId } = useParams();

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Upload Bukti Pembayaran</h1>
      <UploadPayment orderId={orderId} />
    </div>
  );
}
