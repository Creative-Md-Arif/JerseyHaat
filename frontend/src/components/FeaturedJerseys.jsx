import React from "react";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

const TREBUCHET = "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif";

const SkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <div className="aspect-[3/4] w-full rounded-xl bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-3/4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
  </div>
);

const FeaturedJerseys = ({ onOpenDetail, onQuickAdd }) => {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <section
        className="w-full py-10 sm:py-14 lg:py-20 bg-dark-2"
        style={{ fontFamily: TREBUCHET }}
      >
        <div className="section-container px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="h-7 w-48 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) return null;

  return (
    <section
      className="w-full py-10 sm:py-14 lg:py-20 bg-dark-2"
      style={{ fontFamily: TREBUCHET }}
    >
      <div className="section-container px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-gold font-medium uppercase tracking-wider mb-1 text-[clamp(0.65rem,2vw,0.8rem)]">
              Handpicked
            </p>
            <h2
              className="font-serif text-cream leading-tight"
              style={{ fontSize: "clamp(1.25rem, 4vw, 2.25rem)" }}
            >
              Featured Collection
            </h2>
          </div>

          {/* Desktop View All */}
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-gold hover:text-[#e2c47a] transition-colors flex-shrink-0 text-sm"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Products Grid ──
            shadow নেই, ProductCard এর নিজস্ব hover থাকলে সেটাই যথেষ্ট */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onOpenDetail={onOpenDetail}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>

        {/* ── Mobile View All ── */}
        <div className="sm:hidden mt-5 text-center">
          <Link to="/shop" className="btn-secondary inline-block">
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedJerseys;