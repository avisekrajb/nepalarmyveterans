const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  guest: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
  },
  team: {
    type: String,
    default: '',
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  image: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  publicId: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for formatted date
interviewSchema.virtual('formattedDate').get(function() {
  return this.date ? new Date(this.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';
});

module.exports = mongoose.model('Interview', interviewSchema);