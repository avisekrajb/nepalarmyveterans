const mongoose = require('mongoose');

const footerLogoSchema = new mongoose.Schema({
  logo: {
    url: String,
    publicId: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('FooterLogo', footerLogoSchema);