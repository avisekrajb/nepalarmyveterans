const Hero = require('../models/Hero');
const cloudinary = require('../config/cloudinary');

const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ carouselImages: [], seniors: [] });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ carouselImages: [], seniors: [] });
    }

    const { carouselImages, seniors } = req.body;
    
    if (carouselImages) {
      hero.carouselImages = carouselImages;
    }
    if (seniors) {
      hero.seniors = seniors;
    }

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCarouselImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ carouselImages: [], seniors: [] });
    }

    hero.carouselImages.push({
      url: req.file.path,
      publicId: req.file.filename,
    });

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCarouselImage = async (req, res) => {
  try {
    const { index } = req.params;
    let hero = await Hero.findOne();
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    const image = hero.carouselImages[index];
    if (image && image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    hero.carouselImages.splice(index, 1);
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSenior = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ carouselImages: [], seniors: [] });
    }

    const { name, role, image, publicId } = req.body;
    hero.seniors.push({ name, role, image, publicId });
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSenior = async (req, res) => {
  try {
    const { index } = req.params;
    let hero = await Hero.findOne();
    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' });
    }

    const senior = hero.seniors[index];
    if (senior && senior.publicId) {
      await cloudinary.uploader.destroy(senior.publicId);
    }

    hero.seniors.splice(index, 1);
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHero,
  updateHero,
  uploadCarouselImage,
  deleteCarouselImage,
  addSenior,
  deleteSenior,
};