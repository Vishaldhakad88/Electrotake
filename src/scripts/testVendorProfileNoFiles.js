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
    v.password = TEST_PASS;
    v.status = 'approved';
    v.emailVerified = true;
    await v.save();
    console.log('Updated vendor for tests:', TEST_EMAIL);
  }
}

async function run() {
  await setupVendor();

  console.log('\nLogin to get token');
  let res = await fetch(`${BASE}/api/v1/vendor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
  });
  const body = await res.json();
  console.log('Login:', res.status, body);
  if (!body.token) return console.error('No token from login');

  const token = body.token;

  console.log('\nGET /vendor/profile (expect vendor data)');
  res = await fetch(`${BASE}/api/v1/vendor/profile`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Status:', res.status, 'Body:', await res.json());

  console.log('\nPUT /vendor/profile (update name + description, no files)');
  res = await fetch(`${BASE}/api/v1/vendor/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'Updated Vendor Name', description: 'Updated description' })
  });
  console.log('Status:', res.status, 'Body:', await res.json());

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });