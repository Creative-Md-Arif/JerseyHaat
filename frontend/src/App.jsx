import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ShopPage from './pages/ShopPage';
import ClubPage from './pages/ClubPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/club/:slug" element={<ClubPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
};

const NotFound = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="text-center">
      <h1 className="font-serif text-8xl gold-text-gradient mb-4">404</h1>
      <h2 className="font-serif text-2xl text-cream mb-4">Page Not Found</h2>
      <p className="text-text-muted mb-8">The page you are looking for does not exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  </div>
);

export default App;
