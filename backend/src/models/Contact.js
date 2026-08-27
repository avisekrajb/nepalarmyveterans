const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: String,
  addressEn: { type: String, default: '' },
  addressNe: { type: String, default: '' },
  phone: String,
  phoneEn: { type: String, default: '' },
  phoneNe: { type: String, default: '' },
  email: String,
  emailEn: { type: String, default: '' },
  emailNe: { type: String, default: '' },
  mapEmbed: String,
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);