const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const vendor = await Vendor.findOne({ email: email.toLowerCase().trim() });
  if (!vendor) return res.status(401).json({ error: 'Invalid credentials' });

  if (!vendor.emailVerified) return res.status(403).json({ error: 'Email not verified' });
  if (vendor.status === 'blocked') return res.status(403).json({ error: 'Vendor is blocked' });
  if (vendor.status !== 'approved') return res.status(403).json({ error: 'Vendor not approved' });

  if (!vendor.password) return res.status(403).json({ error: 'Password not set. Complete first-time setup.' });

  const isMatch = await vendor.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const expiresIn = process.env.VENDOR_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '7d';
  const token = jwt.sign({ vendorId: vendor._id.toString(), role: 'vendor' }, process.env.JWT_SECRET, { expiresIn });

  res.json({ token, vendor: { id: vendor._id, name: vendor.name, email: vendor.email, status: vendor.status } });
}

async function setPassword(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const vendor = await Vendor.findOne({ email: email.toLowerCase().trim() });
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  if (vendor.status !== 'approved') return res.status(403).json({ error: 'Vendor is not approved' });

  if (vendor.password) return res.status(400).json({ error: 'Password already set' });

  vendor.password = password;
  await vendor.save();

  res.json({ message: 'Password set successfully' });
}

function me(req, res) {
  if (!req.vendor) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ vendor: req.vendor });
}

module.exports = { login, me, setPassword };