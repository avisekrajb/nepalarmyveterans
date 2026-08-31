const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  ne: { type: String, default: '' },
}, { _id: false });

const trainingSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  nameEn: { type: String, default: '' },
  nameNe: { type: String, default: '' },
  duration: { type: String, default: '' },
  eligibility: { type: String, default: '' },
  eligibilityEn: { type: String, default: '' },
  eligibilityNe: { type: String, default: '' },
  features: [featureSchema],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);