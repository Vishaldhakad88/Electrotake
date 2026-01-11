const express = require('express');
const router = express.Router();
const { me } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// GET /api/v1/admin/me (protected)
router.get('/me', adminAuth, me);

// GET /api/v1/admin/protected (protected test route)
router.get('/protected', adminAuth, (req, res) => {
  res.json({ ok: true, message: 'Protected route access granted', admin: { id: req.admin._id, email: req.admin.email } });
});

module.exports = router;
