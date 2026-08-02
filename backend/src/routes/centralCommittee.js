const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getMembers,
  getMembersByCategory,
  getExecutiveCommittee,
  getDistrictCommittee,
  getProvincialCoordinators,
  getCentralMembers,
  getAdvisoryCouncil,
  updateCommittee,
  addMember,
  updateMember,
  deleteMember,
  updateSectionTitle,
} = require('../controllers/centralCommitteeController');

// Public routes
router.get('/', getMembers);
router.get('/category/:category', getMembersByCategory);
router.get('/executive', getExecutiveCommittee);
router.get('/district', getDistrictCommittee);
router.get('/provincial', getProvincialCoordinators);
router.get('/central-members', getCentralMembers);
router.get('/advisory', getAdvisoryCouncil);

// Protected routes (Admin only) - ORDER MATTERS! Put specific routes before dynamic ones
router.put('/', protect, updateCommittee);
router.put('/title/:section', protect, updateSectionTitle);
router.post('/:section', protect, upload.single('image'), addMember);
router.put('/:section/:index', protect, upload.single('image'), updateMember);
router.delete('/:section/:index', protect, deleteMember);

module.exports = router;