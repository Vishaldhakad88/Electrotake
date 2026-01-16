const Announcement = require('../models/Announcement');

/**
 * GET /api/v1/announcements/user
 */
async function userAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find({
      active: true,
      target: { $in: ['user', 'both'] }
    }).sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (err) {
    console.error('[announcementController] userAnnouncements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/v1/announcements/vendor
 */
async function vendorAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find({
      active: true,
      target: { $in: ['vendor', 'both'] }
    }).sort({ createdAt: -1 });

    res.json({ announcements });
  } catch (err) {
    console.error('[announcementController] vendorAnnouncements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  userAnnouncements,
  vendorAnnouncements
};
