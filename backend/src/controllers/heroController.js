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

    const { carouselImages, seniors, content } = req.body;

    if (carouselImages) hero.carouselImages = carouselImages;
    if (seniors) hero.seniors = seniors;
    if (content) {
      hero.content = hero.content || {};
      // Merge only provided sections, leaving others untouched.
      Object.keys(content).forEach((key) => {
        if (content[key] !== undefined) hero.content[key] = content[key];
      });
    }

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCarouselImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({ carouselImages: [], seniors: [] });

    hero.carouselImages.push({
      url: req.file.path,
      publicId: req.file.filename,
      title: req.body.title || '',
      titleEn: req.body.titleEn || '',
      titleNe: req.body.titleNe || '',
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
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

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

const updateCarouselImage = async (req, res) => {
  try {
    const { index } = req.params;
    let hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

    const image = hero.carouselImages[index];
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const { title, titleEn, titleNe } = req.body;
    if (title !== undefined) image.title = title;
    if (titleEn !== undefined) image.titleEn = titleEn;
    if (titleNe !== undefined) image.titleNe = titleNe;

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSenior = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({ carouselImages: [], seniors: [] });

    const { name, nameEn, nameNe, role, roleEn, roleNe } = req.body;
    
    if (!name && !nameEn) {
      return res.status(400).json({ message: 'Name is required' });
    }

    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      publicId = req.file.filename || req.file.public_id || '';
    } else if (req.body.image) {
      imageUrl = req.body.image;
      publicId = req.body.publicId || '';
    }

    const newSenior = {
      name: name || nameEn || '',
      nameEn: nameEn || name || '',
      nameNe: nameNe || '',
      role: role || roleEn || '',
      roleEn: roleEn || role || '',
      roleNe: roleNe || '',
      image: imageUrl,
      publicId,
    };

    hero.seniors.push(newSenior);
    await hero.save();
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSenior = async (req, res) => {
  try {
    const { index } = req.params;
    let hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

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

const updateSenior = async (req, res) => {
  try {
    const { index } = req.params;
    let hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

    if (!hero.seniors[index]) {
      return res.status(404).json({ message: 'Senior not found' });
    }

    const { name, nameEn, nameNe, role, roleEn, roleNe } = req.body;
    const senior = hero.seniors[index];

    if (name !== undefined) senior.name = name;
    if (nameEn !== undefined) senior.nameEn = nameEn;
    if (nameNe !== undefined) senior.nameNe = nameNe;
    if (role !== undefined) senior.role = role;
    if (roleEn !== undefined) senior.roleEn = roleEn;
    if (roleNe !== undefined) senior.roleNe = roleNe;

    if (req.file) {
      if (senior.publicId) {
        await cloudinary.uploader.destroy(senior.publicId);
      }
      senior.image = req.file.path || req.file.secure_url || '';
      senior.publicId = req.file.filename || req.file.public_id || '';
    }

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHero, updateHero, uploadCarouselImage, deleteCarouselImage, updateCarouselImage, addSenior, deleteSenior, updateSenior };
