const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getLeadership,
  createLeader,
  updateLeader,
  deleteLeader,
} = require('../controllers/leadershipController');

router.get('/', getLeadership);
router.post('/', protect, upload.single('image'), createLeader);
router.put('/:id', protect, upload.single('image'), updateLeader);
router.delete('/:id', protect, deleteLeader);

module.exports = router;