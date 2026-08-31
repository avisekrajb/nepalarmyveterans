const SecurityRule = require('../models/SecurityRule');
const { logActivity } = require('../middleware/logger');

const getSecurityRules = async (req, res) => {
  try {
    const rules = await SecurityRule.find().sort({ order: 1, createdAt: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSecurityRule = async (req, res) => {
  try {
    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, order } = req.body;
    const rule = await SecurityRule.create({
      title: title || titleEn || titleNe || '',
      titleEn: titleEn || titleNe || title || '',
      titleNe: titleNe || titleEn || title || '',
      description: description || descriptionEn || descriptionNe || '',
      descriptionEn: descriptionEn || descriptionNe || description || '',
      descriptionNe: descriptionNe || descriptionEn || description || '',
      order: parseInt(order) || 0,
    });
    await logActivity({ req, action: 'CREATE', module: 'SECURITY_RULES', details: { title: rule.titleEn } });
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSecurityRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await SecurityRule.findById(id);
    if (!rule) return res.status(404).json({ message: 'Security rule not found' });

    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, order } = req.body;
    if (title !== undefined) rule.title = title;
    if (titleEn !== undefined) rule.titleEn = titleEn;
    if (titleNe !== undefined) rule.titleNe = titleNe;
    if (description !== undefined) rule.description = description;
    if (descriptionEn !== undefined) rule.descriptionEn = descriptionEn;
    if (descriptionNe !== undefined) rule.descriptionNe = descriptionNe;
    if (order !== undefined) rule.order = parseInt(order) || 0;

    await rule.save();
    await logActivity({ req, action: 'UPDATE', module: 'SECURITY_RULES', details: { title: rule.titleEn } });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSecurityRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await SecurityRule.findById(id);
    if (!rule) return res.status(404).json({ message: 'Security rule not found' });

    await rule.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'SECURITY_RULES', details: { title: rule.titleEn } });
    res.json({ message: 'Security rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSecurityRules,
  createSecurityRule,
  updateSecurityRule,
  deleteSecurityRule,
};