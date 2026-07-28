const mongoose = require('mongoose');

const leadershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: String,
  publicId: String,
  order: Number,
}, { timestamps: true });

module.exports = mongoose.model('Leadership', leadershipSchema);