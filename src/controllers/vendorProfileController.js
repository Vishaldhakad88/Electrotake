const Vendor = require('../models/Vendor');
const path = require('path');

async function getProfile(req, res) {
  // req.vendor is attached by vendorAuth and already excludes password & otp fields
  res.json({ vendor: req.vendor });
}

async function updateProfile(req, res) {
  const vendor = await Vendor.findById(req.vendor._id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  const { name, description } = req.body;
  if (name) vendor.name = name;
  if (description) vendor.description = description;

  // Files handled by multer
  // profileImage single
  // shopImages multiple
  if (req.files) {
    if (req.files.profileImage && req.files.profileImage[0]) {
      const file = req.files.profileImage[0];
      vendor.profileImage = path.join('/uploads/vendors', file.filename).replace(/\\/g, '/');
    }
    if (req.files.shopImages && req.files.shopImages.length) {
      const files = req.files.shopImages;
      const paths = files.map(f => path.join('/uploads/vendors', f.filename).replace(/\\/g, '/'));
      // append to existing shopImages
      vendor.shopImages = vendor.shopImages.concat(paths);
    }
  }

  // Set profileCompleted if required fields present
  if (vendor.name && vendor.description && vendor.profileImage) {
    vendor.profileCompleted = true;
  }

  await vendor.save();

  const sanitized = vendor.toObject();
  delete sanitized.password;
  delete sanitized.emailOtp;
  delete sanitized.emailOtpExpires;

  res.json({ vendor: sanitized });
}

module.exports = { getProfile, updateProfile };