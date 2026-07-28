const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const Log = require('../models/Log');
const AdminLog = require('../models/AdminLog');
const VisitorLog = require('../models/VisitorLog');
const SiteSettings = require('../models/SiteSettings');
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Super Admin Login
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: superAdmin._id, isSuperAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      superAdmin: {
        id: superAdmin._id,
        email: superAdmin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create admin
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({ email, password });
    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: { id: admin._id, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all logs
const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (type === 'admin') {
      query = { adminId: { $exists: true } };
    } else if (type === 'visitor') {
      query = { adminId: { $exists: false } };
    }

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adminId', 'email');

    const total = await Log.countDocuments(query);

    res.json({
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get visitor analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    const now = new Date();

    let matchQuery = {};
    if (period === 'day') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      matchQuery = { timestamp: { $gte: startOfDay } };
    } else if (period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      matchQuery = { timestamp: { $gte: startOfWeek } };
    } else if (period === 'month') {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      matchQuery = { timestamp: { $gte: startOfMonth } };
    }

    const dailyVisitors = await VisitorLog.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dayOfMonth: '$timestamp' },
          count: { $sum: 1 },
          date: { $first: '$timestamp' },
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const monthlyVisitors = await VisitorLog.aggregate([
      {
        $group: {
          _id: { $month: '$timestamp' },
          count: { $sum: 1 },
          month: { $first: '$timestamp' },
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const totalVisitors = await VisitorLog.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const totalLogs = await Log.countDocuments();

    res.json({
      dailyVisitors,
      monthlyVisitors,
      totalVisitors,
      totalAdmins,
      totalLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cloudinary images
const getCloudinaryImages = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'nepal-army',
      max_results: 100,
    });
    res.json(result.resources || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cloudinary image
const deleteCloudinaryImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update logo size
const updateLogoSize = async (req, res) => {
  try {
    const { width, height, position } = req.body;
    
    // Validate input
    if (!width || !height || !position) {
      return res.status(400).json({ message: 'Width, height, and position are required' });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    
    settings.logoWidth = width;
    settings.logoHeight = height;
    settings.logoPosition = position;
    
    await settings.save();
    res.json({ 
      success: true, 
      message: 'Logo size updated successfully',
      data: { width, height, position }
    });
  } catch (error) {
    console.error('Update logo size error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add maintenance notice
const addMaintenanceNotice = async (req, res) => {
  try {
    const { message, endDate, enabled, lockedSections } = req.body;
    
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    
    settings.maintenanceMode = enabled || false;
    settings.maintenanceMessage = message || '';
    settings.maintenanceEndDate = endDate || null;
    settings.lockedSections = lockedSections || [];
    
    await settings.save();
    res.json({ 
      success: true, 
      message: 'Maintenance settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Add maintenance error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get maintenance status
const getMaintenanceStatus = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }
    
    res.json({
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage: settings.maintenanceMessage || '',
      maintenanceEndDate: settings.maintenanceEndDate || null,
      lockedSections: settings.lockedSections || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  superAdminLogin,
  getAdmins,
  createAdmin,
  deleteAdmin,
  getLogs,
  getAnalytics,
  getCloudinaryImages,
  deleteCloudinaryImage,
  updateLogoSize,
  addMaintenanceNotice,
  getMaintenanceStatus,
};