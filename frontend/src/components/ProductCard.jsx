export default function ProductCard({ product }) {
  return (
    <div className="border p-3 rounded">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category?.name}</p>
      <p className="font-bold mt-2">Rp {product.price}</p>
    </div>
  );
}
