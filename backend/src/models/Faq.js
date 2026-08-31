const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  category: { type: String, default: '' },
  categoryEn: { type: String, default: '' },
  categoryNe: { type: String, default: '' },
  question: { type: String, default: '' },
  questionEn: { type: String, default: '' },
  questionNe: { type: String, default: '' },
  answer: { type: String, default: '' },
  answerEn: { type: String, default: '' },
  answerNe: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);