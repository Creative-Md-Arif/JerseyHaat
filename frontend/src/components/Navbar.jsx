import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCategories } from "../hooks/useCategories";

const trebuchet = {
  fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif",
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { clubs, loading: clubsLoading } = useCategories();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClubsDropdownOpen, setIsClubsDropdownOpen] = useState(false);
  const [isTypesDropdownOpen, setIsTypesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const clubsDropdownRef = useRef(null);
  const typesDropdownRef = useRef(null);
  const searchRef = useRef(null);

  const jerseyTypes = ["Home", "Away", "Third", "Retro"];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        clubsDropdownRef.current &&
        !clubsDropdownRef.current.contains(e.target)
      ) {
        setIsClubsDropdownOpen(false);
      }
      if (
        typesDropdownRef.current &&
        !typesDropdownRef.current.contains(e.target)
      ) {
        setIsTypesDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsClubsDropdownOpen(false);
    setIsTypesDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      style={trebuchet}
      className={`w-full uppercase transition-all duration-300 ${
        isScrolled
          ? "bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="section-container px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-cream hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1
              className="font-serif gold-text-gradient tracking-wide uppercase"
              style={{ fontSize: "clamp(1.25rem, 5vw, 1.875rem)" }}
            >
              JerseyHaat 
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            style={{ fontSize: "clamp(0.75rem, 0.9vw, 0.875rem)" }}
          >
            <Link
              to="/"
              className={`font-medium uppercase tracking-wider transition-colors hover:text-gold ${isActive("/") ? "text-gold" : "text-cream"}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-medium uppercase tracking-wider transition-colors hover:text-gold ${isActive("/shop") ? "text-gold" : "text-cream"}`}
            >
              Shop
            </Link>

            {/* Clubs Dropdown */}
            <div className="relative" ref={clubsDropdownRef}>
              <button
                onClick={() => setIsClubsDropdownOpen(!isClubsDropdownOpen)}
                className={`flex items-center gap-1 font-medium uppercase tracking-wider transition-colors hover:text-gold ${isActive("/club") ? "text-gold" : "text-cream"}`}
              >
                Clubs
                <svg
                  className={`w-4 h-4 transition-transform ${isClubsDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isClubsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-dark-2 border border-dark-3 rounded-lg shadow-xl shadow-black/30 py-2 animate-fade-in">
                  {clubsLoading ? (
                    <div className="px-4 py-2 text-text-muted text-sm normal-case">
                      Loading clubs...
                    </div>
                  ) : (
                    clubs.map((club) => (
                      <Link
                        key={club._id}
                        to={`/club/${club.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm uppercase tracking-wide text-cream hover:bg-dark-3 hover:text-gold transition-colors"
                      >
                        {club.logo ? (
                          <img
                            src={club.logo}
                            alt=""
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: club.color || "#c9a84c" }}
                          />
                        )}
                        <span>{club.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Jersey Types Dropdown */}
            <div className="relative" ref={typesDropdownRef}>
              <button
                onClick={() => setIsTypesDropdownOpen(!isTypesDropdownOpen)}
                className={`flex items-center gap-1 font-medium uppercase tracking-wider transition-colors hover:text-gold ${isActive("/type") ? "text-gold" : "text-cream"}`}
              >
                Jersey Types
                <svg
                  className={`w-4 h-4 transition-transform ${isTypesDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isTypesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-dark-2 border border-dark-3 rounded-lg shadow-xl shadow-black/30 py-2 animate-fade-in">
                  {jerseyTypes.map((type) => (
                    <Link
                      key={type}
                      to={`/shop?type=${type}`}
                      className="block px-4 py-2.5 text-sm uppercase tracking-wide text-cream hover:bg-dark-3 hover:text-gold transition-colors"
                    >
                      {type} Jerseys
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop?filter=new"
              className={`font-medium uppercase tracking-wider transition-colors hover:text-gold ${location.search.includes("filter=new") ? "text-gold" : "text-cream"}`}
            >
              New Arrivals
            </Link>
            <Link
              to="/shop?filter=bestsellers"
              className={`font-medium uppercase tracking-wider transition-colors hover:text-gold ${location.search.includes("filter=bestsellers") ? "text-gold" : "text-cream"}`}
            >
              Best Sellers
            </Link>
            <Link
              to="/shop?filter=sale"
              className={`font-medium uppercase tracking-wider transition-colors hover:text-gold ${location.search.includes("filter=sale") ? "text-gold" : "text-cream"}`}
            >
              Sale
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 sm:p-2 text-cream hover:text-gold transition-colors"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              {isSearchOpen && (
                <form
                  onSubmit={handleSearch}
                  className="absolute right-0 top-full mt-2 animate-fade-in"
                  style={{ width: "min(18rem, calc(100vw - 1.5rem))" }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jerseys..."
                    className="input-field w-full normal-case"
                    autoFocus
                  />
                </form>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-cream hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-dark-2 border-t border-dark-3 animate-fade-in">
          <div className="section-container px-3 sm:px-4 py-4 space-y-1">
            <Link
              to="/"
              className={`block py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/") ? "bg-dark-3 text-gold" : "text-cream hover:bg-dark-3"}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`block py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${isActive("/shop") ? "bg-dark-3 text-gold" : "text-cream hover:bg-dark-3"}`}
            >
              Shop
            </Link>

            {/* Mobile Clubs */}
            <div className="px-4 py-2">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Clubs
              </p>
              {clubsLoading ? (
                <p className="text-sm text-text-muted normal-case">
                  Loading...
                </p>
              ) : (
                <div className="space-y-1">
                  {clubs.map((club) => (
                    <Link
                      key={club._id}
                      to={`/club/${club.slug}`}
                      className="block py-2 text-sm uppercase tracking-wide text-cream hover:text-gold transition-colors"
                    >
                      {club.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Jersey Types */}
            <div className="px-4 py-2">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Jersey Types
              </p>
              <div className="space-y-1">
                {jerseyTypes.map((type) => (
                  <Link
                    key={type}
                    to={`/shop?type=${type}`}
                    className="block py-2 text-sm uppercase tracking-wide text-cream hover:text-gold transition-colors"
                  >
                    {type} Jerseys
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/shop?filter=new"
              className="block py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wider text-cream hover:bg-dark-3 transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              to="/shop?filter=bestsellers"
              className="block py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wider text-cream hover:bg-dark-3 transition-colors"
            >
              Best Sellers
            </Link>
            <Link
              to="/shop?filter=sale"
              className="block py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wider text-cream hover:bg-dark-3 transition-colors"
            >
              Sale
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
