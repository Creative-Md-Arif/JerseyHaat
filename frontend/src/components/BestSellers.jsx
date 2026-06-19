import React from "react";
import { Link } from "react-router-dom";
import { useBestSellers } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

// ── Trebuchet কে tailwind config এ define না করলেও চলবে,
//    একটা CSS variable দিয়ে পুরো project এ একবার set করা best।
//    তবে এখানে inline style দিয়েই কাজ চলবে।
const TREBUCHET = "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif";

// ── Skeleton card — jumping/bouncing fix:
//    animate-pulse ব্যবহার করছি (animate-bounce না),
//    bounce করলে layout shift হয়।
const SkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <div className="aspect-[3/4] w-full rounded-xl bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-3/4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
    <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
  </div>
);

const BestSellers = ({ onOpenDetail, onQuickAdd }) => {
  const { products, loading, error } = useBestSellers();

  // ── Loading state
  if (loading) {
    return (
      <section
        className="w-full py-10 sm:py-14 lg:py-20 bg-dark-2"
        style={{ fontFamily: TREBUCHET }}
      >
        <div className="section-container px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 rounded bg-[rgba(255,255,255,0.06)] animate-pulse flex-shrink-0" />
            <div className="h-7 w-40 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" />
          </div>
          {/* Grid skeleton */}
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
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Fire icon */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-orange-500 font-medium mb-0.5 text-[clamp(0.65rem,2vw,0.8rem)]">
                Most Popular
              </p>
              <h2
                className="font-serif text-cream uppercase tracking-wide leading-tight"
                style={{ fontSize: "clamp(1.25rem, 4vw, 2.25rem)" }}
              >
                Best Sellers
              </h2>
            </div>
          </div>

          {/* Desktop View All */}
          <Link
            to="/shop?filter=bestsellers"
            className="hidden sm:flex items-center gap-1.5 text-gold hover:text-[#e2c47a] transition-colors flex-shrink-0 text-sm"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* ── Products Grid ──
            shadow নেই, hover এ শুধু border/opacity change */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onOpenDetail={onOpenDetail}
              onQuickAdd={onQuickAdd}
              showRank={true}
            />
          ))}
        </div>

        {/* ── Mobile View All ── */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/shop?filter=bestsellers"
            className="btn-secondary inline-block"
          >
            View All Best Sellers
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BestSellers;