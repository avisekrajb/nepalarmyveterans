const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getGallery,
  uploadGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

router.get('/', getGallery);
router.post('/', protect, upload.single('file'), uploadGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;