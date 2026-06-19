import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import ProductDetail from '../components/ProductDetail';
import CartSidebar from '../components/CartSidebar';
import { useClubBySlug } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

const trebuchet = { fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" };

const FixedNav = () => (
  <div className="fixed top-0 left-0 right-0 z-50">
    <Navbar />
  </div>
);

const ClubPage = () => {
  const { slug } = useParams();
  const { club, products, loading, error } = useClubBySlug(slug);
  const { setIsCartOpen, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDetail = (product) => setSelectedProduct(product);

  const handleQuickAdd = (product) => {
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || '';
    addToCart(product, defaultSize, defaultColor, 1);
    setIsCartOpen(true);
  };

  // শুধু সত্যিকারের error বা club না থাকলে error page (loading শেষ হওয়ার পর)
  if (!loading && (error || !club)) {
    return (
      <div style={trebuchet} className="min-h-screen bg-dark flex flex-col">
        <FixedNav />
        <CartSidebar />
        <div className="flex-1 section-container px-3 sm:px-4 lg:px-6 pt-24 lg:pt-28 pb-20 text-center">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 text-text-muted/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          <h2 className="font-serif text-2xl text-cream mb-2 uppercase tracking-wide">Club Not Found</h2>
          <p className="text-text-muted mb-6">The club you are looking for does not exist.</p>
          <Link to="/shop" className="btn-primary">Browse All Jerseys</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // club.color undefined হলে gradient ভাঙে — fallback (loading-এ club null হতে পারে)
  const clubColor = club?.color || '#c9a84c';

  return (
    <div style={trebuchet} className="min-h-screen bg-dark flex flex-col">
      <FixedNav />
      <CartSidebar />

      {/* Navbar fixed হওয়ায় উপরে spacing */}
      <div className="pt-16 lg:pt-20 flex flex-col flex-1">
        {/* Club Header */}
        <div
          className="w-full py-10 sm:py-12 lg:py-16 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${clubColor}22 0%, #14110d 50%, ${clubColor}15 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${clubColor} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>
          <div className="section-container px-3 sm:px-4 lg:px-6 relative">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {/* Club Logo — loading-এ skeleton বৃত্ত */}
              {loading ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-dark-2 border border-dark-3 animate-pulse flex-shrink-0" />
              ) : (
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${clubColor}20`, border: `2px solid ${clubColor}40` }}
                >
                  {club.logo ? (
                    <img src={club.logo} alt={club.name} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain" />
                  ) : (
                    <span className="font-serif font-bold" style={{ color: clubColor, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
                      {club.name?.charAt(0)}
                    </span>
                  )}
                </div>
              )}

              {/* Club Info — loading-এ skeleton lines */}
              <div className="min-w-0">
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-7 sm:h-9 w-48 bg-dark-2 rounded" />
                    <div className="h-4 w-32 bg-dark-2 rounded" />
                  </div>
                ) : (
                  <>
                    <h1
                      className="font-serif text-cream mb-1 uppercase tracking-wide"
                      style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}
                    >
                      {club.name}
                    </h1>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-text-muted">
                      <span>{club.league}</span>
                      {club.country && (
                        <>
                          <span>·</span>
                          <span>{club.country}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{products.length} jerseys</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <main className="flex-1 section-container px-3 sm:px-4 lg:px-6 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            {loading ? (
              <div className="h-7 sm:h-8 w-56 bg-dark-2 rounded animate-pulse" />
            ) : (
              <h2
                className="font-serif text-cream uppercase tracking-wide"
                style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
              >
                All {club.name} Jerseys
              </h2>
            )}
          </div>

          {/* loading সরাসরি ProductGrid-এ — active product অনুযায়ী skeleton, jumping বন্ধ */}
          <ProductGrid
            products={products}
            loading={loading}
            error={null}
            onOpenDetail={handleOpenDetail}
            onQuickAdd={handleQuickAdd}
            emptyMessage={club ? `No jerseys available for ${club.name} yet` : 'No jerseys found'}
          />
        </main>
      </div>

      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default ClubPage;
