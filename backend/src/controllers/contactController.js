const Contact = require('../models/Contact');

const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({
        address: '',
        phone: '',
        email: '',
        mapEmbed: '',
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create(req.body);
    } else {
      const { address, phone, email, mapEmbed } = req.body;
      contact.address = address || contact.address;
      contact.phone = phone || contact.phone;
      contact.email = email || contact.email;
      contact.mapEmbed = mapEmbed || contact.mapEmbed;
    }
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContact,
  updateContact,
};