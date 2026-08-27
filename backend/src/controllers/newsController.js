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
    const { title, titleEn, titleNe, content, contentEn, contentNe, date } = req.body;
    const news = await News.create({
      title: title || titleEn || '',
      titleEn: titleEn || title || '',
      titleNe: titleNe || '',
      content: content || contentEn || '',
      contentEn: contentEn || content || '',
      contentNe: contentNe || '',
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
    const { title, titleEn, titleNe, content, contentEn, contentNe, date } = req.body;
    
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (title !== undefined) news.title = title;
    if (titleEn !== undefined) news.titleEn = titleEn;
    if (titleNe !== undefined) news.titleNe = titleNe;
    if (content !== undefined) news.content = content;
    if (contentEn !== undefined) news.contentEn = contentEn;
    if (contentNe !== undefined) news.contentNe = contentNe;
    if (date !== undefined) news.date = date;
    
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
