const mongoose = require('mongoose');

const quickLinkSchema = new mongoose.Schema(
  {
    key: { type: String, default: '' },
    labelEn: { type: String, default: '' },
    labelNe: { type: String, default: '' },
    valueEn: { type: String, default: '' },
    valueNe: { type: String, default: '' },
    action: { type: String, default: '' },
    icon: { type: String, default: 'phone' },
  },
  { _id: false }
);

const faqConfigSchema = new mongoose.Schema(
  {
    titleEn: { type: String, default: '' },
    titleNe: { type: String, default: '' },
    quickLinks: { type: [quickLinkSchema], default: [] },
    supportTitleEn: { type: String, default: '' },
    supportTitleNe: { type: String, default: '' },
    supportTextEn: { type: String, default: '' },
    supportTextNe: { type: String, default: '' },
    supportButtonEn: { type: String, default: '' },
    supportButtonNe: { type: String, default: '' },
    supportButtonAction: { type: String, default: '/contact' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FaqConfig', faqConfigSchema);
