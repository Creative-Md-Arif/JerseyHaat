import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('voute_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('voute_cart', JSON.stringify(cart));
  }, [cart]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message) => {
    setNotification(message);
  }, []);

  const addToCart = useCallback((product, size, color, qty = 1) => {
    setCart((prevCart) => {
      // Check if same product with same size/color already exists
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += qty;
        showNotification(`${product.name} quantity updated in cart`);
        return updatedCart;
      }

      // Add new item
      const newItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        club: product.club?.name || '',
        size,
        color,
        quantity: qty,
      };
      showNotification(`${product.name} added to cart`);
      return [...prevCart, newItem];
    });
    setIsCartOpen(true);
  }, [showNotification]);

  const removeFromCart = useCallback((index) => {
    setCart((prevCart) => {
      const item = prevCart[index];
      const updatedCart = prevCart.filter((_, i) => i !== index);
      showNotification(`${item?.name || 'Item'} removed from cart`);
      return updatedCart;
    });
  }, [showNotification]);

  const updateQuantity = useCallback((index, qty) => {
    if (qty < 1) return;
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = qty;
      return updatedCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    showNotification('Cart cleared');
  }, [showNotification]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const deliveryCharge = cartTotal > 2000 ? 0 : 80;
  const orderTotal = cartTotal + deliveryCharge;

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    deliveryCharge,
    orderTotal,
    isCartOpen,
    setIsCartOpen,
    notification,
    setNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
