const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
} = require('../controllers/trainingController');

router.get('/', getTrainings);
router.post('/', protect, createTraining);
router.put('/:id', protect, updateTraining);
router.delete('/:id', protect, deleteTraining);

module.exports = router;