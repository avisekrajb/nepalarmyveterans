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
    const { title, description, date, location } = req.body;
    const event = await Events.create({
      title,
      description,
      date,
      location,
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
    const { title, description, date, location } = req.body;
    
    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    
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