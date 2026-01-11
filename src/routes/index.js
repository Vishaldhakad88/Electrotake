const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

router.get('/', (req, res) => {
  res.json({ service: 'ElectroMart Admin API', version: '1.0.0' });
});

// Admin auth routes (public)
router.use('/admin', authRoutes);
// Admin routes (protected)
router.use('/admin', adminRoutes);
// Admin settings routes (protected)
const settingsRoutes = require('./settings');
router.use('/admin/settings', settingsRoutes);

module.exports = router;
