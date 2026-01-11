require('dotenv').config();
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');
const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    const vendor = await Vendor.findOne({ email: process.env.TEST_VENDOR_EMAIL || 'vendor@example.com' });
    if (!vendor) {
      console.error('Vendor not found.');
      process.exit(1);
    }

    // Login admin
    const loginRes = await fetch('http://localhost:5000/api/v1/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    });
    const loginJson = await loginRes.json();
    if (!loginJson.token) {
      console.error('Admin login failed:', loginJson);
      process.exit(1);
    }

    const token = loginJson.token;
    console.log('Admin token obtained');

    // Try creating products until we hit limit + 1
    for (let i = 1; i <= 7; i++) {
      const title = `Test Product ${i}`;
      const res = await fetch(`http://localhost:5000/api/v1/admin/vendors/${vendor._id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description: 'Seeded by test script' })
      });
      const body = await res.json();
      console.log('Attempt', i, 'Status', res.status, body);
    }

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();