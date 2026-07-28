const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  path: String,
  method: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
  },
  month: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('VisitorLog', visitorLogSchema);