require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI not set in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    const admins = await Admin.find().select('-password').lean();
    console.log('Admins in DB:', admins);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to list admins:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();