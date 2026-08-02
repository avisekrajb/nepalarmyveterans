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
    console.error('Get notices error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get modal notice (single notice with showInModal: true)
// @route   GET /api/notices/modal
// @access  Public
// @desc    Get modal notice (single notice with showInModal: true)
// @route   GET /api/notices/modal
// @access  Public
const getModalNotice = async (req, res) => {
  try {
    const notice = await Notices.findOne({ showInModal: true }).sort({ date: -1 });
    
    console.log('🔍 Looking for modal notice...');
    console.log('📝 Notice found:', notice);
    
    if (notice) {
      res.json(notice);
    } else {
      // Return null with 200 status if no modal notice found
      res.status(200).json(null);
    }
  } catch (error) {
    console.error('❌ Get modal notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    // Check if ID is valid
    const { id } = req.params;
    
    // Skip if id is 'modal' (this shouldn't happen now, but just in case)
    if (id === 'modal') {
      return getModalNotice(req, res);
    }
    
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notice not found' 
      });
    }
    res.json(notice);
  } catch (error) {
    console.error('Get notice by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private (Admin only)
const createNotice = async (req, res) => {
  try {
    const { title, content, date, showInModal } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    // If this notice is set to show in modal, unset any other notice with showInModal true
    if (showInModal === 'true' || showInModal === true) {
      await Notices.updateMany(
        { showInModal: true }, 
        { showInModal: false }
      );
    }

    let imageUrl = '';
    let publicId = '';

    // Handle image upload if file exists
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
      showInModal: showInModal === 'true' || showInModal === true,
    });

    res.status(201).json({
      success: true,
      data: notice,
      message: 'Notice created successfully'
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private (Admin only)
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date, showInModal } = req.body;
    
    // Find notice
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notice not found' 
      });
    }

    // If this notice is set to show in modal, unset any other notice with showInModal true
    if (showInModal === 'true' || showInModal === true) {
      await Notices.updateMany(
        { _id: { $ne: id }, showInModal: true },
        { showInModal: false }
      );
    }

    // Update fields
    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.date = date || notice.date;
    notice.showInModal = showInModal === 'true' || showInModal === true;
    
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

    res.json({
      success: true,
      data: notice,
      message: 'Notice updated successfully'
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin only)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find notice
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notice not found' 
      });
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

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Toggle modal status for a notice
// @route   PUT /api/notices/:id/modal
// @access  Private (Admin only)
const toggleModalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { showInModal } = req.body;
    
    // Find notice
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notice not found' 
      });
    }

    // If setting to true, unset any other notice with showInModal true
    if (showInModal === true) {
      await Notices.updateMany(
        { _id: { $ne: id }, showInModal: true },
        { showInModal: false }
      );
    }

    notice.showInModal = showInModal;
    await notice.save();

    res.json({
      success: true,
      data: notice,
      message: `Notice ${showInModal ? 'set as' : 'removed from'} modal`
    });
  } catch (error) {
    console.error('Toggle modal status error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Bulk delete notices
// @route   DELETE /api/notices/bulk
// @access  Private (Admin only)
const bulkDeleteNotices = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No notice IDs provided'
      });
    }

    // Find all notices
    const notices = await Notices.find({ _id: { $in: ids } });
    
    // Delete images from Cloudinary for each notice
    for (const notice of notices) {
      if (notice.publicId && notice.publicId !== '') {
        try {
          await cloudinary.uploader.destroy(notice.publicId);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    // Delete all notices
    await Notices.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} notices deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete notices error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get notices with pagination
// @route   GET /api/notices/paginated
// @access  Public
const getNoticesPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const notices = await Notices.find()
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notices.countDocuments();

    res.json({
      notices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get paginated notices error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get notices count
// @route   GET /api/notices/count
// @access  Public
const getNoticesCount = async (req, res) => {
  try {
    const total = await Notices.countDocuments();
    const withImages = await Notices.countDocuments({ 
      image: { $ne: '' } 
    });
    const modalNotice = await Notices.findOne({ showInModal: true });
    
    res.json({
      total,
      withImages,
      hasModalNotice: !!modalNotice,
      modalNoticeId: modalNotice?._id || null
    });
  } catch (error) {
    console.error('Get notices count error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
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
};