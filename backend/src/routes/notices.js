const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticesController');

// Public routes
router.get('/', getNotices);
router.get('/:id', getNoticeById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createNotice);
router.put('/:id', protect, upload.single('image'), updateNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;