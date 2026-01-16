const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

const {
  createAnnouncement,
  listAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/adminAnnouncementController');

router.post('/', adminAuth, createAnnouncement);
router.get('/', adminAuth, listAnnouncements);
router.put('/:id', adminAuth, updateAnnouncement);
router.delete('/:id', adminAuth, deleteAnnouncement);

module.exports = router;
