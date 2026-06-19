const express = require('express');
const router = express.Router();
const {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductsByClub,
  getProductsByType,
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes - specific endpoints first
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewArrivals);
router.get('/bestsellers', getBestSellers);
router.get('/club/:clubSlug', getProductsByClub);
router.get('/type/:type', getProductsByType);

// Public routes - general
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', adminAuth, uploadMultiple('images', 5), createProduct);
router.put('/:id', adminAuth, uploadMultiple('images', 5), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
