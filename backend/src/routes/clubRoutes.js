const express = require('express');
const router = express.Router();
const {
  getAllClubs,
  getAllClubsAdmin,
  getClubBySlug,
  createClub,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");
const { adminAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/', getAllClubs);
router.get("/all", adminAuth, getAllClubsAdmin); 
router.get('/:slug', getClubBySlug);

// Admin routes
router.post('/', adminAuth, uploadSingle('logo'), createClub);
router.put('/:id', adminAuth, uploadSingle('logo'), updateClub);
router.delete('/:id', adminAuth, deleteClub);

module.exports = router;
