import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ImageWithFallback from "./ImageWithFallback";
import SizeGuide from "./SizeGuide";

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

const ProductDetail = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [error, setError] = useState("");

  // BUG FIX: body scroll lock + Escape দিয়ে বন্ধ
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // product বদলালে selection reset
  useEffect(() => {
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setActiveImageIndex(0);
    setError("");
  }, [product?._id]);

  if (!product) return null;

  const club = product.club || {};
  const images = product.images?.length > 0 ? product.images : [];
  const sizes = product.sizes || ["S", "M", "L", "XL", "XXL"];
  const colors = product.colors || [];
  const relatedProducts = product.relatedProducts || [];
  const maxQty = product.stock > 0 ? product.stock : 1;

  const handleAddToCart = () => {
    setError("");
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      setError("Please select a color");
      return;
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`);
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
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
    <div
      style={trebuchet}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-2 border border-dark-3 rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-dark/80 backdrop-blur-sm rounded-lg text-cream hover:bg-dark hover:text-gold transition-colors"
          aria-label="Close"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
          {/* Image Gallery */}
          <div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-dark border border-dark-3">
              <ImageWithFallback
                src={images[activeImageIndex] || ""}
                alt={product.name}
                clubName={club.name}
                type={product.type}
                color={club.color}
                className="w-full h-full"
              />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    // BUG FIX: hover:border-dark-3 → hover:border-gold/50
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
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
          <div className="flex flex-col">
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
                <p className="text-sm text-cream font-medium">{club.name}</p>
                <p className="text-xs text-text-muted">
                  {club.league}
                  {club.country ? ` · ${club.country}` : ""}
                </p>
              </div>
            </div>

            {/* Product Name & Badge */}
            <div className="flex items-start gap-3 mb-2">
              <h1
                className="font-serif text-cream leading-tight uppercase tracking-wide"
                style={{ fontSize: "clamp(1.25rem, 4vw, 1.875rem)" }}
              >
                {product.name}
              </h1>
              {product.badge && (
                <span
                  className={`flex-shrink-0 px-2 py-1 rounded text-xs font-bold ${badgeColors[product.badge] || "bg-gold"} text-white`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Type & Season */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-dark rounded-md text-xs text-gold font-medium border border-dark-3">
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
              <span className="text-2xl font-bold text-gold">
                ৳{product.price?.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-text-muted line-through">
                    ৳{product.oldPrice?.toLocaleString()}
                  </span>
                  <span className="px-2 py-1 bg-green-600/20 text-green-500 rounded text-xs font-medium">
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

            {/* Description */}
            <p className="text-text-muted text-sm mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-cream">Size</label>
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
                      setError("");
                    }}
                    disabled={product.stock === 0}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
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
              <div className="mb-4">
                <label className="text-sm font-medium text-cream mb-2 block">
                  Color {selectedColor && `- ${selectedColor}`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setError("");
                      }}
                      disabled={product.stock === 0}
                      // simple hover: scale সরানো, শুধু border
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
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

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium text-cream mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                  className="w-10 h-10 rounded-lg border border-dark-3 bg-dark text-cream hover:border-gold transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <svg
                    className="w-4 h-4"
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
                <span className="w-12 text-center font-medium text-cream">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty || product.stock === 0}
                  className="w-10 h-10 rounded-lg border border-dark-3 bg-dark text-cream hover:border-gold transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <svg
                    className="w-4 h-4"
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
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-dark-3 p-4 sm:p-6 lg:p-8">
            <h3
              className="font-serif text-cream mb-4 uppercase tracking-wide"
              style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)" }}
            >
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/product/${rp.slug}`}
                  onClick={onClose}
                  className="group"
                >
                  {/* simple hover: scale সরানো, শুধু border */}
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-dark border border-dark-3 group-hover:border-gold/50 transition-colors mb-2">
                    <ImageWithFallback
                      src={rp.images?.[0] || ""}
                      alt={rp.name}
                      clubName={rp.club?.name}
                      type={rp.type}
                      color={rp.club?.color}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-text-muted">{rp.club?.name}</p>
                  <p className="text-sm font-medium text-cream line-clamp-1">
                    {rp.name}
                  </p>
                  <p className="text-sm text-gold font-medium">
                    ৳{rp.price?.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  );
};

export default ProductDetail;
