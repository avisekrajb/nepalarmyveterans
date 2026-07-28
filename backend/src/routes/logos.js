const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHeaderLogos,
  updateHeaderLogos,
  getFooterLogo,
  updateFooterLogo,
} = require('../controllers/logoController');

router.get('/header', getHeaderLogos);
router.put('/header', protect, updateHeaderLogos);
router.get('/footer', getFooterLogo);
router.put('/footer', protect, updateFooterLogo);

module.exports = router;