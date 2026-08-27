const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  nameEn: { type: String, default: '' },
  nameNe: { type: String, default: '' },
  role: { type: String, default: '' },
  roleEn: { type: String, default: '' },
  roleNe: { type: String, default: '' },
  bio: { type: String, default: '' },
  bioEn: { type: String, default: '' },
  bioNe: { type: String, default: '' },
  image: { type: String, default: '' },
  publicId: { type: String, default: '' },
  // Hierarchy
  section: { 
    type: String, 
    enum: ['supervisors', 'advisors', 'centralCommittee', 'centralMembers', 'provinceCoordinators', 'districtCommittee'],
    required: true 
  },
  // For province coordinators
  province: { type: String, default: '' },
  provinceEn: { type: String, default: '' },
  provinceNe: { type: String, default: '' },
  provinceNumber: { type: Number, default: 0 },
  // For district committee members
  district: { type: String, default: '' },
  districtEn: { type: String, default: '' },
  districtNe: { type: String, default: '' },
  // Election & term
  electionDate: { type: Date, default: null },
  termYears: { type: Number, default: 5 },
  extended: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  inactiveReason: { type: String, default: '' },
  inactiveDate: { type: Date, default: null },
  // Order within section
  order: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual: check if term is active
memberSchema.methods.isTermActive = function() {
  if (!this.electionDate) return true; // No election date = always active
  const now = new Date();
  const election = new Date(this.electionDate);
  let termEnd = new Date(election);
  termEnd.setFullYear(termEnd.getFullYear() + this.termYears);
  if (this.extended) {
    termEnd.setFullYear(termEnd.getFullYear() + 1);
  }
  return now <= termEnd;
};

// Virtual: get remaining days
memberSchema.methods.getRemainingDays = function() {
  if (!this.electionDate) return null;
  const now = new Date();
  const election = new Date(this.electionDate);
  let termEnd = new Date(election);
  termEnd.setFullYear(termEnd.getFullYear() + this.termYears);
  if (this.extended) {
    termEnd.setFullYear(termEnd.getFullYear() + 1);
  }
  const diff = termEnd - now;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

// Virtual: can extend (4+ years passed but less than 5)
memberSchema.methods.canExtend = function() {
  if (!this.electionDate || this.extended) return false;
  const now = new Date();
  const election = new Date(this.electionDate);
  const yearsPassed = (now - election) / (1000 * 60 * 60 * 24 * 365);
  return yearsPassed >= 4 && yearsPassed < 5;
};

const centralCommitteeSchema = new mongoose.Schema({
  members: [memberSchema],
}, { timestamps: true });

// Index for fast queries
centralCommitteeSchema.index({ 'members.section': 1 });
centralCommitteeSchema.index({ 'members.province': 1 });
centralCommitteeSchema.index({ 'members.district': 1 });

module.exports = mongoose.model('CentralCommittee', centralCommitteeSchema);
