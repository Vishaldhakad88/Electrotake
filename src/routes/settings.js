const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { adminAuth } = require('../middleware/auth');

// GET /api/v1/admin/settings (protected)
router.get('/', adminAuth, getSettings);

// PUT /api/v1/admin/settings (protected)
router.put('/', adminAuth, updateSettings);

module.exports = router;
