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

router.get('/', getHero);
router.put('/', protect, updateHero);
router.post('/carousel', protect, upload.single('image'), uploadCarouselImage);
router.delete('/carousel/:index', protect, deleteCarouselImage);
router.post('/seniors', protect, addSenior);
router.delete('/seniors/:index', protect, deleteSenior);

module.exports = router;