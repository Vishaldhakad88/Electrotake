require('dotenv').config();
const { connectDB } = require('../config/db');
const Admin = require('../models/Admin');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env');
      process.exit(1);
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in env to reset admin.');
      process.exit(1);
    }

    // Remove existing and recreate
    await Admin.deleteOne({ email: email.toLowerCase().trim() });

    const admin = new Admin({ email: email.toLowerCase().trim(), password });
    await admin.save();

    console.log('Admin reset:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to reset admin', err && err.message ? err.message : err);
    process.exit(1);
  }
})();