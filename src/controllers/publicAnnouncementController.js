const Announcement = require('../models/Announcement');

/**
 * PUBLIC active announcements
 * GET /api/v1/announcements?target=user|vendor
 */
exports.getActiveAnnouncements = async (req, res) => {
  const { target } = req.query;

  const now = new Date();

  const filter = {
    status: 'active',
    startAt: { $lte: now },
    $or: [{ endAt: null }, { endAt: { $gte: now } }]
  };

  if (target) {
    filter.$or = [
      { target },
      { target: 'both' }
    ];
  }

  const announcements = await Announcement.find(filter)
    .sort({ priority: -1, createdAt: -1 })
    .select('-createdBy');

  res.json({ announcements });
};
