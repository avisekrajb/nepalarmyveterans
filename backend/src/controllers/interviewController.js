const Interview = require('../models/Interview');
const cloudinary = require('../config/cloudinary');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Public
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: -1, createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Public
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an interview
// @route   POST /api/interviews
// @access  Private (Admin only)
const createInterview = async (req, res) => {
  try {
    const { title, guest, team, content, type, videoUrl, date } = req.body;
    
    if (!title || !guest || !content) {
      return res.status(400).json({ message: 'Title, guest name, and content are required' });
    }

    let imageUrl = '';
    let publicId = '';

    // Handle image upload
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
    }

    // Handle video URL
    let finalVideoUrl = videoUrl || '';
    
    // Validate video URL if provided
    if (finalVideoUrl && !isValidUrl(finalVideoUrl)) {
      return res.status(400).json({ message: 'Invalid video URL format' });
    }

    const interview = await Interview.create({
      title,
      guest,
      team: team || '',
      content,
      type: type || (req.file ? 'image' : 'video'),
      image: imageUrl,
      videoUrl: finalVideoUrl,
      publicId: publicId,
      date: date || Date.now(),
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// @desc    Update an interview
// @route   PUT /api/interviews/:id
// @access  Private (Admin only)
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, guest, team, content, type, videoUrl, date } = req.body;
    
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.title = title || interview.title;
    interview.guest = guest || interview.guest;
    interview.team = team !== undefined ? team : interview.team;
    interview.content = content || interview.content;
    interview.type = type || interview.type;
    interview.date = date || interview.date;
    
    // Handle video URL
    if (videoUrl !== undefined) {
      if (videoUrl && !isValidUrl(videoUrl)) {
        return res.status(400).json({ message: 'Invalid video URL format' });
      }
      interview.videoUrl = videoUrl;
    }

    // Handle image update
    if (req.file) {
      if (interview.publicId && interview.publicId !== '') {
        try {
          await cloudinary.uploader.destroy(interview.publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      interview.image = req.file.path || req.file.secure_url || '';
      interview.publicId = req.file.filename || req.file.public_id || '';
    }

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private (Admin only)
const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.publicId && interview.publicId !== '') {
      try {
        await cloudinary.uploader.destroy(interview.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await interview.deleteOne();
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
};