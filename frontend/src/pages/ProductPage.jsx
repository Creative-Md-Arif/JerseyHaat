import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import ImageWithFallback from "../components/ImageWithFallback";
import SizeGuide from "../components/SizeGuide";
import ProductCard from "../components/ProductCard";
import { useProductDetail } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";

const trebuchet = {
  fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif",
};

const badgeColors = {
  NEW: "bg-green-600",
  HOT: "bg-red-600",
  SALE: "bg-gold",
  LIMITED: "bg-purple-600",
  RETRO: "bg-blue-600",
};

const FixedNav = () => (
  <div className="fixed top-0 left-0 right-0 z-50">
    <Navbar />
  </div>
);

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, relatedProducts, loading, error } = useProductDetail(slug);
  const { addToCart, setIsCartOpen } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setActiveImageIndex(0);
    setFormError("");
  }, [slug]);

  if (loading) {
    return (
      <div style={trebuchet} className="min-h-screen bg-dark">
        <FixedNav />
        <CartSidebar />
        <div className="section-container px-3 sm:px-4 lg:px-6 pt-24 lg:pt-28 pb-12">
          <div className="animate-pulse grid md:grid-cols-2 gap-6 lg:gap-8">
            <div className="aspect-[3/4] bg-dark-2 border border-dark-3 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-dark-2 rounded w-3/4" />
              <div className="h-6 bg-dark-2 rounded w-1/2" />
              <div className="h-4 bg-dark-2 rounded w-full" />
              <div className="h-4 bg-dark-2 rounded w-full" />
              <div className="h-12 bg-dark-2 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={trebuchet} className="min-h-screen bg-dark flex flex-col">
        <FixedNav />
        <CartSidebar />
        <div className="flex-1 section-container px-3 sm:px-4 lg:px-6 pt-24 lg:pt-28 pb-20 text-center">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-text-muted/50 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h2 className="font-serif text-2xl text-cream mb-2 uppercase tracking-wide">
            Product Not Found
          </h2>
          <p className="text-text-muted mb-6">
            The jersey you are looking for does not exist.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse All Jerseys
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const club = product.club || {};
  const images = product.images?.length > 0 ? product.images : [];
  const sizes = product.sizes || ["S", "M", "L", "XL", "XXL"];
  const colors = product.colors || [];
  const maxQty = product.stock > 0 ? product.stock : 1;

  const handleAddToCart = () => {
    setFormError("");
    if (!selectedSize) {
      setFormError("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      setFormError("Please select a color");
      return;
    }
    if (quantity > product.stock) {
      setFormError(`Only ${product.stock} items available`);
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  const getStockStatus = () => {
    if (product.stock === 0)
      return { label: "Out of Stock", color: "text-danger" };
    if (product.stock <= 5)
      return {
        label: `Low Stock - Only ${product.stock} left`,
        color: "text-warning",
      };
    return {
      label: `In Stock (${product.stock} available)`,
      color: "text-green-500",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div style={trebuchet} className="min-h-screen bg-dark flex flex-col">
      <FixedNav />
      <CartSidebar />

      <main className="flex-1 section-container px-3 sm:px-4 lg:px-6 pt-20 lg:pt-24 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link to="/shop" className="hover:text-gold transition-colors">
            Shop
          </Link>
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {club.name && (
            <>
              <Link
                to={`/club/${club.slug}`}
                className="hover:text-gold transition-colors"
              >
                {club.name}
              </Link>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
          <span className="text-cream line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-dark-2 border border-dark-3">
              <ImageWithFallback
                src={images[activeImageIndex] || ""}
                alt={product.name}
                clubName={club.name}
                type={product.type}
                color={club.color}
                className="w-full h-full"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === activeImageIndex
                        ? "border-gold"
                        : "border-dark-3 hover:border-gold/50"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      clubName={club.name}
                      type={product.type}
                      color={club.color}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Club Info */}
            <div className="flex items-center gap-3 mb-3">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: club.color || "#c9a84c" }}
                />
              )}
              <div>
                <Link
                  to={`/club/${club.slug}`}
                  className="text-sm text-cream font-medium hover:text-gold transition-colors"
                >
                  {club.name}
                </Link>
                <p className="text-xs text-text-muted">
                  {club.league}
                  {club.country ? ` · ${club.country}` : ""}
                </p>
              </div>
            </div>

            {/* Product Name */}
            <div className="flex items-start gap-3 mb-2">
              <h1
                className="font-serif text-cream leading-tight uppercase tracking-wide"
                style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)" }}
              >
                {product.name}
              </h1>
              {product.badge && (
                <span
                  className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-bold ${badgeColors[product.badge] || "bg-gold"} text-white`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Type & Season */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-dark rounded-md text-sm text-gold font-medium border border-dark-3">
                {product.type}
              </span>
              {product.season && (
                <span className="text-sm text-text-muted">
                  Season: {product.season}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <span className="text-3xl font-bold text-gold">
                ৳{product.price?.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <span className="text-xl text-text-muted line-through">
                    ৳{product.oldPrice?.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 bg-green-600/20 text-green-500 rounded-lg text-sm font-medium">
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <p className={`text-sm font-medium mb-4 ${stockStatus.color}`}>
              {stockStatus.label}
            </p>

            <div className="border-t border-dark-3 my-6" />

            {/* Description */}
            <p className="text-text-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Form Error */}
            {formError && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                {formError}
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-cream">
                  Select Size
                </label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setFormError("");
                    }}
                    disabled={product.stock === 0}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-gold text-dark border-gold"
                        : "bg-dark text-cream border-dark-3 hover:border-gold/50"
                    } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <label className="text-sm font-medium text-cream mb-2 block">
                  Select Color {selectedColor && `- ${selectedColor}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setFormError("");
                      }}
                      disabled={product.stock === 0}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        selectedColor === color
                          ? "border-gold"
                          : "border-transparent hover:border-gold/50"
                      } ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl border border-dark-3 bg-dark text-cream hover:border-gold transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Decrease quantity"
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
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-10 text-center font-semibold text-cream text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="w-12 h-12 rounded-xl border border-dark-3 bg-dark text-cream hover:border-gold transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Increase quantity"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-dark-2 rounded-xl border border-dark-3">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-text-muted">
                  Authentic Quality
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-text-muted">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm text-text-muted">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm text-text-muted">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-dark-3">
            <h2
              className="font-serif text-cream mb-6 uppercase tracking-wide"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.875rem)" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp._id}
                  product={rp}
                  onOpenDetail={(p) => navigate(`/product/${p.slug}`)}
                  onQuickAdd={(p) => {
                    const defaultSize = p.sizes?.[0] || "M";
                    const defaultColor = p.colors?.[0] || "";
                    addToCart(p, defaultSize, defaultColor, 1);
                    setIsCartOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Size Guide Modal */}
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
};

export default ProductPage;
