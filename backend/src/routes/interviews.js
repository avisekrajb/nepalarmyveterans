const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Interview = require('../models/Interview');

// @route   GET /api/interviews
// @desc    Get all interviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find()
      .sort({ date: -1, createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   GET /api/interviews/:id
// @desc    Get single interview
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   POST /api/interviews
// @desc    Create an interview
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, guest, date } = req.body;
    
    // Validation
    if (!title || !content || !guest) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and guest name',
      });
    }

    const interview = await Interview.create({
      title,
      content,
      guest,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   PUT /api/interviews/:id
// @desc    Update an interview
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, guest, date } = req.body;
    
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    interview.title = title || interview.title;
    interview.content = content || interview.content;
    interview.guest = guest || interview.guest;
    interview.date = date || interview.date;

    await interview.save();

    res.json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// @route   DELETE /api/interviews/:id
// @desc    Delete an interview
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview not found' 
      });
    }

    await interview.deleteOne();

    res.json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;