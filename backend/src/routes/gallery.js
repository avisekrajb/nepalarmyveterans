const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getGallery,
  uploadGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

router.get('/', getGallery);
router.post('/', protect, upload.single('file'), uploadGalleryItem);
router.put('/:id', protect, upload.single('file'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;