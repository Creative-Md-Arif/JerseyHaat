const express = require('express');
const router = express.Router();
const {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { adminAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public route - active banners only
router.get('/', getActiveBanners);

// Admin routes
router.get('/all', adminAuth, getAllBanners);
router.post('/', adminAuth, uploadSingle('image'), createBanner);
router.put('/:id', adminAuth, uploadSingle('image'), updateBanner);
router.delete('/:id', adminAuth, deleteBanner);

module.exports = router;
