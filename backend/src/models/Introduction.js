const mongoose = require('mongoose');

const introductionSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleEn: { type: String, default: '' },
  titleNe: { type: String, default: '' },
  content: { type: String, default: '' },
  contentEn: { type: String, default: '' },
  contentNe: { type: String, default: '' },
  image: String,
  publicId: String,
}, { timestamps: true });

module.exports = mongoose.model('Introduction', introductionSchema);
