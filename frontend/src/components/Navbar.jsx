import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, X, Menu, Home, Info, Package, MapPin, ChevronDown, Loader2, PackageOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // UI State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileDropdown(false);
  }, [location]);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
    logout();
    navigate("/");
  };

  // Search API Integration
  useEffect(() => {
    const searchFromApi = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowSearchDropdown(true);

      try {
        const response = await fetch(`http://localhost:8000/api/products?search=${searchQuery}`);
        const data = await response.json();

        let productsData = [];
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          productsData = data.data;
        }

        setSearchResults(productsData.slice(0, 5));
      } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchFromApi, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleSearchResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchDropdown(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Beranda", path: "/", icon: <Home size={18} /> },
    { name: "Produk", path: "/products", icon: <Package size={18} /> },
    { name: "Tentang", path: "/about", icon: <Info size={18} /> },
    { name: "Lokasi", path: "/location", icon: <MapPin size={18} /> },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* LOGO & DESKTOP MENU */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-orange-600 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform">
              <PackageOpen size={24} />
            </div>
            <span className="font-bold text-2xl text-gray-800 tracking-tight hidden lg:block">
              Toko<span className="text-orange-600">Ku</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === link.path ? "text-orange-600 bg-orange-50" : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* LIVE SEARCH BAR */}
        <div className="flex-1 max-w-lg relative mx-4 hidden sm:block" ref={searchContainerRef}>
          <div
            className={`flex items-center w-full bg-gray-100 border transition-all rounded-full px-4 py-2
            ${showSearchDropdown ? "border-orange-500 ring-2 ring-orange-100 bg-white" : "border-transparent"}`}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari produk di database..."
              className="bg-transparent w-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
            />
            {isSearching && <Loader2 size={16} className="animate-spin text-orange-500" />}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in duration-200">
              {!isSearching && searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase">Hasil Pencarian</div>
                  {searchResults.map((product) => (
                    <div key={product.id} onClick={() => handleSearchResultClick(product.id)} className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors">
                      <img src={product.image_url || `https://via.placeholder.com/40?text=${product.name}`} alt={product.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-orange-600 font-bold">{formatRupiah(product.price)}</p>
                      </div>
                    </div>
                  ))}
                  <Link to={`/products?search=${searchQuery}`} onClick={() => setShowSearchDropdown(false)} className="block text-center py-2 text-xs text-gray-500 hover:text-orange-600 border-t">
                    Lihat semua hasil
                  </Link>
                </div>
              ) : (
                !isSearching && <div className="p-6 text-center text-sm text-gray-500">Produk "{searchQuery}" tidak ditemukan.</div>
              )}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cart Button */}
          <button onClick={handleCartClick} className="p-2.5 relative text-gray-600 hover:text-orange-600 transition-colors" aria-label="Keranjang Belanja">
            <ShoppingCart size={22} />
            {isAuthenticated && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>}
          </button>

          {/* User Profile Dropdown */}
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all" aria-label="Menu Profil">
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">{isAuthenticated ? user.name.charAt(0).toUpperCase() : <User size={16} />}</div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Akun Saya</p>
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <Link to="/profile" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 transition-colors">
                      📱 Profil Saya
                    </Link>

                    <Link to="/MyOrders" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 transition-colors">
                      📦 Pesanan Saya
                    </Link>

                    {/* Logout */}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t transition-colors">
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <div className="p-2 space-y-1">
                    <Link to="/login" onClick={() => setShowProfileDropdown(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Masuk
                    </Link>
                    <Link to="/register" onClick={() => setShowProfileDropdown(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="p-4 space-y-4">
            {/* Search Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors">
                  <span className="text-orange-600">{link.icon}</span>
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* User Section Mobile */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Login sebagai</p>
                    <p className="font-bold text-gray-900">{user.name}</p>
                  </div>

                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    📱 Profil Saya
                  </Link>

                  <Link to="/MyOrders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">
                    📦 Pesanan Saya
                  </Link>

                  <button onClick={handleLogout} className="w-full p-3 text-center text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full p-3 text-center text-white bg-orange-600 font-bold rounded-xl hover:bg-orange-700 transition-colors">
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
