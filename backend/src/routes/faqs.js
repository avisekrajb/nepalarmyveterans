const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');

router.get('/', getFaqs);
router.post('/', protect, createFaq);
router.put('/:id', protect, updateFaq);
router.delete('/:id', protect, deleteFaq);

module.exports = router;