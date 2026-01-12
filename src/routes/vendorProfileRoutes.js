const express = require('express');
const router = express.Router();

const { vendorAuth } = require('../middleware/vendorAuth');
const { upload } = require('../config/multer');
const {
  getProfile,
  updateProfile,
} = require('../controllers/vendorProfileController');

// GET profile
router.get('/profile', vendorAuth, getProfile);

// UPDATE profile with images
router.put(
  '/profile',
  vendorAuth,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'shopImages', maxCount: 5 },
  ]),
  updateProfile
);

module.exports = router;
