const Product = require('../models/Product');
const { canVendorCreateProduct } = require('../services/vendorService');

// Admin-proxied: create product for vendor (used to test enforcement)
async function createProductForVendor(req, res) {
  const { vendorId } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const check = await canVendorCreateProduct(vendorId);
  if (!check.allowed) return res.status(403).json({ error: check.reason, limit: check.limit, currentCount: check.currentCount });

  const product = await Product.create({ vendor: vendorId, title, description: description || '' });
  res.status(201).json({ product });
}

// List vendor products (for testing)
async function listProductsForVendor(req, res) {
  const { vendorId } = req.params;
  const products = await Product.find({ vendor: vendorId }).sort({ createdAt: -1 });
  res.json({ products, total: products.length });
}

module.exports = { createProductForVendor, listProductsForVendor };
