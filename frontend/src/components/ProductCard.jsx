import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

const trebuchet = { fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" };

const badgeColors = {
  NEW: 'bg-green-600',
  HOT: 'bg-red-600',
  SALE: 'bg-gold',
  LIMITED: 'bg-purple-600',
  RETRO: 'bg-blue-600',
};

const badgeTextColors = {
  NEW: 'text-white',
  HOT: 'text-white',
  SALE: 'text-dark',
  LIMITED: 'text-white',
  RETRO: 'text-white',
};

const ProductCard = ({ product, index, onOpenDetail, onQuickAdd, showRank = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDetail) onOpenDetail(product);
  };

  const imageSrc = product.images?.[0] || '';
  const clubName = product.club?.name || '';
  const clubColor = product.club?.color || '#c9a84c';

  return (
<div
  style={trebuchet}
  className="group relative rounded-xl border border-dark-3 overflow-hidden transition-colors duration-200 hover:border-gold/60"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
      <Link to={`/product/${product.slug}`} className="block">
  
        <div className="relative aspect-[3/4] overflow-hidden bg-dark-2">
          <ImageWithFallback
            src={imageSrc}
            alt={product.name}
            clubName={clubName}
            type={product.type}
            color={clubColor}
            className="w-full h-full"
          />

          {/* Rank Badge (for best sellers) */}
          {showRank && index !== undefined && (
            <div className="absolute top-3 left-3 w-8 h-8 bg-gold text-dark rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div
              className={`absolute top-3 ${showRank ? 'top-14' : ''} left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${
                badgeColors[product.badge] || 'bg-gold'
              } ${badgeTextColors[product.badge] || 'text-dark'}`}
            >
              {product.badge}
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleQuickView}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 text-cream rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Quick View
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-6 py-2.5 bg-gold text-dark rounded-lg text-sm font-medium hover:bg-gold-light transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {/* Type Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-dark/80 backdrop-blur-sm rounded-md text-xs text-cream font-medium">
            {product.type}
          </div>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
              <span className="px-4 py-2 bg-dark-2 border border-danger text-danger rounded-lg text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-warning/20 border border-warning/40 rounded-md text-xs text-warning font-medium">
              Low Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-3 px-3 pb-3">
          {/* Club Name */}
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {clubName}
          </p>

          {/* Product Name */}
        <h3 className="text-sm font-medium text-cream line-clamp-2 min-h-[2.5rem]">
  {product.name}
</h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-gold font-semibold">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-text-muted line-through text-sm">
                  ৳{product.oldPrice?.toLocaleString()}
                </span>
                <span className="text-xs text-green-500 font-medium">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Sales Count (for best sellers) */}
          {product.salesCount > 0 && (
            <p className="text-xs text-text-muted mt-1">
              Sold {product.salesCount} times
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
