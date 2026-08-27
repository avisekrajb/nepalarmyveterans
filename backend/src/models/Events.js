const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleEn: { type: String, default: '' },
  titleNe: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionEn: { type: String, default: '' },
  descriptionNe: { type: String, default: '' },
  location: { type: String, default: '' },
  locationEn: { type: String, default: '' },
  locationNe: { type: String, default: '' },
  date: Date,
  image: String,
  publicId: String,
}, { timestamps: true });

module.exports = mongoose.model('Events', eventsSchema);
