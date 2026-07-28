const mongoose = require('mongoose');

const introductionSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  publicId: String,
}, { timestamps: true });

module.exports = mongoose.model('Introduction', introductionSchema);