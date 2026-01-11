const express = require('express');
const router = express.Router({ mergeParams: true });
const { createProductForVendor, listProductsForVendor } = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');

// Admin-proxied endpoints to simulate vendor product creation
router.post('/', adminAuth, createProductForVendor); // POST /api/v1/admin/vendors/:vendorId/products
router.get('/', adminAuth, listProductsForVendor);

module.exports = router;
