require('dotenv').config();
const fetch = require('node-fetch');
const { connectDB } = require('../config/db');
const Vendor = require('../models/Vendor');

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_VENDOR_EMAIL || 'test-vendor@example.com';
const TEST_PASS = process.env.TEST_VENDOR_PASSWORD || 'TestPass123!';

async function setupVendor() {
  await connectDB();
  let v = await Vendor.findOne({ email: TEST_EMAIL });
  if (!v) {
    v = await Vendor.create({ name: 'Test Vendor', email: TEST_EMAIL, password: TEST_PASS, status: 'approved', emailVerified: true });
    console.log('Seeded vendor:', TEST_EMAIL);
  } else {
    // ensure credentials and approved/verified
    v.password = TEST_PASS;
    v.status = 'approved';
    v.emailVerified = true;
    await v.save();
    console.log('Updated vendor for tests:', TEST_EMAIL);
  }
}

async function run() {
  try {
    await setupVendor();

    console.log('\n1) Login success test');
    let res = await fetch(`${BASE}/api/v1/vendor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
    });
    let body = await res.json();
    console.log('Status:', res.status, 'Body:', body);

    if (res.ok && body.token) {
      console.log('\n2) Protected /me test using token');
      res = await fetch(`${BASE}/api/v1/vendor/me`, { headers: { Authorization: `Bearer ${body.token}` } });
      console.log('Status:', res.status, 'Body:', await res.json());
    }

    console.log('\n3) Login with unverified email (expected 403)');
    // mark unverified
    await Vendor.updateOne({ email: TEST_EMAIL }, { emailVerified: false });
    res = await fetch(`${BASE}/api/v1/vendor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
    });
    console.log('Status:', res.status, 'Body:', await res.json());

    console.log('\n4) Login with blocked vendor (expected 403)');
    await Vendor.updateOne({ email: TEST_EMAIL }, { emailVerified: true, status: 'blocked' });
    res = await fetch(`${BASE}/api/v1/vendor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
    });
    console.log('Status:', res.status, 'Body:', await res.json());

    // cleanup: restore
    await Vendor.updateOne({ email: TEST_EMAIL }, { emailVerified: true, status: 'approved' });
    process.exit(0);
  } catch (err) {
    console.error('Test run failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();