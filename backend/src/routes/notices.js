const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getNotices,
  getModalNotice,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleModalStatus,
  bulkDeleteNotices,
  getNoticesPaginated,
  getNoticesCount,
} = require('../controllers/noticesController');

// ====================================================================
// IMPORTANT: Route Order Matters!
// Specific routes (like /modal, /paginated, /count) MUST come BEFORE
// parameterized routes (like /:id)
// ====================================================================

// ==================== PUBLIC ROUTES ====================
// 1. Get all notices - /
router.get('/', getNotices);

// 2. Get modal notice - /modal (SPECIFIC - before /:id)
router.get('/modal', getModalNotice);

// 3. Get paginated notices - /paginated (SPECIFIC - before /:id)
router.get('/paginated', getNoticesPaginated);

// 4. Get notices count - /count (SPECIFIC - before /:id)
router.get('/count', getNoticesCount);

// 5. Get notice by ID - /:id (PARAMETERIZED - after all specific routes)
router.get('/:id', getNoticeById);

// ==================== PROTECTED ROUTES (Admin only) ====================
// 6. Create notice - /
router.post('/', protect, upload.single('image'), createNotice);

// 7. Bulk delete notices - /bulk (SPECIFIC - before /:id)
router.delete('/bulk', protect, bulkDeleteNotices);

// 8. Toggle modal status - /:id/modal (SPECIFIC - before /:id)
router.put('/:id/modal', protect, toggleModalStatus);

// 9. Update notice - /:id (PARAMETERIZED - after all specific routes)
router.put('/:id', protect, upload.single('image'), updateNotice);

// 10. Delete notice - /:id (PARAMETERIZED - after all specific routes)
router.delete('/:id', protect, deleteNotice);

module.exports = router;