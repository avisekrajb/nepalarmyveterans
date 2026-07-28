const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Nepal Army Association',
  },
  siteDescription: {
    type: String,
    default: 'Nepal National Ex-Army Association',
  },
  logoWidth: {
    type: Number,
    default: 80,
  },
  logoHeight: {
    type: Number,
    default: 80,
  },
  logoPosition: {
    type: String,
    default: 'left',
    enum: ['left', 'center', 'right'],
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: '',
  },
  maintenanceEndDate: {
    type: Date,
    default: null,
  },
  lockedSections: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);