const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/centralCommitteeController');

// @route   GET /api/central-committee
// @desc    Get all committee members
// @access  Public
router.get('/', getMembers);

// @route   POST /api/central-committee
// @desc    Create a committee member
// @access  Private (Admin only)
router.post('/', protect, upload.single('image'), createMember);

// @route   PUT /api/central-committee/:id
// @desc    Update a committee member
// @access  Private (Admin only)
router.put('/:id', protect, upload.single('image'), updateMember);

// @route   DELETE /api/central-committee/:id
// @desc    Delete a committee member
// @access  Private (Admin only)
router.delete('/:id', protect, deleteMember);

module.exports = router;