const mongoose = require('mongoose');

const localizedSchema = ({ en = '', ne = '' } = {}) => ({
  en: { type: String, default: en },
  ne: { type: String, default: ne },
});

const heroContentSchema = new mongoose.Schema({
  // Hero title + subtitle (both languages)
  heroTitle: { type: mongoose.Schema.Types.Mixed, default: {} },
  heroSubtitle: { type: mongoose.Schema.Types.Mixed, default: {} },
  // About the Association section label + heading
  aboutLabel: { type: mongoose.Schema.Types.Mixed, default: {} },
  aboutHeading: { type: mongoose.Schema.Types.Mixed, default: {} },
  aboutSubHeading: { type: mongoose.Schema.Types.Mixed, default: {} },
  // About paragraphs (each with en/ne)
  aboutParagraphs: { type: [mongoose.Schema.Types.Mixed], default: [] },
  // Pillars: array of { title:{en,ne}, text:{en,ne} }
  pillars: [{
    title: { type: mongoose.Schema.Types.Mixed, default: {} },
    text: { type: mongoose.Schema.Types.Mixed, default: {} },
  }],
  // Services: array of { title:{en,ne}, desc:{en,ne} }
  services: [{
    title: { type: mongoose.Schema.Types.Mixed, default: {} },
    desc: { type: mongoose.Schema.Types.Mixed, default: {} },
  }],
  // Journey label + timeline: array of { year:{en,ne}, title:{en,ne}, desc:{en,ne} }
  journeyLabel: { type: mongoose.Schema.Types.Mixed, default: {} },
  timeline: [{
    year: { type: mongoose.Schema.Types.Mixed, default: {} },
    title: { type: mongoose.Schema.Types.Mixed, default: {} },
    desc: { type: mongoose.Schema.Types.Mixed, default: {} },
  }],
}, { _id: false });

const heroSchema = new mongoose.Schema({
  content: { type: heroContentSchema, default: () => ({}) },
  carouselImages: [{
    url: String,
    publicId: String,
    title: { type: String, default: '' },
    titleEn: { type: String, default: '' },
    titleNe: { type: String, default: '' },
  }],
  seniors: [{
    name: { type: String, default: '' },
    nameEn: { type: String, default: '' },
    nameNe: { type: String, default: '' },
    role: { type: String, default: '' },
    roleEn: { type: String, default: '' },
    roleNe: { type: String, default: '' },
    image: String,
    publicId: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
