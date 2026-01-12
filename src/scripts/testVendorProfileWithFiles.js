require('dotenv').config();
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../config/db');
const Vendor = require('../models/Vendor');

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_VENDOR_EMAIL || 'test-vendor@example.com';
const TEST_PASS = process.env.TEST_VENDOR_PASSWORD || 'TestPass123!';

// 1x1 PNG base64 (transparent)
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgk5n9U8AAAAASUVORK5CYII=';

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
    v.profileImage = '';
    v.shopImages = [];
    v.profileCompleted = false;
    await v.save();
    console.log('Updated vendor for tests:', TEST_EMAIL);
  }
}

async function login() {
  const res = await fetch(`${BASE}/api/v1/vendor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${JSON.stringify(body)}`);
  return body.token;
}

function writeTempFile(filename, base64) {
  const tmpDir = path.join(__dirname, '..', '..', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const filePath = path.join(tmpDir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  return filePath;
}

async function run() {
  await setupVendor();

  console.log('\nLogging in...');
  const token = await login();
  console.log('Got token');

  console.log('\n1) Update profile WITHOUT files (should NOT set profileCompleted)');
  let res = await fetch(`${BASE}/api/v1/vendor/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'Vendor Name Only', description: 'Short desc' })
  });
  console.log('Status:', res.status, 'Body:', await res.json());

  console.log('\n2) Update profile WITH image files (should set profileCompleted true)');
  const pngPath = writeTempFile('sample.png', PNG_BASE64);
  const pngPath2 = writeTempFile('sample2.png', PNG_BASE64);

  const form = new FormData();
  form.append('name', 'Vendor With Images');
  form.append('description', 'Complete profile now');
  form.append('profileImage', fs.createReadStream(pngPath));
  form.append('shopImages', fs.createReadStream(pngPath));
  form.append('shopImages', fs.createReadStream(pngPath2));

  res = await fetch(`${BASE}/api/v1/vendor/profile`, {
    method: 'PUT',
    headers: Object.assign({ Authorization: `Bearer ${token}` }, form.getHeaders()),
    body: form
  });
  console.log('Status:', res.status, 'Body:', await res.json());

  console.log('\n3) GET profile (should show profileCompleted true and image paths)');
  res = await fetch(`${BASE}/api/v1/vendor/profile`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Status:', res.status, 'Body:', await res.json());

  console.log('\n4) Upload invalid file type (expect 400)');
  const tmpTxt = path.join(__dirname, '..', '..', 'tmp', 'bad.txt');
  fs.writeFileSync(tmpTxt, 'not an image');
  const badForm = new FormData();
  badForm.append('name', 'Bad File Test');
  badForm.append('description', 'Should fail');
  badForm.append('profileImage', fs.createReadStream(tmpTxt));

  res = await fetch(`${BASE}/api/v1/vendor/profile`, {
    method: 'PUT',
    headers: Object.assign({ Authorization: `Bearer ${token}` }, badForm.getHeaders()),
    body: badForm
  });
  const badBody = await res.text();
  console.log('Status:', res.status, 'Body (text):', badBody);

  console.log('\nCleanup: remove tmp files');
  try { fs.unlinkSync(pngPath); fs.unlinkSync(pngPath2); fs.unlinkSync(tmpTxt); } catch (e) {}

  process.exit(0);
}

run().catch(err => { console.error('Test failed:', err && err.message ? err.message : err); process.exit(1); });