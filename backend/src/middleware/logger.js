const Log = require('../models/Log');

// Log an admin action (create/update/delete/etc) into the Log collection.
const logActivity = async ({
  req = null,
  action,
  module,
  details = {},
  admin = null,
  ip = null,
}) => {
  try {
    const actor = admin || (req && req.admin) || null;
    const clientIp =
      ip ||
      (req && (req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '')) ||
      '';

    await Log.create({
      adminId: actor ? actor._id : null,
      adminEmail: actor ? actor.email : '',
      action,
      module,
      details,
      ip: typeof clientIp === 'string' ? clientIp.split(',')[0].trim() : '',
      userAgent: (req && req.headers?.['user-agent']) || '',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Log write failed:', error.message);
  }
};

module.exports = { logActivity };
