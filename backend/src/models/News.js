const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleEn: { type: String, default: '' },
  titleNe: { type: String, default: '' },
  content: { type: String, default: '' },
  contentEn: { type: String, default: '' },
  contentNe: { type: String, default: '' },
  image: String,
  publicId: String,
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
