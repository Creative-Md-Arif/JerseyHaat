import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ClubCategories from '../components/ClubCategories';
import FeaturedJerseys from '../components/FeaturedJerseys';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import ProductDetail from '../components/ProductDetail';
import CartSidebar from '../components/CartSidebar';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { setIsCartOpen, addToCart } = useCart();

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (product) => {
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0] || '';
    addToCart(product, defaultSize, defaultColor, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Navbar fixed + transparent, HeroBanner-এর উপরে overlay হবে */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <CartSidebar />

      {/* pt সরানো হলো: HeroBanner একদম top থেকে শুরু হবে, Navbar তার উপরে ভাসবে */}
      <main>
        <HeroBanner />
        <ClubCategories />
        <FeaturedJerseys onOpenDetail={handleOpenDetail} onQuickAdd={handleQuickAdd} />
        <NewArrivals onOpenDetail={handleOpenDetail} onQuickAdd={handleQuickAdd} />
        <BestSellers onOpenDetail={handleOpenDetail} onQuickAdd={handleQuickAdd} />
      </main>

      <Footer />

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

export default Home;
