export default function CategoryCircle({ category }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">{category.image ? <img src={category.image} className="w-full h-full rounded-full" /> : <span>{category.name[0]}</span>}</div>
      <p className="mt-2 text-sm">{category.name}</p>
    </div>
  );
}
