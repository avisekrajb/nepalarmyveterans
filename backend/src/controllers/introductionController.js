const Introduction = require('../models/Introduction');
const cloudinary = require('../config/cloudinary');

const getIntroduction = async (req, res) => {
  try {
    let intro = await Introduction.findOne();
    if (!intro) {
      intro = await Introduction.create({
        title: 'Introduction',
        content: '',
        image: '',
        publicId: '',
      });
    }
    res.json(intro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIntroduction = async (req, res) => {
  try {
    let intro = await Introduction.findOne();
    const { title, content } = req.body;

    if (!intro) {
      intro = await Introduction.create({
        title: title || 'Introduction',
        content: content || '',
        image: req.file ? req.file.path : '',
        publicId: req.file ? req.file.filename : '',
      });
    } else {
      intro.title = title || intro.title;
      intro.content = content || intro.content;
      if (req.file) {
        if (intro.publicId) {
          await cloudinary.uploader.destroy(intro.publicId);
        }
        intro.image = req.file.path;
        intro.publicId = req.file.filename;
      }
    }
    await intro.save();
    res.json(intro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIntroduction,
  updateIntroduction,
};