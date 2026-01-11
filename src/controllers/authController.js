const Admin = require('../models/Admin');
const { signToken } = require('../utils/jwt');
const mongoose = require('mongoose');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('Auth attempt for email:', email);
  console.log('Mongoose readyState:', mongoose.connection.readyState, 'db:', mongoose.connection && mongoose.connection.name);
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  console.log('Admin lookup result:', !!admin);
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await admin.comparePassword(password);
  console.log('Password match:', isMatch);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ id: admin._id });
  res.json({ token, admin: { id: admin._id, email: admin.email } });
}

module.exports = { login };
