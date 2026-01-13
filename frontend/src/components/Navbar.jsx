import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, X, Menu, Home, Info, Package, MapPin, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock auth - ganti dengan useAuth() yang sebenarnya
  const isAuthenticated = false;
  const user = null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock search results
  const mockProducts = [
    { id: 1, name: "Smartphone XYZ", price: 5000000, image_url: null },
    { id: 2, name: "Laptop ABC", price: 8000000, image_url: null },
    { id: 3, name: "Headphone Premium", price: 1500000, image_url: null },
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        // Mock search
        setTimeout(() => {
          setSearchResults(mockProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
          setShowSearchResults(true);
          setIsSearching(false);
        }, 500);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu untuk mengakses keranjang");
      navigate("/login");
      return;
    }
    navigate("/cart");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/about", label: "About", icon: <Info size={18} /> },
    { to: "/products", label: "Products", icon: <Package size={18} /> },
    { to: "/location", label: "Location", icon: <MapPin size={18} /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg py-2" : "bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo with Animation */}
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl group">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-orange-600 text-xl">T</span>
              </div>
              <span className="hidden sm:block group-hover:text-orange-100 transition-colors">TokoKu</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-300 group">
                  <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-24 py-2.5 rounded-full border-2 border-white/30 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setShowSearchResults(false);
                      }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  )}

                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-full transition-colors">
                    <Search size={18} />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-6 text-center text-gray-500">
                      <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      Mencari...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package size={24} className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 mb-1">{product.name}</div>
                            <div className="text-orange-600 font-bold">Rp {Number(product.price).toLocaleString("id-ID")}</div>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        className="p-3 text-center text-orange-600 font-medium hover:bg-orange-50 cursor-pointer transition-colors"
                      >
                        Lihat semua hasil
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-gray-500">Tidak ada hasil ditemukan</div>
                  )}
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Cart Icon */}
              <button onClick={handleCartClick} className="relative p-2 hover:bg-white/20 rounded-full transition-all duration-300 group" title={isAuthenticated ? "Keranjang" : "Login untuk akses keranjang"}>
                <ShoppingCart size={24} className="text-white group-hover:scale-110 transition-transform" />
                {isAuthenticated && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">3</span>}
              </button>

              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-2 p-2 hover:bg-white/20 rounded-full transition-all duration-300 group">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <User size={20} className="text-orange-600" />
                  </div>
                  <ChevronDown size={16} className={`text-white hidden sm:block transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl min-w-48 overflow-hidden animate-fade-in">
                    {isAuthenticated ? (
                      <>
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                          <div className="font-bold text-gray-800">{user?.name || "User"}</div>
                          <div className="text-sm text-gray-600">{user?.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            /* handleLogout */
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors text-red-600 font-medium"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-3 hover:bg-orange-50 transition-colors text-gray-800 font-medium">
                          Login
                        </Link>
                        <Link to="/register" onClick={() => setShowProfileDropdown(false)} className="block px-4 py-3 hover:bg-orange-50 transition-colors text-gray-800 font-medium border-t border-gray-100">
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Menu size={24} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${mobileMenuOpen ? "opacity-50" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-64 bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Menu</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-6">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors text-gray-800">
                  <span className="text-orange-600">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className={scrolled ? "h-16" : "h-20"}></div>
    </>
  );
};

export default Navbar;
