import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom"; 
import { getOrderStats } from "../services/adminApi";

// ─── Global Trebuchet font style ───────────────────────────────────────────
const trebuchet = {
  fontFamily:
    '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif',
};

// ─── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderStats();
      const data = response?.data?.data || response?.data || {};
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load statistics. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 পরিবর্তন: সব পাথ '/dashboard' থেকে পরিবর্তন করে সঠিক '/admin' করা হয়েছে
  const navItems = [
    { path: "/admin", label: "Overview", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "👕" },
    { path: "/admin/clubs", label: "Clubs", icon: "⚽" },
    { path: "/admin/banners", label: "Banners", icon: "🖼️" },
    { path: "/admin/orders", label: "Orders", icon: "📦" },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const currentLabel =
    navItems.find((item) => isActive(item.path))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-dark flex" style={trebuchet}>
      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-dark-2 border-r border-dark-3
          flex flex-col
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-dark-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-widest gold-text-gradient select-none">
              VOÛTE
            </span>
            <span
              className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em] mt-1 group-hover:text-gold transition-colors"
              style={{ letterSpacing: "0.25em" }}
            >
              Admin
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-150 relative group
                ${
                  isActive(item.path)
                    ? "bg-gold/10 text-gold border border-gold/25"
                    : "text-text-muted hover:bg-dark-3 hover:text-cream border border-transparent"
                }
              `}
            >
              {/* Active Indicator Bar */}
              {isActive(item.path) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-gold rounded-r-full"></span>
              )}
              <span className="text-lg leading-none mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back to site */}
        <div className="shrink-0 p-4 border-t border-dark-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted hover:text-gold transition-colors rounded-lg hover:bg-dark-3"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-dark/95 backdrop-blur-md border-b border-dark-3 px-4 sm:px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Hamburger – mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-cream hover:text-gold transition-colors rounded-md hover:bg-dark-3"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-cream tracking-wide flex-1 lg:flex-none lg:ml-4">
              {currentLabel}
            </h2>

            {/* Reload Stats Button */}
            <button 
              onClick={fetchStats}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-text-muted hover:text-gold border border-dark-3 hover:border-gold/30 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* 🔴 পরিবর্তন: আলাদা <Routes> ফেলে দিয়ে এখানে <Outlet /> বসানো হয়েছে।
              এর ফলে URL অনুযায়ী Overview, ProductManage বা ClubManage স্বয়ংক্রিয়ভাবে এখানে লোড হবে। */}
          <Outlet context={{ stats, loading, error, fetchStats }} />
        </main>
      </div>
    </div>
  );
};

// ─── Overview ───────────────────────────────────────────────────────────────
// 🔴 পরিবর্তন: এখন এটি সরাসরি props অথবা Outlet context থেকে ডেটা রিসিভ করতে পারবে
export const Overview = ({ stats, loading, error }) => {
  // 🔴 পরিবর্তন: কুইক অ্যাকশনগুলোর পথও '/admin' এ ফিক্স করা হয়েছে
  const quickActions = [
    { label: "Add Product", path: "/admin/products", icon: "👕" },
    { label: "Add Club", path: "/admin/clubs", icon: "⚽" },
    { label: "Add Banner", path: "/admin/banners", icon: "🖼️" },
    { label: "View Orders", path: "/admin/orders", icon: "📦" },
  ];

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: "📦",
      accent: "border-blue-500/20 bg-blue-600/5",
      text: "text-blue-400",
      bg: "bg-blue-600/10",
    },
    {
      label: "Total Revenue",
      value: stats?.totalRevenue ? `৳${(stats.totalRevenue / 1000).toFixed(1)}k` : "৳0",
      icon: "💰",
      accent: "border-green-500/20 bg-green-600/5",
      text: "text-green-400",
      bg: "bg-green-600/10",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: "⏳",
      accent: "border-yellow-500/20 bg-yellow-600/5",
      text: "text-yellow-400",
      bg: "bg-yellow-600/10",
    },
    {
      label: "Recent (7 days)",
      value: stats?.recentOrders ?? 0,
      icon: "📈",
      accent: "border-purple-500/20 bg-purple-600/5",
      text: "text-purple-400",
      bg: "bg-purple-600/10",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-dark-3 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-dark-2 border border-dark-3 rounded-xl"></div>
          ))}
        </div>
        <div className="h-48 bg-dark-2 border border-dark-3 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-cream mb-2">Something went wrong</h3>
        <p className="text-text-muted mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cream tracking-wide">
          Dashboard Overview
        </h1>
        <p className="text-text-muted text-sm mt-1">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border ${card.accent} p-6 transition-all duration-200 hover:scale-[1.02] hover:border-gold/20 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-cream mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
                  {card.label}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.text} group-hover:scale-110 transition-transform`}>
                <span className="text-2xl leading-none">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-dark-2 border border-dark-3 rounded-xl p-6">
        <h2 className="text-base font-semibold text-cream mb-5 flex items-center gap-3">
          <span className="w-1 h-5 bg-gold rounded-full inline-block"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-dark rounded-lg border border-dark-3 hover:border-gold/40 hover:bg-dark-3/50 hover:shadow-lg hover:shadow-gold/5 transition-all duration-200 text-center group"
            >
              <span className="text-3xl leading-none group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm text-cream font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;