const express = require('express');
const router = express.Router();
const { me } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// GET /api/v1/admin/me (protected)
router.get('/me', adminAuth, me);

module.exports = router;
