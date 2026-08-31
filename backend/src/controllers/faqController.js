const Faq = require('../models/Faq');
const { logActivity } = require('../middleware/logger');

const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFaq = async (req, res) => {
  try {
    const { category, categoryEn, categoryNe, question, questionEn, questionNe, answer, answerEn, answerNe, order } = req.body;
    const faq = await Faq.create({
      category: category || categoryEn || categoryNe || '',
      categoryEn: categoryEn || categoryNe || category || '',
      categoryNe: categoryNe || categoryEn || category || '',
      question: question || questionEn || questionNe || '',
      questionEn: questionEn || questionNe || question || '',
      questionNe: questionNe || questionEn || question || '',
      answer: answer || answerEn || answerNe || '',
      answerEn: answerEn || answerNe || answer || '',
      answerNe: answerNe || answerEn || answer || '',
      order: parseInt(order) || 0,
    });
    await logActivity({ req, action: 'CREATE', module: 'FAQS', details: { question: faq.questionEn } });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findById(id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    const { category, categoryEn, categoryNe, question, questionEn, questionNe, answer, answerEn, answerNe, order } = req.body;
    if (category !== undefined) faq.category = category;
    if (categoryEn !== undefined) faq.categoryEn = categoryEn;
    if (categoryNe !== undefined) faq.categoryNe = categoryNe;
    if (question !== undefined) faq.question = question;
    if (questionEn !== undefined) faq.questionEn = questionEn;
    if (questionNe !== undefined) faq.questionNe = questionNe;
    if (answer !== undefined) faq.answer = answer;
    if (answerEn !== undefined) faq.answerEn = answerEn;
    if (answerNe !== undefined) faq.answerNe = answerNe;
    if (order !== undefined) faq.order = parseInt(order) || 0;

    await faq.save();
    await logActivity({ req, action: 'UPDATE', module: 'FAQS', details: { question: faq.questionEn } });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findById(id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    await faq.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'FAQS', details: { question: faq.questionEn } });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};