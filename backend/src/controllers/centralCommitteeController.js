const CentralCommittee = require('../models/CentralCommittee');
const cloudinary = require('../config/cloudinary');

// @desc    Get all committee members
// @route   GET /api/central-committee
// @access  Public
const getMembers = async (req, res) => {
  try {
    const members = await CentralCommittee.find().sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a committee member
// @route   POST /api/central-committee
// @access  Private
const createMember = async (req, res) => {
  try {
    const { name, role, bio } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    const member = await CentralCommittee.create({
      name,
      role,
      bio: bio || '',
      image: req.file ? req.file.path : '',
      publicId: req.file ? req.file.filename : '',
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a committee member
// @route   PUT /api/central-committee/:id
// @access  Private
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio } = req.body;
    
    const member = await CentralCommittee.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.name = name || member.name;
    member.role = role || member.role;
    member.bio = bio !== undefined ? bio : member.bio;
    
    if (req.file) {
      if (member.publicId) {
        await cloudinary.uploader.destroy(member.publicId);
      }
      member.image = req.file.path;
      member.publicId = req.file.filename;
    }

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a committee member
// @route   DELETE /api/central-committee/:id
// @access  Private
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await CentralCommittee.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.publicId) {
      await cloudinary.uploader.destroy(member.publicId);
    }

    await member.deleteOne();
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
};