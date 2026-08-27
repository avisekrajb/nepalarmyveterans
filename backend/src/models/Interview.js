const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleEn: { type: String, default: '' },
  titleNe: { type: String, default: '' },
  guest: { type: String, default: '' },
  guestEn: { type: String, default: '' },
  guestNe: { type: String, default: '' },
  team: { type: String, default: '' },
  content: { type: String, default: '' },
  contentEn: { type: String, default: '' },
  contentNe: { type: String, default: '' },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  image: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  publicId: { type: String, default: '' },
  date: { type: Date, default: Date.now },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

interviewSchema.virtual('formattedDate').get(function() {
  return this.date ? new Date(this.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';
});

module.exports = mongoose.model('Interview', interviewSchema);
