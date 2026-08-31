const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSecurityRules,
  createSecurityRule,
  updateSecurityRule,
  deleteSecurityRule,
} = require('../controllers/securityRuleController');

router.get('/', getSecurityRules);
router.post('/', protect, createSecurityRule);
router.put('/:id', protect, updateSecurityRule);
router.delete('/:id', protect, deleteSecurityRule);

module.exports = router;