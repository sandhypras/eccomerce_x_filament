import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo - Warna Oranye ELS */}
          <Link to="/" className="text-2xl font-black italic shrink-0 text-[#f28d1a]">
            LOGO
          </Link>

          {/* Search Bar - Border Oranye */}
          <div className="flex-1 max-w-lg relative group">
            <input type="text" placeholder="Cari produk..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-5 focus:ring-2 focus:ring-[#f28d1a] focus:border-[#f28d1a] transition-all outline-none text-sm" />
            <Search className="absolute right-4 top-2.5 text-gray-400 size-4 group-hover:text-[#f28d1a]" />
          </div>

          {/* Icons - Hover Oranye */}
          <div className="flex items-center gap-5 shrink-0">
            <User className="cursor-pointer hover:text-[#f28d1a] transition-colors" size={22} />
            <div className="relative cursor-pointer hover:text-[#f28d1a] transition-colors">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-[#f28d1a] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </div>
          </div>
        </div>

        {/* Link Navigasi - Hover Oranye */}
        <nav className="flex justify-center gap-10 mt-5 border-t pt-4">
          {["Home", "About Us", "Product", "Location"].map((item) => (
            <Link key={item} to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-[#f28d1a] transition-colors">
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
