const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getMembers, getAll, getProvinces, getDistricts,
  addMember, updateMember, deleteMember, extendTerm, updateOrder,
} = require('../controllers/centralCommitteeController');

// Public routes
router.get('/provinces', getProvinces);
router.get('/districts/:provinceNumber', getDistricts);
router.get('/search', getMembers);
router.get('/', getAll);

// Protected routes (Admin only) - specific routes BEFORE dynamic :id
router.put('/order/bulk', protect, updateOrder);
router.post('/', protect, upload.single('image'), addMember);
router.put('/:id/extend', protect, extendTerm);
router.put('/:id', protect, upload.single('image'), updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;
