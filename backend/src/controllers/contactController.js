const Contact = require('../models/Contact');

const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({
        address: '',
        addressEn: '',
        addressNe: '',
        phone: '',
        phoneEn: '',
        phoneNe: '',
        email: '',
        emailEn: '',
        emailNe: '',
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
      const { address, addressEn, addressNe, phone, phoneEn, phoneNe, email, emailEn, emailNe, mapEmbed } = req.body;
      contact.address = address || contact.address;
      contact.addressEn = addressEn !== undefined ? addressEn : contact.addressEn;
      contact.addressNe = addressNe !== undefined ? addressNe : contact.addressNe;
      contact.phone = phone || contact.phone;
      contact.phoneEn = phoneEn !== undefined ? phoneEn : contact.phoneEn;
      contact.phoneNe = phoneNe !== undefined ? phoneNe : contact.phoneNe;
      contact.email = email || contact.email;
      contact.emailEn = emailEn !== undefined ? emailEn : contact.emailEn;
      contact.emailNe = emailNe !== undefined ? emailNe : contact.emailNe;
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