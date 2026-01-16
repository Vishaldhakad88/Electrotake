const Announcement = require('../models/Announcement');

/**
 * CREATE announcement
 * POST /api/v1/admin/announcements
 */
exports.createAnnouncement = async (req, res) => {
  const {
    title,
    message,
    target,
    priority,
    status,
    startAt,
    endAt,
    dismissible
  } = req.body;

  if (!title || !message || !target) {
    return res.status(400).json({ error: 'title, message and target are required' });
  }

  const announcement = await Announcement.create({
    title,
    message,
    target,
    priority,
    status,
    startAt,
    endAt,
    dismissible,
    createdBy: req.admin._id
  });

  res.status(201).json({ announcement });
};

/**
 * LIST announcements (admin)
 * GET /api/v1/admin/announcements
 */
exports.listAnnouncements = async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'email');

  res.json({ announcements });
};

/**
 * UPDATE announcement
 * PUT /api/v1/admin/announcements/:id
 */
exports.updateAnnouncement = async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json({ announcement });
};

/**
 * DELETE announcement
 * DELETE /api/v1/admin/announcements/:id
 */
exports.deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);

  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json({ message: 'Announcement deleted' });
};
