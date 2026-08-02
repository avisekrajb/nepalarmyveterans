const CentralCommittee = require('../models/CentralCommittee');
const cloudinary = require('../config/cloudinary');

// Get all committee data
const getMembers = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      data = await CentralCommittee.create({
        title: 'केन्द्रीय कार्यसमिति',
        members: [],
        districtTitle: 'जिल्ला कार्यसमिति',
        districtMembers: [],
        regionalTitle: 'क्षेत्रीय सभापति',
        regionalMembers: [],
        unitTitle: 'इकाई सभापति',
        unitMembers: [],
        provincialTitle: 'प्रदेश संयोजक',
        provincialMembers: [],
        centralMembersTitle: 'केन्द्रीय सदस्य',
        centralMembers: [],
        advisoryTitle: 'सलाहकार मण्डल',
        advisoryMembers: [],
      });
    }
    res.json(data);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get members by category
const getMembersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    
    const categoryMap = {
      'executive': 'members',
      'district': 'districtMembers',
      'regional': 'regionalMembers',
      'unit': 'unitMembers',
      'provincial': 'provincialMembers',
      'central': 'centralMembers',
      'advisory': 'advisoryMembers',
    };
    
    const key = categoryMap[category];
    if (!key || !data[key]) {
      return res.json([]);
    }
    
    res.json(data[key]);
  } catch (error) {
    console.error('Get members by category error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get executive committee
const getExecutiveCommittee = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    res.json(data.members || []);
  } catch (error) {
    console.error('Get executive committee error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get district committee
const getDistrictCommittee = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    res.json(data.districtMembers || []);
  } catch (error) {
    console.error('Get district committee error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get provincial coordinators
const getProvincialCoordinators = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    res.json(data.provincialMembers || []);
  } catch (error) {
    console.error('Get provincial coordinators error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get central members
const getCentralMembers = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    res.json(data.centralMembers || []);
  } catch (error) {
    console.error('Get central members error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get advisory council
const getAdvisoryCouncil = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.json([]);
    }
    res.json(data.advisoryMembers || []);
  } catch (error) {
    console.error('Get advisory council error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update entire committee
const updateCommittee = async (req, res) => {
  try {
    let data = await CentralCommittee.findOne();
    if (!data) {
      data = new CentralCommittee();
    }

    const {
      title,
      members,
      districtTitle,
      districtMembers,
      regionalTitle,
      regionalMembers,
      unitTitle,
      unitMembers,
      provincialTitle,
      provincialMembers,
      centralMembersTitle,
      centralMembers,
      advisoryTitle,
      advisoryMembers,
    } = req.body;

    if (title) data.title = title;
    if (members) data.members = members;
    if (districtTitle) data.districtTitle = districtTitle;
    if (districtMembers) data.districtMembers = districtMembers;
    if (regionalTitle) data.regionalTitle = regionalTitle;
    if (regionalMembers) data.regionalMembers = regionalMembers;
    if (unitTitle) data.unitTitle = unitTitle;
    if (unitMembers) data.unitMembers = unitMembers;
    if (provincialTitle) data.provincialTitle = provincialTitle;
    if (provincialMembers) data.provincialMembers = provincialMembers;
    if (centralMembersTitle) data.centralMembersTitle = centralMembersTitle;
    if (centralMembers) data.centralMembers = centralMembers;
    if (advisoryTitle) data.advisoryTitle = advisoryTitle;
    if (advisoryMembers) data.advisoryMembers = advisoryMembers;

    await data.save();
    res.json(data);
  } catch (error) {
    console.error('Update committee error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add member to specific section
const addMember = async (req, res) => {
  try {
    const { section } = req.params;
    const { name, role, bio } = req.body;
    
    console.log('=== ADD MEMBER ===');
    console.log('Section:', section);
    console.log('Body:', { name, role, bio });
    console.log('File:', req.file ? req.file.path : 'No file');

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    let data = await CentralCommittee.findOne();
    if (!data) {
      data = new CentralCommittee();
      await data.save();
    }

    // Get the section array
    let sectionArray = data[section];
    if (!sectionArray) {
      sectionArray = [];
      data[section] = sectionArray;
    }

    // Prepare member data
    const newMember = {
      name: name.trim(),
      role: role.trim(),
      bio: bio ? bio.trim() : '',
      image: req.file ? req.file.path || req.file.secure_url || '' : '',
      publicId: req.file ? req.file.filename || req.file.public_id || '' : '',
      order: sectionArray.length,
    };

    console.log('New member data:', newMember);

    sectionArray.push(newMember);
    await data.save();
    
    console.log('Member added successfully');
    res.status(201).json(data);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Update member in specific section
const updateMember = async (req, res) => {
  try {
    const { section, index } = req.params;
    const { name, role, bio } = req.body;
    
    console.log('=== UPDATE MEMBER ===');
    console.log('Section:', section);
    console.log('Index:', index);
    console.log('Body:', { name, role, bio });
    console.log('File:', req.file ? req.file.path : 'No file');

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    let sectionArray = data[section];
    if (!sectionArray || !sectionArray[index]) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Delete old image from Cloudinary if new file is uploaded
    if (req.file && sectionArray[index].publicId) {
      try {
        await cloudinary.uploader.destroy(sectionArray[index].publicId);
        console.log('Old image deleted:', sectionArray[index].publicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Update member data
    sectionArray[index].name = name.trim();
    sectionArray[index].role = role.trim();
    sectionArray[index].bio = bio ? bio.trim() : '';
    
    if (req.file) {
      sectionArray[index].image = req.file.path || req.file.secure_url || '';
      sectionArray[index].publicId = req.file.filename || req.file.public_id || '';
    }

    await data.save();
    console.log('Member updated successfully');
    res.json(data);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete member from specific section
const deleteMember = async (req, res) => {
  try {
    const { section, index } = req.params;
    
    console.log('=== DELETE MEMBER ===');
    console.log('Section:', section);
    console.log('Index:', index);

    let data = await CentralCommittee.findOne();
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    let sectionArray = data[section];
    if (!sectionArray || !sectionArray[index]) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Delete image from Cloudinary if exists
    if (sectionArray[index].publicId) {
      try {
        await cloudinary.uploader.destroy(sectionArray[index].publicId);
        console.log('Image deleted from Cloudinary:', sectionArray[index].publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    sectionArray.splice(index, 1);
    // Reorder remaining members
    sectionArray.forEach((member, i) => {
      member.order = i;
    });

    await data.save();
    console.log('Member deleted successfully');
    res.json(data);
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update section title
const updateSectionTitle = async (req, res) => {
  try {
    const { section } = req.params;
    const { title } = req.body;
    
    console.log('=== UPDATE SECTION TITLE ===');
    console.log('Section:', section);
    console.log('Title:', title);

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let data = await CentralCommittee.findOne();
    if (!data) {
      data = new CentralCommittee();
    }

    const titleMap = {
      'members': 'title',
      'districtMembers': 'districtTitle',
      'regionalMembers': 'regionalTitle',
      'unitMembers': 'unitTitle',
      'provincialMembers': 'provincialTitle',
      'centralMembers': 'centralMembersTitle',
      'advisoryMembers': 'advisoryTitle',
    };

    const titleField = titleMap[section];
    if (titleField) {
      data[titleField] = title.trim();
    } else {
      return res.status(400).json({ message: 'Invalid section' });
    }

    await data.save();
    console.log('Title updated successfully');
    res.json(data);
  } catch (error) {
    console.error('Update section title error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMembers,
  getMembersByCategory,
  getExecutiveCommittee,
  getDistrictCommittee,
  getProvincialCoordinators,
  getCentralMembers,
  getAdvisoryCouncil,
  updateCommittee,
  addMember,
  updateMember,
  deleteMember,
  updateSectionTitle,
};