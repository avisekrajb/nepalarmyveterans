const mongoose = require('mongoose');

const leadershipSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  nameEn: { type: String, default: '' },
  nameNe: { type: String, default: '' },
  role: { type: String, default: '' },
  roleEn: { type: String, default: '' },
  roleNe: { type: String, default: '' },
  bio: { type: String, default: '' },
  bioEn: { type: String, default: '' },
  bioNe: { type: String, default: '' },
  image: String,
  publicId: String,
  order: Number,
}, { timestamps: true });

module.exports = mongoose.model('Leadership', leadershipSchema);
