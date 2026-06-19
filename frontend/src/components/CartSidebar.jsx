import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';

const CartSidebar = () => {
  const {
    cart = [],
    removeFromCart,
    updateQuantity,
    cartTotal,
    deliveryCharge,
    orderTotal,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  // body scroll lock + Escape দিয়ে বন্ধ
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  // undefined হলে crash এড়াতে নিরাপদ মান
  const safeSubtotal = typeof cartTotal === 'number' ? cartTotal : 0;
  const safeDelivery = typeof deliveryCharge === 'number' ? deliveryCharge : 0;
  const safeTotal = typeof orderTotal === 'number' ? orderTotal : safeSubtotal + safeDelivery;

  return (
    <div className="font-trebuchet fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar — 320px-এ full width, sm+ এ max-w-md */}
      <div className="relative w-full max-w-md bg-dark-2 border-l border-dark-3 h-full overflow-y-auto animate-slide-in-right flex flex-col">
        {/* Header — sticky যাতে scroll করলেও দেখা যায় */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-dark-3 bg-dark-2">
          <h2 className="font-serif text-lg sm:text-xl text-cream uppercase tracking-wide">
            Shopping Cart ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-dark-3 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center flex-1 py-16 px-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-dark-3 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-cream mb-2 uppercase tracking-wide">Your cart is empty</h3>
            <p className="text-text-muted text-sm text-center mb-6">
              Looks like you haven&apos;t added any jerseys yet. Start shopping to fill it up!
            </p>
            <button onClick={() => setIsCartOpen(false)} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-4 sm:p-6 space-y-4 flex-1">
              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}-${index}`}
                  className="flex gap-3 sm:gap-4 bg-dark rounded-lg p-3 border border-dark-3"
                >
                  {/* Image */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-2">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      clubName={item.club}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted uppercase tracking-wider">{item.club}</p>
                    <p className="text-sm font-medium text-cream line-clamp-1 mt-0.5">{item.name}</p>
                    <div className="flex items-center flex-wrap gap-x-2 mt-1 text-xs text-text-muted">
                      <span>Size: {item.size}</span>
                      {item.color && <span>· Color: {item.color}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-2 gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded border border-dark-3 bg-dark-2 text-cream hover:border-gold transition-colors disabled:opacity-50 flex items-center justify-center text-xs"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium text-cream w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-dark-3 bg-dark-2 text-cream hover:border-gold transition-colors flex items-center justify-center text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-sm font-medium text-gold whitespace-nowrap">
                          ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-1 text-text-muted hover:text-danger transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary — sticky bottom যাতে সবসময় দৃশ্যমান */}
            <div className="sticky bottom-0 border-t border-dark-3 p-4 sm:p-6 space-y-3 bg-dark-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-cream font-medium">৳{safeSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Delivery</span>
                <span className={safeDelivery === 0 ? 'text-green-500 font-medium' : 'text-cream font-medium'}>
                  {safeDelivery === 0 ? 'FREE' : `৳${safeDelivery}`}
                </span>
              </div>
              {safeDelivery === 0 && (
                <p className="text-xs text-green-500">You qualified for free delivery!</p>
              )}
              <div className="flex justify-between text-lg font-semibold border-t border-dark-3 pt-3">
                <span className="text-cream uppercase tracking-wide">Total</span>
                <span className="text-gold">৳{safeTotal.toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary w-full text-center block"
                >
                  Proceed to Checkout
                </Link>
                <button onClick={() => setIsCartOpen(false)} className="btn-secondary w-full">
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-text-muted hover:text-danger transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
