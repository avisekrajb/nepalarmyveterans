const Leadership = require('../models/Leadership');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('../middleware/logger');

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
    const { name, nameEn, nameNe, role, roleEn, roleNe, bio, bioEn, bioNe } = req.body;
    const leader = await Leadership.create({
      name: name || nameEn || '',
      nameEn: nameEn || name || '',
      nameNe: nameNe || '',
      role: role || roleEn || '',
      roleEn: roleEn || role || '',
      roleNe: roleNe || '',
      bio: bio || bioEn || '',
      bioEn: bioEn || bio || '',
      bioNe: bioNe || '',
      image: req.file ? req.file.path : '',
      publicId: req.file ? req.file.filename : '',
    });
    await logActivity({ req, action: 'CREATE', module: 'LEADERSHIP', details: { name: leader.name } });
    res.status(201).json(leader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameEn, nameNe, role, roleEn, roleNe, bio, bioEn, bioNe } = req.body;
    
    const leader = await Leadership.findById(id);
    if (!leader) return res.status(404).json({ message: 'Leader not found' });

    if (name !== undefined) leader.name = name;
    if (nameEn !== undefined) leader.nameEn = nameEn;
    if (nameNe !== undefined) leader.nameNe = nameNe;
    if (role !== undefined) leader.role = role;
    if (roleEn !== undefined) leader.roleEn = roleEn;
    if (roleNe !== undefined) leader.roleNe = roleNe;
    if (bio !== undefined) leader.bio = bio;
    if (bioEn !== undefined) leader.bioEn = bioEn;
    if (bioNe !== undefined) leader.bioNe = bioNe;
    
    if (req.file) {
      if (leader.publicId) {
        await cloudinary.uploader.destroy(leader.publicId);
      }
      leader.image = req.file.path;
      leader.publicId = req.file.filename;
    }

    await leader.save();
    await logActivity({ req, action: 'UPDATE', module: 'LEADERSHIP', details: { name: leader.name } });
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const leader = await Leadership.findById(id);
    if (!leader) return res.status(404).json({ message: 'Leader not found' });

    if (leader.publicId) {
      await cloudinary.uploader.destroy(leader.publicId);
    }

    await leader.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'LEADERSHIP', details: { name: leader.name } });
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeadership, createLeader, updateLeader, deleteLeader };
