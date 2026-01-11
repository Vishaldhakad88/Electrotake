require('dotenv').config();
const { connectDB } = require('../config/db');
const Vendor = require('../models/Vendor');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env to seed vendor.');
      process.exit(1);
    }

    await connectDB();

    const email = process.env.TEST_VENDOR_EMAIL || 'vendor@example.com';
    const name = process.env.TEST_VENDOR_NAME || 'Test Vendor';

    const existing = await Vendor.findOne({ email });
    if (existing) {
      console.log('Vendor already exists:', email);
      process.exit(0);
    }

    const vendor = await Vendor.create({ name, email, description: 'Seeded test vendor', status: 'approved' });
    console.log('Vendor seeded:', vendor.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed vendor:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();