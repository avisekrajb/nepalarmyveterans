const ContactMessage = require('../models/ContactMessage');

// @desc    Get all contact messages
// @route   GET /api/contact-messages
// @access  Private (Admin only)
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact-messages/:id
// @access  Private (Admin only)
const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a contact message
// @route   POST /api/contact-messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // Get IP and User Agent
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      ip,
      userAgent,
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update message status
// @route   PUT /api/contact-messages/:id/status
// @access  Private (Admin only)
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.status = status || message.status;
    await message.save();

    res.json({
      success: true,
      message: 'Message status updated',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact-messages/:id
// @access  Private (Admin only)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage,
};