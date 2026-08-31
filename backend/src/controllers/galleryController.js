const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('../middleware/logger');

const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type, title } = req.body;
    const item = await Gallery.create({
      type: type || 'image',
      title: title || '',
      url: req.file.path,
      publicId: req.file.filename,
      size: req.file.size,
    });
    await logActivity({ req, action: 'CREATE', module: 'GALLERY', details: { title: item.title, type: item.type } });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const { title } = req.body;
    if (title !== undefined) {
      item.title = title;
    }

    if (req.file) {
      if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
      }
      item.url = req.file.path;
      item.publicId = req.file.filename;
      item.size = req.file.size;
      const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';
      item.type = type;
    }

    await item.save();
    await logActivity({ req, action: 'UPDATE', module: 'GALLERY', details: { title: item.title } });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    await item.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'GALLERY', details: { title: item.title } });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGallery,
  uploadGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};