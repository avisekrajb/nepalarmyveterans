const mongoose = require('mongoose');

const centralCommitteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  publicId: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('CentralCommittee', centralCommitteeSchema);