const express = require('express');
const router = express.Router();
const { listVendors, updateVendorStatus } = require('../controllers/vendorController');
const { adminAuth } = require('../middleware/auth');

// All routes are admin-protected
router.get('/', adminAuth, listVendors);
router.put('/:id/status', adminAuth, updateVendorStatus);

module.exports = router;
