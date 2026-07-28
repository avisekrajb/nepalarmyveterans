const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getNews,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');

router.get('/', getNews);
router.post('/', protect, upload.single('image'), createNews);
router.put('/:id', protect, upload.single('image'), updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;