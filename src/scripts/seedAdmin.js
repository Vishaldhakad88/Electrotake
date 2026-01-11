require('dotenv').config();
const { connectDB } = require('../config/db');
const Admin = require('../models/Admin');

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env to seed admin.');
      process.exit(1);
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in env to seed admin.');
      process.exit(1);
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.log('Admin already exists; skipping creation.');
      process.exit(0);
    }

    // Create with plaintext password — the Admin model will hash it in pre-save
    const admin = new Admin({ email: email.toLowerCase().trim(), password });
    await admin.save();

    console.log('Admin seeded:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin', err);
    process.exit(1);
  }
}

seed();
