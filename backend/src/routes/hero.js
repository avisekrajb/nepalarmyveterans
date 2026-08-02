const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getHero,
  updateHero,
  uploadCarouselImage,
  deleteCarouselImage,
  addSenior,
  deleteSenior,
} = require('../controllers/heroController');

// Public routes
router.get('/', getHero);

// Protected routes
router.put('/', protect, updateHero);
router.post('/carousel', protect, upload.single('image'), uploadCarouselImage);
router.delete('/carousel/:index', protect, deleteCarouselImage);

// Senior routes - Make sure upload middleware is used for file uploads
router.post('/seniors', protect, upload.single('image'), addSenior);
router.delete('/seniors/:index', protect, deleteSenior);

module.exports = router;