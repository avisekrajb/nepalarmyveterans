const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: String,
  phone: String,
  email: String,
  mapEmbed: String,
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);