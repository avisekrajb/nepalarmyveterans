const Training = require('../models/Training');
const { logActivity } = require('../middleware/logger');

const getTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ order: 1, createdAt: 1 });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const parseFeatures = (raw) => {
  if (Array.isArray(raw)) {
    return raw.map((f) => {
      if (f && typeof f === 'object' && ('en' in f || 'ne' in f)) {
        return { en: f.en || '', ne: f.ne || '' };
      }
      const str = String(f || '').trim();
      return { en: str, ne: str };
    });
  }
  return [];
};

const createTraining = async (req, res) => {
  try {
    const { name, nameEn, nameNe, duration, eligibility, eligibilityEn, eligibilityNe, features, order } = req.body;
    const training = await Training.create({
      name: name || nameEn || nameNe || '',
      nameEn: nameEn || nameNe || name || '',
      nameNe: nameNe || nameEn || name || '',
      duration: duration || '',
      eligibility: eligibility || eligibilityEn || eligibilityNe || '',
      eligibilityEn: eligibilityEn || eligibilityNe || eligibility || '',
      eligibilityNe: eligibilityNe || eligibilityEn || eligibility || '',
      features: parseFeatures(features),
      order: parseInt(order) || 0,
    });
    await logActivity({ req, action: 'CREATE', module: 'TRAINING', details: { name: training.nameEn } });
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    const { name, nameEn, nameNe, duration, eligibility, eligibilityEn, eligibilityNe, features, order } = req.body;
    if (name !== undefined) training.name = name;
    if (nameEn !== undefined) training.nameEn = nameEn;
    if (nameNe !== undefined) training.nameNe = nameNe;
    if (duration !== undefined) training.duration = duration;
    if (eligibility !== undefined) training.eligibility = eligibility;
    if (eligibilityEn !== undefined) training.eligibilityEn = eligibilityEn;
    if (eligibilityNe !== undefined) training.eligibilityNe = eligibilityNe;
    if (features !== undefined) training.features = parseFeatures(features);
    if (order !== undefined) training.order = parseInt(order) || 0;

    await training.save();
    await logActivity({ req, action: 'UPDATE', module: 'TRAINING', details: { name: training.nameEn } });
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);
    if (!training) return res.status(404).json({ message: 'Training not found' });

    await training.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'TRAINING', details: { name: training.nameEn } });
    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
};