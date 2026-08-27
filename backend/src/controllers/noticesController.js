const Notices = require('../models/Notices');
const cloudinary = require('../config/cloudinary');

const getNotices = async (req, res) => {
  try {
    const notices = await Notices.find().sort({ date: -1, createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getModalNotice = async (req, res) => {
  try {
    const notice = await Notices.findOne({ showInModal: true }).sort({ date: -1 });
    if (notice) {
      res.json(notice);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'modal') {
      return getModalNotice(req, res);
    }
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, titleEn, titleNe, content, contentEn, contentNe, date, showInModal } = req.body;

    if (showInModal === 'true' || showInModal === true) {
      await Notices.updateMany({ showInModal: true }, { showInModal: false });
    }

    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
    }

    const notice = await Notices.create({
      title: title || titleEn || '',
      titleEn: titleEn || title || '',
      titleNe: titleNe || '',
      content: content || contentEn || '',
      contentEn: contentEn || content || '',
      contentNe: contentNe || '',
      date: date || Date.now(),
      image: imageUrl,
      publicId: publicId,
      showInModal: showInModal === 'true' || showInModal === true,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleEn, titleNe, content, contentEn, contentNe, date, showInModal } = req.body;
    
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (showInModal === 'true' || showInModal === true) {
      await Notices.updateMany({ _id: { $ne: id }, showInModal: true }, { showInModal: false });
    }

    if (title !== undefined) notice.title = title;
    if (titleEn !== undefined) notice.titleEn = titleEn;
    if (titleNe !== undefined) notice.titleNe = titleNe;
    if (content !== undefined) notice.content = content;
    if (contentEn !== undefined) notice.contentEn = contentEn;
    if (contentNe !== undefined) notice.contentNe = contentNe;
    if (date !== undefined) notice.date = date;
    notice.showInModal = showInModal === 'true' || showInModal === true;
    
    if (req.file) {
      if (notice.publicId && notice.publicId !== '') {
        try {
          await cloudinary.uploader.destroy(notice.publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      notice.image = req.file.path || req.file.secure_url || '';
      notice.publicId = req.file.filename || req.file.public_id || '';
    }

    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (notice.publicId && notice.publicId !== '') {
      try {
        await cloudinary.uploader.destroy(notice.publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleModalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { showInModal } = req.body;
    
    const notice = await Notices.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (showInModal === true) {
      await Notices.updateMany({ _id: { $ne: id }, showInModal: true }, { showInModal: false });
    }

    notice.showInModal = showInModal;
    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkDeleteNotices = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No notice IDs provided' });
    }

    const notices = await Notices.find({ _id: { $in: ids } });
    for (const notice of notices) {
      if (notice.publicId && notice.publicId !== '') {
        try { await cloudinary.uploader.destroy(notice.publicId); } catch (e) {}
      }
    }

    await Notices.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${ids.length} notices deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNoticesPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const notices = await Notices.find().sort({ date: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Notices.countDocuments();
    res.json({
      notices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNoticesCount = async (req, res) => {
  try {
    const total = await Notices.countDocuments();
    const withImages = await Notices.countDocuments({ image: { $ne: '' } });
    const modalNotice = await Notices.findOne({ showInModal: true });
    res.json({ total, withImages, hasModalNotice: !!modalNotice, modalNoticeId: modalNotice?._id || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotices, getModalNotice, getNoticeById, createNotice, updateNotice,
  deleteNotice, toggleModalStatus, bulkDeleteNotices, getNoticesPaginated, getNoticesCount,
};
