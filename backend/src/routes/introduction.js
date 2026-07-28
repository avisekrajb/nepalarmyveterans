const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getIntroduction,
  updateIntroduction,
} = require('../controllers/introductionController');

router.get('/', getIntroduction);
router.put('/', protect, upload.single('image'), updateIntroduction);

module.exports = router;