require('dotenv').config();
const { connectDB } = require('../config/db');
const AdminSettings = require('../models/AdminSettings');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env to seed settings.');
      process.exit(1);
    }

    await connectDB();

    const existing = await AdminSettings.findOne();
    if (existing) {
      console.log('Settings already exist; skipping.');
      process.exit(0);
    }

    const defaults = {
      siteTitle: 'ElectroMart',
      contactEmail: process.env.ADMIN_EMAIL || '',
      supportEmail: process.env.ADMIN_EMAIL || '',
      enableListings: true,
      defaultListingDurationDays: 30
    };

    await AdminSettings.create(defaults);
    console.log('Admin settings seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed settings:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();