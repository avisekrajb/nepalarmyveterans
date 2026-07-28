const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  superAdminLogin,
  getAdmins,
  createAdmin,
  deleteAdmin,
  getLogs,
  getAnalytics,
  getCloudinaryImages,
  deleteCloudinaryImage,
  updateLogoSize,
  addMaintenanceNotice,
  getMaintenanceStatus,
} = require('../controllers/superAdminController');

// Public
router.post('/login', superAdminLogin);

// Protected
router.get('/admins', protect, getAdmins);
router.post('/admins', protect, createAdmin);
router.delete('/admins/:id', protect, deleteAdmin);
router.get('/logs', protect, getLogs);
router.get('/analytics', protect, getAnalytics);
router.get('/cloudinary', protect, getCloudinaryImages);
router.delete('/cloudinary/:publicId', protect, deleteCloudinaryImage);
router.put('/logo-size', protect, updateLogoSize);
router.post('/maintenance', protect, addMaintenanceNotice);
router.get('/maintenance', protect, getMaintenanceStatus);

module.exports = router;