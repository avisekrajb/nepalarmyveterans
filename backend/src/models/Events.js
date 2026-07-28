const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: Date,
  location: String,
  image: String,
  publicId: String,
}, { timestamps: true });

module.exports = mongoose.model('Events', eventsSchema);