const mongoose = require('mongoose');

const noticesSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleEn: { type: String, default: '' },
  titleNe: { type: String, default: '' },
  content: { type: String, default: '' },
  contentEn: { type: String, default: '' },
  contentNe: { type: String, default: '' },
  image: { type: String, default: '' },
  publicId: { type: String, default: '' },
  showInModal: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

noticesSchema.virtual('formattedDate').get(function() {
  return this.date ? new Date(this.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';
});

module.exports = mongoose.model('Notices', noticesSchema);
