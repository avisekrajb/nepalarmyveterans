const News = require('../models/News');
const cloudinary = require('../config/cloudinary');

const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1, createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const news = await News.create({
      title,
      content,
      date: date || Date.now(),
      image: req.file ? req.file.path : '',
      publicId: req.file ? req.file.filename : '',
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, date } = req.body;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.date = date || news.date;
    
    if (req.file) {
      if (news.publicId) {
        await cloudinary.uploader.destroy(news.publicId);
      }
      news.image = req.file.path;
      news.publicId = req.file.filename;
    }

    await news.save();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (news.publicId) {
      await cloudinary.uploader.destroy(news.publicId);
    }

    await news.deleteOne();
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNews,
  createNews,
  updateNews,
  deleteNews,
};