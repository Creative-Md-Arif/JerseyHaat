import React, { useState, useEffect } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from "../services/adminApi";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const trebuchetFont = {
    fontFamily:
      '"Trebuchet MS", "TrebuchetMS", "TrebuchetMS-Bold", "Trebuchet MS Bold", "TrebuchetMS-Italic", sans-serif',
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const response = await getAllOrders(params);

      setOrders(response.data || []);
      setTotalPages(response.totalPages || 1);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getOrderStats();
      setStats(response.data);
    } catch {
      // Silently handle
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setSuccess(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchStats();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Print Invoice Function
  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    const itemsHtml = order.items
      ?.map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
          <img src="${item.image || "https://via.placeholder.com/40"}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
          <div>
            <div style="font-weight: bold;">${item.name}</div>
            <div style="font-size: 12px; color: #666;">Size: ${item.size}</div>
          </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳${item.price.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `,
      )
      .join("");

    const html = `
      <html>
      <head>
        <title>Invoice #${order._id?.slice(-8).toUpperCase()}</title>
        <style>
          body { font-family: 'Trebuchet MS', sans-serif; padding: 40px; color: #1a1612; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #c9a84c; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f5f0e8; padding: 10px; text-align: left; font-size: 14px; text-transform: uppercase; }
          .totals { margin-top: 30px; margin-left: auto; width: 300px; }
          .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .grand-total { font-size: 18px; font-weight: bold; color: #c9a84c; border-bottom: none !important; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #9a8a6a; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Royal Football Hub</div>
            <p>Dhaka, Bangladesh</p>
          </div>
          <div style="text-align: right;">
            <h2>INVOICE</h2>
            <p>Order #: ${order._id?.slice(-8).toUpperCase()}</p>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${order.customerName}</strong></p>
            <p>${order.phone}</p>
            <p>${order.email || "N/A"}</p>
            <p>${order.address}, ${order.city}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> <span style="text-transform: uppercase; color: ${order.status === "delivered" ? "green" : "#c9a84c"};">${order.status}</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div class="totals">
          <div><span>Subtotal:</span> <span>৳${order.totalAmount?.toLocaleString()}</span></div>
          <div><span>Delivery Charge:</span> <span>৳${order.deliveryCharge?.toLocaleString()}</span></div>
          <div class="grand-total"><span>Grand Total:</span> <span>৳${(order.totalAmount + order.deliveryCharge).toLocaleString()}</span></div>
        </div>

        <div class="footer">
          Thank you for your purchase from Royal Football Hub!
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const inputClass =
    "w-full bg-dark border border-dark-3 rounded-md px-3 py-2 text-cream focus:outline-none focus:border-gold transition-colors text-sm";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6" style={trebuchetFont}>
      <h1 className="text-2xl md:text-3xl text-cream mb-6 border-b border-dark-3 pb-4 font-bold tracking-wide">
        Manage Orders
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total", value: stats.totalOrders, color: "text-cream" },
            {
              label: "Pending",
              value: stats.pendingOrders,
              color: "text-yellow-400",
            },
            {
              label: "Confirmed",
              value: stats.confirmedOrders,
              color: "text-blue-400",
            },
            {
              label: "Shipped",
              value: stats.shippedOrders,
              color: "text-purple-400",
            },
            {
              label: "Delivered",
              value: stats.deliveredOrders,
              color: "text-green-400",
            },
            {
              label: "Cancelled",
              value: stats.cancelledOrders,
              color: "text-red-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-dark-2 border border-dark-3 rounded-lg p-4 text-center hover:border-gold/30 transition-colors"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-dark-2 p-3 rounded-lg border border-dark-3">
        <span className="text-xs text-text-muted uppercase tracking-wider mr-2 hidden sm:block">
          Filter:
        </span>
        {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-gold text-dark"
                  : "bg-dark-3 text-text-muted hover:text-cream"
              }`}
            >
              {s || "All"}
            </button>
          ),
        )}
      </div>

      {/* Orders Table/List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-dark-2 border border-dark-3 rounded-xl">
          <div className="w-12 h-12 border-4 border-dark-3 border-t-gold rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted text-sm tracking-wide">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-dark-2 border border-dashed border-dark-3 rounded-xl">
          <p className="text-text-muted">No orders found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden border border-dark-3 rounded-xl bg-dark-2">
            <table className="w-full text-left">
              <thead className="bg-dark border-b border-dark-3">
                <tr>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Items
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Total
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-dark-3 last:border-0 hover:bg-dark-3/30 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs text-text-muted">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-cream">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-text-muted">{order.phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt=""
                            className="w-8 h-8 object-cover rounded-md border-2 border-dark-2"
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <span className="w-8 h-8 flex items-center justify-center bg-dark-3 rounded-md text-xs text-cream border-2 border-dark-2">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gold font-medium">
                      ৳
                      {(
                        order.totalAmount + order.deliveryCharge
                      ).toLocaleString()}
                    </td>
                    <td className="p-4 text-text-muted text-sm capitalize">
                      {order.paymentMethod}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-cream hover:bg-gold/10 rounded-md transition-colors"
                          title="View Details"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-dark border border-dark-3 rounded-md px-2 py-1.5 text-xs text-cream focus:border-gold focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-dark-2 border border-dark-3 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-cream">
                      {order.customerName}
                    </h3>
                    <p className="text-xs text-text-muted">{order.phone}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize border ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {order.items?.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded-md bg-dark"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm border-t border-dark-3 pt-3">
                  <span className="text-text-muted">Total:</span>
                  <span className="text-gold font-bold">
                    ৳
                    {(
                      order.totalAmount + order.deliveryCharge
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-2 bg-dark-3 text-cream rounded-md text-sm font-medium"
                  >
                    View Details
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="bg-dark-3 border border-dark-3 rounded-md px-2 py-2 text-sm text-cream focus:border-gold focus:outline-none flex-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-dark-3 text-cream rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark border border-dark-3"
              >
                Prev
              </button>
              <span className="text-text-muted text-sm px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-dark-3 text-cream rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark border border-dark-3"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-dark-2 border border-dark-3 rounded-t-2xl sm:rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-cream font-bold tracking-wide">
                Order #{selectedOrder._id?.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-dark-3 rounded-md text-text-muted"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-text-muted uppercase text-xs tracking-wider mb-1">
                  Customer
                </p>
                <p className="text-cream font-medium">
                  {selectedOrder.customerName}
                </p>
                <p className="text-text-muted">{selectedOrder.phone}</p>
                <p className="text-text-muted">
                  {selectedOrder.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-text-muted uppercase text-xs tracking-wider mb-1">
                  Shipping Address
                </p>
                <p className="text-cream">{selectedOrder.address}</p>
                <p className="text-cream">
                  {selectedOrder.city}, {selectedOrder.postalCode}
                </p>
              </div>
            </div>

            <div className="border-t border-dark-3 pt-4">
              <h3 className="text-sm font-medium text-gold uppercase tracking-wider mb-3">
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-4 pb-3 border-b border-dark-3 last:border-0"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md bg-dark"
                      />
                      <div>
                        <p className="text-sm text-cream font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gold font-medium">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dark-3 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-cream">
                  ৳{selectedOrder.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Delivery Charge</span>
                <span className="text-cream">
                  ৳{selectedOrder.deliveryCharge?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-3">
                <span className="text-cream">Total</span>
                <span className="text-gold">
                  ৳
                  {(
                    selectedOrder.totalAmount + selectedOrder.deliveryCharge
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="px-4 py-2.5 bg-gold text-dark font-bold rounded-md hover:bg-gold-light transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Invoice
              </button>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  handleStatusChange(selectedOrder._id, e.target.value);
                  setSelectedOrder({
                    ...selectedOrder,
                    status: e.target.value,
                  });
                }}
                className="bg-dark-3 border border-dark-3 rounded-md px-4 py-2.5 text-cream focus:border-gold focus:outline-none cursor-pointer text-sm capitalize"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManage;
