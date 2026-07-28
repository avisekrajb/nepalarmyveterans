const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  carouselImages: [{
    url: String,
    publicId: String,
  }],
  seniors: [{
    name: String,
    role: String,
    image: String,
    publicId: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);