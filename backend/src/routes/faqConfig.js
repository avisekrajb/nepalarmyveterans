const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getFaqConfig, updateFaqConfig } = require('../controllers/faqConfigController');

router.get('/', getFaqConfig);
router.put('/', protect, updateFaqConfig);

module.exports = router;
