const Introduction = require('../models/Introduction');
const cloudinary = require('../config/cloudinary');

const getIntroduction = async (req, res) => {
  try {
    let intro = await Introduction.findOne();
    if (!intro) {
      intro = await Introduction.create({ title: '', titleEn: '', titleNe: '', content: '', contentEn: '', contentNe: '', image: '', publicId: '' });
    }
    res.json(intro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIntroduction = async (req, res) => {
  try {
    let intro = await Introduction.findOne();
    const { title, titleEn, titleNe, content, contentEn, contentNe } = req.body;

    if (!intro) {
      intro = await Introduction.create({
        title: title || titleEn || '',
        titleEn: titleEn || title || '',
        titleNe: titleNe || '',
        content: content || contentEn || '',
        contentEn: contentEn || content || '',
        contentNe: contentNe || '',
        image: req.file ? req.file.path : '',
        publicId: req.file ? req.file.filename : '',
      });
    } else {
      if (title !== undefined) intro.title = title;
      if (titleEn !== undefined) intro.titleEn = titleEn;
      if (titleNe !== undefined) intro.titleNe = titleNe;
      if (content !== undefined) intro.content = content;
      if (contentEn !== undefined) intro.contentEn = contentEn;
      if (contentNe !== undefined) intro.contentNe = contentNe;
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

module.exports = { getIntroduction, updateIntroduction };
