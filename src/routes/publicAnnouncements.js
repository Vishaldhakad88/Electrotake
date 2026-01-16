const express = require('express');
const router = express.Router();

const {
  userAnnouncements,
  vendorAnnouncements
} = require('../controllers/announcementController');

// Public announcements
router.get('/user', userAnnouncements);
router.get('/vendor', vendorAnnouncements);

module.exports = router;
