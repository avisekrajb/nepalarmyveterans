const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactMessageController');

// Public route
router.post('/', createMessage);

// Protected routes (Admin only)
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessageById);
router.put('/:id/status', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;