const Notices = require('../models/Notices');
const cloudinary = require('../config/cloudinary');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const notices = await Notices.find().sort({ date: -1, createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notices.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private (Admin only)
const createNotice = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let imageUrl = '';
    let publicId = '';

    // Check if file was uploaded
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
      console.log('Image uploaded to Cloudinary:', { imageUrl, publicId });
    }

    const notice = await Notices.create({
      title,
      content,
      date: date || Date.now(),
      image: imageUrl,
      publicId: publicId,
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private (Admin only)
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date } = req.body;
    
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.date = date || notice.date;
    
    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (notice.publicId && notice.publicId !== '') {
        try {
          await cloudinary.uploader.destroy(notice.publicId);
          console.log('Old image deleted from Cloudinary:', notice.publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      notice.image = req.file.path || req.file.secure_url || '';
      notice.publicId = req.file.filename || req.file.public_id || '';
      console.log('Image updated in Cloudinary:', { image: notice.image, publicId: notice.publicId });
    }

    await notice.save();
    res.json(notice);
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin only)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Delete image from Cloudinary if exists
    if (notice.publicId && notice.publicId !== '') {
      try {
        await cloudinary.uploader.destroy(notice.publicId);
        console.log('Image deleted from Cloudinary:', notice.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};