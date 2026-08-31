const Interview = require('../models/Interview');
const cloudinary = require('../config/cloudinary');
const { logActivity } = require('../middleware/logger');

const isValidUrl = (string) => {
  try { new URL(string); return true; } catch (_) { return false; }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: -1, createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInterview = async (req, res) => {
  try {
    const { title, titleEn, titleNe, guest, guestEn, guestNe, team, content, contentEn, contentNe, type, videoUrl, date } = req.body;

    let imageUrl = '';
    let publicId = '';
    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
    }

    let finalVideoUrl = videoUrl || '';
    if (finalVideoUrl && !isValidUrl(finalVideoUrl)) {
      return res.status(400).json({ message: 'Invalid video URL format' });
    }

    const interview = await Interview.create({
      title: title || titleEn || '',
      titleEn: titleEn || title || '',
      titleNe: titleNe || '',
      guest: guest || guestEn || '',
      guestEn: guestEn || guest || '',
      guestNe: guestNe || '',
      team: team || '',
      content: content || contentEn || '',
      contentEn: contentEn || content || '',
      contentNe: contentNe || '',
      type: type || (req.file ? 'image' : 'video'),
      image: imageUrl,
      videoUrl: finalVideoUrl,
      publicId,
      date: date || Date.now(),
    });
    await logActivity({ req, action: 'CREATE', module: 'INTERVIEWS', details: { title: interview.title } });
    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleEn, titleNe, guest, guestEn, guestNe, team, content, contentEn, contentNe, type, videoUrl, date } = req.body;
    
    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    if (title !== undefined) interview.title = title;
    if (titleEn !== undefined) interview.titleEn = titleEn;
    if (titleNe !== undefined) interview.titleNe = titleNe;
    if (guest !== undefined) interview.guest = guest;
    if (guestEn !== undefined) interview.guestEn = guestEn;
    if (guestNe !== undefined) interview.guestNe = guestNe;
    if (team !== undefined) interview.team = team;
    if (content !== undefined) interview.content = content;
    if (contentEn !== undefined) interview.contentEn = contentEn;
    if (contentNe !== undefined) interview.contentNe = contentNe;
    if (type !== undefined) interview.type = type;
    if (date !== undefined) interview.date = date;
    
    if (videoUrl !== undefined) {
      if (videoUrl && !isValidUrl(videoUrl)) {
        return res.status(400).json({ message: 'Invalid video URL format' });
      }
      interview.videoUrl = videoUrl;
    }

    if (req.file) {
      if (interview.publicId && interview.publicId !== '') {
        try { await cloudinary.uploader.destroy(interview.publicId); } catch (e) {}
      }
      interview.image = req.file.path || req.file.secure_url || '';
      interview.publicId = req.file.filename || req.file.public_id || '';
    }

    await interview.save();
    await logActivity({ req, action: 'UPDATE', module: 'INTERVIEWS', details: { title: interview.title } });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    if (interview.publicId && interview.publicId !== '') {
      try { await cloudinary.uploader.destroy(interview.publicId); } catch (e) {}
    }

    await interview.deleteOne();
    await logActivity({ req, action: 'DELETE', module: 'INTERVIEWS', details: { title: interview.title } });
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInterviews, getInterviewById, createInterview, updateInterview, deleteInterview };
