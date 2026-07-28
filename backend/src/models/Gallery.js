const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  title: String,
  url: String,
  publicId: String,
  size: Number,
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);