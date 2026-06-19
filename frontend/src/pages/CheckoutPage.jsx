import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '../components/CheckoutModal';
import { useCart } from '../context/CartContext';

const trebuchet = { fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" };

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(true);

  // cart খালি হলে সরাসরি shop-এ
  if (cartCount === 0 && !open) {
    navigate('/shop', { replace: true });
    return null;
  }

  const handleClose = () => {
    setOpen(false);
    // modal বন্ধ করলে আগের পেজে ফিরে যাও (dead-end এড়াতে)
    navigate(-1);
  };

  return (
    // পেছনে শুধু dark background, কোনো Navbar/Footer নেই
    <div style={trebuchet} className="min-h-screen bg-dark">
      {open && <CheckoutModal onClose={handleClose} />}
    </div>
  );
};

export default CheckoutPage;
