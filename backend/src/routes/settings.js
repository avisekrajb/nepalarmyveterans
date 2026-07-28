const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  getMaintenanceStatus,
  updateMaintenance,
} = require('../controllers/settingsController');

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.get('/maintenance', getMaintenanceStatus);
router.put('/maintenance', protect, updateMaintenance);

module.exports = router;