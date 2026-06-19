import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import ImageWithFallback from './ImageWithFallback';

const trebuchet = { fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" };

const paymentMethods = [
  { id: 'bKash', name: 'bKash', icon: '💳', color: '#E2136E' },
  { id: 'Nagad', name: 'Nagad', icon: '💳', color: '#F7931E' },
  { id: 'Card', name: 'Credit/Debit Card', icon: '💳', color: '#1a1f71' },
  { id: 'COD', name: 'Cash on Delivery', icon: '💵', color: '#4caf50' },
];

const CheckoutModal = ({ onClose }) => {
  const { cart = [], cartTotal, deliveryCharge, orderTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'COD',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // body scroll lock + Escape দিয়ে বন্ধ
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // undefined হলে crash এড়াতে নিরাপদ মান
  const safeSubtotal = typeof cartTotal === 'number' ? cartTotal : 0;
  const safeDelivery = typeof deliveryCharge === 'number' ? deliveryCharge : 0;
  const safeTotal = typeof orderTotal === 'number' ? orderTotal : safeSubtotal + safeDelivery;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        ...formData,
      };
      const response = await createOrder(orderData);
      setOrderSuccess(response.data);
      clearCart();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (orderSuccess) {
    return (
      <div style={trebuchet} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-dark-2 border border-dark-3 rounded-xl max-w-md w-full p-6 sm:p-8 text-center animate-slide-up max-h-[92vh] overflow-y-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-cream mb-2 uppercase tracking-wide">Order Placed!</h2>
          <p className="text-text-muted mb-2">
            Thank you for your order, {orderSuccess.customerName}.
          </p>
          <p className="text-gold font-medium mb-6">
            Order ID: #{orderSuccess._id?.slice(-8).toUpperCase()}
          </p>
          <div className="bg-dark rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Total Amount</span>
              <span className="text-cream font-medium">৳{orderSuccess.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Payment Method</span>
              <span className="text-cream font-medium">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Status</span>
              <span className="text-warning capitalize">{orderSuccess.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-primary w-full">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={trebuchet} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-dark-2 border border-dark-3 rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-dark-3 bg-dark-2">
          <h2 className="font-serif text-xl sm:text-2xl text-cream uppercase tracking-wide">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-3 rounded-lg transition-colors" aria-label="Close">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-0">
          {/* Order Summary — মোবাইলে উপরে দেখানো (order-first) যাতে ইউজার আগে দেখে */}
          <div className="md:hidden bg-dark border-b border-dark-3 p-4">
            <h3 className="font-medium text-cream mb-3 uppercase tracking-wide text-sm">Order Summary</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={`m-${item.productId}-${item.size}-${index}`} className="flex gap-3">
                  <div className="w-12 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-dark-2">
                    <ImageWithFallback src={item.image} alt={item.name} clubName={item.club} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-cream line-clamp-1">{item.name}</p>
                    <p className="text-xs text-text-muted">
                      {item.size}{item.color ? ` · ${item.color}` : ''} × {item.quantity}
                    </p>
                    <p className="text-sm text-gold font-medium">
                      ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-3 mt-3 pt-3 flex justify-between font-semibold">
              <span className="text-cream uppercase tracking-wide text-sm">Total</span>
              <span className="text-gold">৳{safeTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-cream mb-1.5">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`input-field ${errors.customerName ? 'border-danger' : ''}`}
                />
                {errors.customerName && <p className="text-danger text-xs mt-1">{errors.customerName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-cream mb-1.5">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className={`input-field ${errors.phone ? 'border-danger' : ''}`}
                />
                {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-cream mb-1.5">
                  Email <span className="text-text-muted">(optional)</span>
                </label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className={`input-field ${errors.email ? 'border-danger' : ''}`}
                />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-cream mb-1.5">
                  Delivery Address <span className="text-danger">*</span>
                </label>
                <textarea
                  name="address" value={formData.address} onChange={handleChange}
                  placeholder="House, Road, Area" rows={3}
                  className={`input-field resize-none ${errors.address ? 'border-danger' : ''}`}
                />
                {errors.address && <p className="text-danger text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream mb-1.5">
                    City <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text" name="city" value={formData.city} onChange={handleChange}
                    placeholder="City"
                    className={`input-field ${errors.city ? 'border-danger' : ''}`}
                  />
                  {errors.city && <p className="text-danger text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream mb-1.5">Postal Code</label>
                  <input
                    type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}
                    placeholder="Postal Code" className="input-field"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-cream mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.id }))}
                      // BUG FIX: hover:border-dark-3 → hover:border-gold/50
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-left ${
                        formData.paymentMethod === method.id
                          ? 'border-gold bg-gold/10'
                          : 'border-dark-3 bg-dark hover:border-gold/50'
                      }`}
                    >
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm text-cream">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Place Order - ৳${safeTotal.toLocaleString()}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary — desktop (md+) */}
          <div className="hidden md:block md:col-span-2 bg-dark border-l border-dark-3 p-6">
            <h3 className="font-medium text-cream mb-4 uppercase tracking-wide">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${index}`} className="flex gap-3">
                  <div className="w-14 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-dark-2">
                    <ImageWithFallback src={item.image} alt={item.name} clubName={item.club} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-cream line-clamp-1">{item.name}</p>
                    <p className="text-xs text-text-muted">
                      {item.size}{item.color ? ` · ${item.color}` : ''} × {item.quantity}
                    </p>
                    <p className="text-sm text-gold font-medium">
                      ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-3 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-cream">৳{safeSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Delivery</span>
                <span className={safeDelivery === 0 ? 'text-green-500' : 'text-cream'}>
                  {safeDelivery === 0 ? 'FREE' : `৳${safeDelivery}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-dark-3 pt-2">
                <span className="text-cream uppercase tracking-wide">Total</span>
                <span className="text-gold">৳{safeTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
