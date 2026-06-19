import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { verifyAdmin } from './services/adminApi';

// Pages & Components
import Dashboard, { Overview } from './pages/Dashboard';
import ProductManage from './components/ProductManage';
import ClubManage from './components/ClubManage';
import BannerManage from './components/BannerManage';
import OrderManage from './components/OrderManage';
import AdminLogin from './components/AdminLogin';

// 🔐 Protected Route Component (যা আপনার ফাইলে মিসিং ছিল)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const [isAuth, setIsAuth] = useState(token ? true : null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await verifyAdmin();
        setIsAuth(authStatus);
        if (!authStatus) {
          localStorage.removeItem('adminToken');
        }
      } catch {
        setIsAuth(false);
        localStorage.removeItem('adminToken');
      }
    };

    if (token) {
      checkAuth();
    } else {
      setIsAuth(false);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="w-10 h-10 border-2 border-dark-3 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/admin/login" replace />;
};

// 🚀 Main App Component
function App() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Nested Routes inside Dashboard's <Outlet /> */}
        <Route index element={<Overview />} /> 
        <Route path="products" element={<ProductManage />} />
        <Route path="clubs" element={<ClubManage />} />
        <Route path="banners" element={<BannerManage />} />
        <Route path="orders" element={<OrderManage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App; // ফাইলটি সঠিকভাবে ডিফল্ট এক্সপোর্ট করা হলো