const HeaderLogo = require('../models/HeaderLogo');
const FooterLogo = require('../models/FooterLogo');
const cloudinary = require('../config/cloudinary');

// Header Logos
const getHeaderLogos = async (req, res) => {
  try {
    let logos = await HeaderLogo.findOne();
    if (!logos) {
      logos = await HeaderLogo.create({
        leftLogo: { url: '', publicId: '' },
        rightLogo: { url: '', publicId: '' },
      });
    }
    res.json(logos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHeaderLogos = async (req, res) => {
  try {
    let logos = await HeaderLogo.findOne();
    const { leftLogo, rightLogo } = req.body;

    if (!logos) {
      logos = await HeaderLogo.create({
        leftLogo: leftLogo || { url: '', publicId: '' },
        rightLogo: rightLogo || { url: '', publicId: '' },
      });
    } else {
      if (leftLogo) {
        if (logos.leftLogo.publicId) {
          await cloudinary.uploader.destroy(logos.leftLogo.publicId);
        }
        logos.leftLogo = leftLogo;
      }
      if (rightLogo) {
        if (logos.rightLogo.publicId) {
          await cloudinary.uploader.destroy(logos.rightLogo.publicId);
        }
        logos.rightLogo = rightLogo;
      }
    }
    await logos.save();
    res.json(logos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Footer Logo
const getFooterLogo = async (req, res) => {
  try {
    let logo = await FooterLogo.findOne();
    if (!logo) {
      logo = await FooterLogo.create({ logo: { url: '', publicId: '' } });
    }
    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFooterLogo = async (req, res) => {
  try {
    let logo = await FooterLogo.findOne();
    const { logo: logoData } = req.body;

    if (!logo) {
      logo = await FooterLogo.create({ logo: logoData || { url: '', publicId: '' } });
    } else {
      if (logo.logo.publicId) {
        await cloudinary.uploader.destroy(logo.logo.publicId);
      }
      logo.logo = logoData;
    }
    await logo.save();
    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHeaderLogos,
  updateHeaderLogos,
  getFooterLogo,
  updateFooterLogo,
};