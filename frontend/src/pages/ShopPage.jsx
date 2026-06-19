import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import ProductDetail from "../components/ProductDetail";
import CartSidebar from "../components/CartSidebar";
import { useProductList } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCart } from "../context/CartContext";

const trebuchet = {
  fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif",
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

const jerseyTypes = [
  "Home",
  "Away",
  "Third",
  "Goalkeeper",
  "Training",
  "Retro",
];
const badgeTypes = ["NEW", "HOT", "SALE", "LIMITED", "RETRO"];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setIsCartOpen, addToCart } = useCart();
  const { clubs } = useCategories();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // শুধু মোবাইল popup

  const clubFilter = searchParams.get("club") || "";
  const typeFilter = searchParams.get("type") || "";
  const searchFilter = searchParams.get("search") || "";
  const badgeFilter = searchParams.get("badge") || "";
  const sortFilter = searchParams.get("sort") || "newest";
  const pageFilter = parseInt(searchParams.get("page") || "1", 10);
  const filterParam = searchParams.get("filter") || "";

  const getApiParams = () => {
    const params = { page: pageFilter, limit: 12, sort: sortFilter };
    if (clubFilter) params.club = clubFilter;
    if (typeFilter) params.type = typeFilter;
    if (searchFilter) params.search = searchFilter;
    if (badgeFilter) params.badge = badgeFilter;
    if (filterParam === "new") params.badge = "NEW";
    if (filterParam === "bestsellers") params.sort = "best-selling";
    if (filterParam === "sale") params.badge = "SALE";
    return params;
  };

  const { products, pagination, loading, error } =
    useProductList(getApiParams());

  const updateFilters = (newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newFilters };
    Object.keys(updated).forEach((key) => {
      if (!updated[key] || updated[key] === "null") delete updated[key];
    });
    if (newFilters.page === undefined) updated.page = "1";
    setSearchParams(updated);
  };

  const handleClubToggle = (clubSlug) =>
    updateFilters({ club: clubFilter === clubSlug ? "" : clubSlug });
  const handleTypeToggle = (type) =>
    updateFilters({ type: typeFilter === type ? "" : type });
  const handleBadgeToggle = (badge) =>
    updateFilters({ badge: badgeFilter === badge ? "" : badge });
  const handleSortChange = (e) => updateFilters({ sort: e.target.value });

  const handlePageChange = (page) => {
    updateFilters({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDetail = (product) => setSelectedProduct(product);

  const handleQuickAdd = (product) => {
    const defaultSize = product.sizes?.[0] || "M";
    const defaultColor = product.colors?.[0] || "";
    addToCart(product, defaultSize, defaultColor, 1);
    setIsCartOpen(true);
  };

  const getPageTitle = () => {
    if (filterParam === "new") return "New Arrivals";
    if (filterParam === "bestsellers") return "Best Sellers";
    if (filterParam === "sale") return "Sale";
    if (searchFilter) return `Search: "${searchFilter}"`;
    if (typeFilter) return `${typeFilter} Jerseys`;
    if (clubFilter) {
      const club = clubs.find((c) => c.slug === clubFilter);
      return club ? club.name : "Shop";
    }
    return "All Jerseys";
  };

  const activeFilterCount = [clubFilter, typeFilter, badgeFilter].filter(
    Boolean,
  ).length;

  const FilterGroups = () => (
    <>
      <div>
        <h3 className="font-medium text-cream mb-3 uppercase tracking-wide">
          Clubs
        </h3>
        <div className="space-y-2">
          {clubs.map((club) => (
            <label
              key={club._id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={clubFilter === club.slug}
                onChange={() => handleClubToggle(club.slug)}
                className="w-4 h-4 rounded border-dark-3 bg-dark-2 text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-sm text-text-muted group-hover:text-cream transition-colors">
                {club.name}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-cream mb-3 uppercase tracking-wide">
          Jersey Type
        </h3>
        <div className="space-y-2">
          {jerseyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={typeFilter === type}
                onChange={() => handleTypeToggle(type)}
                className="w-4 h-4 rounded border-dark-3 bg-dark-2 text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-sm text-text-muted group-hover:text-cream transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-cream mb-3 uppercase tracking-wide">
          Badge
        </h3>
        <div className="space-y-2">
          {badgeTypes.map((badge) => (
            <label
              key={badge}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={badgeFilter === badge}
                onChange={() => handleBadgeToggle(badge)}
                className="w-4 h-4 rounded border-dark-3 bg-dark-2 text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-sm text-text-muted group-hover:text-cream transition-colors">
                {badge}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    // min-h-screen + flex flex-col => footer সবসময় নিচে, content কম হলেও লাফাবে না
    <div style={trebuchet} className="min-h-screen bg-dark flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <CartSidebar />

      {/* main flex-1 নেয় => বাকি উচ্চতা দখল করে footer-কে নিচে ঠেলে রাখে */}
      <main className="flex-1 section-container px-3 sm:px-4 lg:px-6 pt-20 lg:pt-24 pb-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="font-serif text-cream mb-1 sm:mb-2 uppercase tracking-wide"
            style={{ fontSize: "clamp(1.5rem, 5vw, 2.25rem)" }}
          >
            {getPageTitle()}
          </h1>
          <p
            className="text-text-muted"
            style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}
          >
            {pagination.total > 0
              ? `${pagination.total} products found`
              : "Browse our collection"}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 sm:pb-6 border-b border-dark-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-dark-2 border border-dark-3 rounded-lg text-sm text-cream hover:border-gold transition-colors"
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-gold text-dark rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active Filter Pills */}
            {clubFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-xs text-gold">
                {clubs.find((c) => c.slug === clubFilter)?.name || clubFilter}
                <button
                  onClick={() => handleClubToggle(clubFilter)}
                  className="hover:text-cream"
                  aria-label="Remove filter"
                >
                  <svg
                    className="w-3 h-3"
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
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-xs text-gold">
                {typeFilter}
                <button
                  onClick={() => handleTypeToggle(typeFilter)}
                  className="hover:text-cream"
                  aria-label="Remove filter"
                >
                  <svg
                    className="w-3 h-3"
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
              </span>
            )}
            {badgeFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-xs text-gold">
                {badgeFilter}
                <button
                  onClick={() => handleBadgeToggle(badgeFilter)}
                  className="hover:text-cream"
                  aria-label="Remove filter"
                >
                  <svg
                    className="w-3 h-3"
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
              </span>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortFilter}
              onChange={handleSortChange}
              className="input-field py-2 text-sm pr-8"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* বড় ডিভাইসে সবসময় sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <FilterGroups />
          </aside>

          {/* Products - min-h দিয়ে উচ্চতা স্থির, footer আর লাফাবে না */}
          <div className="flex-1 min-w-0" style={{ minHeight: "60vh" }}>
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onOpenDetail={handleOpenDetail}
              onQuickAdd={handleQuickAdd}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="p-2 border border-dark-3 rounded-lg text-cream hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === pagination.currentPage
                        ? "bg-gold text-dark"
                        : "border border-dark-3 text-cream hover:border-gold"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="p-2 border border-dark-3 rounded-lg text-cream hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Popup */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-dark-2 border-t border-dark-3 rounded-t-2xl p-5 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-cream uppercase tracking-wide">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-cream hover:text-gold"
                aria-label="Close filters"
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
            </div>
            <FilterGroups />
            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full"
            >
              Show {pagination.total || ""} Results
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;
