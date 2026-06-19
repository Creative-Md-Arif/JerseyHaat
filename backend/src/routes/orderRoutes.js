const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { adminAuth } = require('../middleware/auth');

// Public route
router.post('/', createOrder);

// Admin routes
router.get('/stats', adminAuth, getOrderStats);
router.get('/', adminAuth, getAllOrders);
router.get('/:id', adminAuth, getOrderById);
router.put('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
