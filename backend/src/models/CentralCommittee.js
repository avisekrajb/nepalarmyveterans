const mongoose = require('mongoose');

const centralCommitteeSchema = new mongoose.Schema({
  // Main Committee
  title: {
    type: String,
    default: 'केन्द्रीय कार्यसमिति',
  },
  members: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // District Committee
  districtTitle: {
    type: String,
    default: 'जिल्ला कार्यसमिति',
  },
  districtMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // Regional Committee
  regionalTitle: {
    type: String,
    default: 'क्षेत्रीय सभापति',
  },
  regionalMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // Unit Committee
  unitTitle: {
    type: String,
    default: 'इकाई सभापति',
  },
  unitMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // Provincial Coordinators
  provincialTitle: {
    type: String,
    default: 'प्रदेश संयोजक',
  },
  provincialMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // Central Members
  centralMembersTitle: {
    type: String,
    default: 'केन्द्रीय सदस्य',
  },
  centralMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
  
  // Advisory Council
  advisoryTitle: {
    type: String,
    default: 'सलाहकार मण्डल',
  },
  advisoryMembers: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    publicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  }],
}, { timestamps: true });

module.exports = mongoose.model('CentralCommittee', centralCommitteeSchema);