const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

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
    res.status(201).json(item);
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
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGallery,
  uploadGalleryItem,
  deleteGalleryItem,
};