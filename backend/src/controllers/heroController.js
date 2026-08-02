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
    console.log('=== ADD SENIOR ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ carouselImages: [], seniors: [] });
    }

    const { name, role } = req.body;
    
    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    // Prepare senior data - handle both file upload and direct URL
    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      // If file was uploaded via multer
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
      console.log('Image uploaded via file:', { imageUrl, publicId });
    } else if (req.body.image) {
      // If image URL was provided directly
      imageUrl = req.body.image;
      publicId = req.body.publicId || '';
      console.log('Image URL provided:', imageUrl);
    }

    const newSenior = {
      name: name.trim(),
      role: role.trim(),
      image: imageUrl,
      publicId: publicId,
    };

    console.log('New senior data:', newSenior);

    hero.seniors.push(newSenior);
    await hero.save();
    
    console.log('Senior added successfully');
    res.status(201).json(hero);
  } catch (error) {
    console.error('Add senior error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
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