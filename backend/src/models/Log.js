const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminEmail: String,
  action: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  details: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);