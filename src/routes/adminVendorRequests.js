const express = require('express');
const router = express.Router();
const { listRequests, updateRequest } = require('../controllers/adminVendorRequestController');
const { adminAuth } = require('../middleware/auth');

// All routes protected by adminAuth
router.get('/', adminAuth, listRequests);
router.put('/:id', adminAuth, updateRequest);

module.exports = router;
