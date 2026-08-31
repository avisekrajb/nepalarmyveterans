const TaskProgram = require('../models/TaskProgram');
const { logActivity } = require('../middleware/logger');

const getTaskPrograms = async (req, res) => {
  try {
    const programs = await TaskProgram.find().sort({ order: 1, createdAt: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTaskProgram = async (req, res) => {
  try {
    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, order } = req.body;
    const program = await TaskProgram.create({
      title: title || titleEn || titleNe || '',
      titleEn: titleEn || titleNe || title || '',
      titleNe: titleNe || titleEn || title || '',
      description: description || descriptionEn || descriptionNe || '',
      descriptionEn: descriptionEn || descriptionNe || description || '',
      descriptionNe: descriptionNe || descriptionEn || description || '',
      order: parseInt(order) || 0,
    });
    await logActivity({ req, action: 'CREATE', module: 'TASK_PROGRAMS', details: { title: program.titleEn } });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await TaskProgram.findById(id);
    if (!program) return res.status(404).json({ message: 'Task program not found' });

    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, order } = req.body;
    if (title !== undefined) program.title = title;
    if (titleEn !== undefined) program.titleEn = titleEn;
    if (titleNe !== undefined) program.titleNe = titleNe;
    if (description !== undefined) program.description = description;
    if (descriptionEn !== undefined) program.descriptionEn = descriptionEn;
    if (descriptionNe !== undefined) program.descriptionNe = descriptionNe;
    if (order !== undefined) program.order = parseInt(order) || 0;

    await program.save();
    await logActivity({ req, action: 'UPDATE', module: 'TASK_PROGRAMS', details: { title: program.titleEn } });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTaskProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await TaskProgram.findById(id);
    if (!program) return res.status(404).json({ message: 'Task program not found' });

    await program.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'TASK_PROGRAMS', details: { title: program.titleEn } });
    res.json({ message: 'Task program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTaskPrograms,
  createTaskProgram,
  updateTaskProgram,
  deleteTaskProgram,
};