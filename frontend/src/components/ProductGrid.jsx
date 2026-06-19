import React, { useRef } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  loading,
  error,
  onOpenDetail,
  onQuickAdd,
  emptyMessage = "No products found",
}) => {
  // গত সফল লোডে কতগুলো product ছিল মনে রাখি
  const lastCountRef = useRef(0);

  // loading নয় এমন অবস্থায় product থাকলে count আপডেট
  if (!loading && products.length > 0) {
    lastCountRef.current = products.length;
  }

  if (loading) {
    // ঠিক ততগুলো skeleton যতগুলো product গতবার ছিল (অন্তত ১)
    const skeletonCount = Math.max(lastCountRef.current, 1);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="animate-pulse">
            {/* আসল ProductCard-এর মতো border + একই aspect ratio */}
            <div className="aspect-[3/4] bg-dark-2 border border-dark-3 rounded-xl" />
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-dark-2 rounded w-1/2" />
              <div className="h-4 bg-dark-2 rounded w-3/4" />
              <div className="h-4 bg-dark-2 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <svg
          className="w-16 h-16 text-danger/50 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 className="text-lg text-cream mb-2">Something went wrong</h3>
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <svg
          className="w-16 h-16 text-text-muted/50 mx-auto mb-4"
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
        <h3 className="text-lg text-cream mb-2">{emptyMessage}</h3>
        <p className="text-text-muted">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          onOpenDetail={onOpenDetail}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
