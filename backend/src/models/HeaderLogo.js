const mongoose = require('mongoose');

const headerLogoSchema = new mongoose.Schema({
  leftLogo: {
    url: String,
    publicId: String,
  },
  rightLogo: {
    url: String,
    publicId: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('HeaderLogo', headerLogoSchema);