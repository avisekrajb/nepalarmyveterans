const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTaskPrograms,
  createTaskProgram,
  updateTaskProgram,
  deleteTaskProgram,
} = require('../controllers/taskProgramController');

router.get('/', getTaskPrograms);
router.post('/', protect, createTaskProgram);
router.put('/:id', protect, updateTaskProgram);
router.delete('/:id', protect, deleteTaskProgram);

module.exports = router;