const SiteSettings = require('../models/SiteSettings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { logActivity } = require('../middleware/logger');

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Nepal Army Association',
        siteDescription: 'Nepal National Ex-Army Association',
        logoWidth: 80,
        logoHeight: 80,
        logoPosition: 'left',
        maintenanceMode: false,
        maintenanceMessage: '',
        maintenanceEndDate: null,
        lockedSections: [],
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    const { 
      siteName, 
      siteDescription, 
      currentPassword, 
      newPassword,
      logoWidth,
      logoHeight,
      logoPosition,
      maintenanceMode,
      maintenanceMessage,
      maintenanceEndDate,
      lockedSections,
    } = req.body;

    if (!settings) {
      settings = new SiteSettings();
    }

    if (siteName) settings.siteName = siteName;
    if (siteDescription) settings.siteDescription = siteDescription;
    if (logoWidth) settings.logoWidth = logoWidth;
    if (logoHeight) settings.logoHeight = logoHeight;
    if (logoPosition) settings.logoPosition = logoPosition;
    if (typeof maintenanceMode === 'boolean') settings.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
    if (maintenanceEndDate !== undefined) settings.maintenanceEndDate = maintenanceEndDate;
    if (lockedSections !== undefined) settings.lockedSections = lockedSections;

    // Change password if provided
    if (currentPassword && newPassword) {
      const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'a@gmail.com' });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      admin.password = newPassword;
      await admin.save();
    }

    await settings.save();
    await logActivity({ req, action: 'UPDATE', module: 'SETTINGS', details: { fields: ['siteName', 'siteDescription', 'logoWidth', 'logoHeight', 'logoPosition', 'maintenanceMode', 'maintenanceMessage', 'maintenanceEndDate', 'lockedSections'].filter(f => req.body[f] !== undefined), passwordChanged: !!(currentPassword && newPassword) } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get maintenance status
const getMaintenanceStatus = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Nepal Army Association',
        siteDescription: 'Nepal National Ex-Army Association',
        maintenanceMode: false,
        maintenanceMessage: '',
        maintenanceEndDate: null,
        lockedSections: [],
      });
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

// Update maintenance status
const updateMaintenance = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    const { maintenanceMode, maintenanceMessage, maintenanceEndDate, lockedSections } = req.body;

    if (!settings) {
      settings = new SiteSettings();
    }

    if (typeof maintenanceMode === 'boolean') settings.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) settings.maintenanceMessage = maintenanceMessage;
    if (maintenanceEndDate !== undefined) settings.maintenanceEndDate = maintenanceEndDate;
    if (lockedSections !== undefined) settings.lockedSections = lockedSections;

    await settings.save();
    await logActivity({ req, action: 'UPDATE', module: 'SETTINGS', details: { maintenanceMode: settings.maintenanceMode, lockedSections: settings.lockedSections } });
    res.json({
      success: true,
      message: 'Maintenance settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getMaintenanceStatus,
  updateMaintenance,
};