const Leadership = require('../models/Leadership');
const cloudinary = require('../config/cloudinary');

const getLeadership = async (req, res) => {
  try {
    const leaders = await Leadership.find().sort({ order: 1, createdAt: -1 });
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLeader = async (req, res) => {
  try {
    const { name, role, bio } = req.body;
    const leader = await Leadership.create({
      name,
      role,
      bio,
      image: req.file ? req.file.path : '',
      publicId: req.file ? req.file.filename : '',
    });
    res.status(201).json(leader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio } = req.body;
    
    const leader = await Leadership.findById(id);
    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    leader.name = name || leader.name;
    leader.role = role || leader.role;
    leader.bio = bio || leader.bio;
    
    if (req.file) {
      if (leader.publicId) {
        await cloudinary.uploader.destroy(leader.publicId);
      }
      leader.image = req.file.path;
      leader.publicId = req.file.filename;
    }

    await leader.save();
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const leader = await Leadership.findById(id);
    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    if (leader.publicId) {
      await cloudinary.uploader.destroy(leader.publicId);
    }

    await leader.deleteOne();
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeadership,
  createLeader,
  updateLeader,
  deleteLeader,
};