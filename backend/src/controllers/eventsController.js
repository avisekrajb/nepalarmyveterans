const Events = require('../models/Events');
const cloudinary = require('../config/cloudinary');

const getEvents = async (req, res) => {
  try {
    const events = await Events.find().sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, location, locationEn, locationNe, date } = req.body;
    const event = await Events.create({
      title: title || titleEn || '',
      titleEn: titleEn || title || '',
      titleNe: titleNe || '',
      description: description || descriptionEn || '',
      descriptionEn: descriptionEn || description || '',
      descriptionNe: descriptionNe || '',
      location: location || locationEn || '',
      locationEn: locationEn || location || '',
      locationNe: locationNe || '',
      date,
      image: req.file ? req.file.path : '',
      publicId: req.file ? req.file.filename : '',
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleEn, titleNe, description, descriptionEn, descriptionNe, location, locationEn, locationNe, date } = req.body;
    
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (title !== undefined) event.title = title;
    if (titleEn !== undefined) event.titleEn = titleEn;
    if (titleNe !== undefined) event.titleNe = titleNe;
    if (description !== undefined) event.description = description;
    if (descriptionEn !== undefined) event.descriptionEn = descriptionEn;
    if (descriptionNe !== undefined) event.descriptionNe = descriptionNe;
    if (location !== undefined) event.location = location;
    if (locationEn !== undefined) event.locationEn = locationEn;
    if (locationNe !== undefined) event.locationNe = locationNe;
    if (date !== undefined) event.date = date;
    
    if (req.file) {
      if (event.publicId) {
        await cloudinary.uploader.destroy(event.publicId);
      }
      event.image = req.file.path;
      event.publicId = req.file.filename;
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.publicId) {
      await cloudinary.uploader.destroy(event.publicId);
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
