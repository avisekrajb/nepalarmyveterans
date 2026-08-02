const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
} = require('../controllers/interviewController');

// Public routes
router.get('/', getInterviews);
router.get('/:id', getInterviewById);

// Protected routes (Admin only)
router.post('/', protect, upload.single('image'), createInterview);
router.put('/:id', protect, upload.single('image'), updateInterview);
router.delete('/:id', protect, deleteInterview);

module.exports = router;