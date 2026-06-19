import React from "react";
import { Link } from "react-router-dom";
import { useNewArrivals } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

const TREBUCHET = "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif";

// ── Skeleton — animate-pulse (bounce না, layout shift এড়াতে)
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-44 xs:w-52 sm:w-60 lg:w-64 flex flex-col gap-2">
    <div className="aspect-[3/4] w-full rounded-xl bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-3/4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
  </div>
);

const NewArrivals = ({ onOpenDetail, onQuickAdd }) => {
  const { products, loading, error } = useNewArrivals();

  if (loading) {
    return (
      <section
        className="w-full py-10 sm:py-14 lg:py-20 bg-dark"
        style={{ fontFamily: TREBUCHET }}
      >
        <div className="section-container px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-5 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
            <div className="h-7 w-36 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
          </div>
          {/* Scroll skeleton */}
          <div className="flex gap-3 sm:gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) return null;

  return (
    <section
      className="w-full py-10 sm:py-14 lg:py-20 bg-dark"
      style={{ fontFamily: TREBUCHET }}
    >
      <div className="section-container px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-2.5">
            {/* NEW badge — animate-pulse badge এ দেওয়া ঠিক না,
                এটা loading indicator না, তাই সরিয়ে দিলাম */}
            <span className="px-2.5 py-0.5 bg-green-600 text-white font-bold rounded text-[10px] sm:text-xs tracking-widest uppercase">
              NEW
            </span>
            <div>
              <p className="text-green-500 font-medium mb-0.5 text-[clamp(0.65rem,2vw,0.8rem)]">
                Just In
              </p>
              <h2
                className="font-serif text-cream leading-tight"
                style={{ fontSize: "clamp(1.25rem, 4vw, 2.25rem)" }}
              >
                New Arrivals
              </h2>
            </div>
          </div>

          {/* Desktop View All */}
          <Link
            to="/shop?filter=new"
            className="hidden sm:flex items-center gap-1.5 text-gold hover:text-[#e2c47a] transition-colors flex-shrink-0 text-sm"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Horizontal Scroll ──
            shadow নেই।
            border hover — simple transition।
            320px এ card width ছোট করা হয়েছে (w-44) */}
        <div
          className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto pb-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#c9a84c #1a1612",
            // webkit scrollbar তো CSS এ দিতে হবে, তবে এটুকুই যথেষ্ট
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
            >
              {/* shadow নেই, শুধু border color change on hover */}
              <div className="border border-green-600/20 rounded-xl overflow-hidden hover:border-green-500/60 transition-colors duration-200">
                <ProductCard
                  product={product}
                  onOpenDetail={onOpenDetail}
                  onQuickAdd={onQuickAdd}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile View All ── */}
        <div className="sm:hidden mt-5 text-center">
          <Link to="/shop?filter=new" className="btn-secondary inline-block">
            View All New Arrivals
          </Link>
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;