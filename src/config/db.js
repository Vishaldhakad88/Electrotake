const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set; skipping DB connection (useful for local init).');
    return;
  }

  // Helpful mongoose settings
  mongoose.set('strictQuery', true);

  try {
    // Set a server selection timeout so connection failures fail fast and are easier to diagnose
    const opts = { serverSelectionTimeoutMS: 10000 };
    await mongoose.connect(uri, opts);

    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err && err.message ? err.message : err);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    // Re-throw so the caller (server startup / seed script) can handle shutdown if needed
    throw err;
  }
}

module.exports = { connectDB };
