require('dotenv').config();
const { connectDB } = require('../config/db');
const SubscriptionPlan = require('../models/SubscriptionPlan');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env to seed plans.');
      process.exit(1);
    }

    await connectDB();

    const count = await SubscriptionPlan.countDocuments();
    if (count > 0) {
      console.log('Plans already exist; skipping.');
      process.exit(0);
    }

    const plans = [
      { name: 'Free', description: 'Free listing tier', productLimit: 10, durationDays: 30, price: 0, currency: 'INR', active: true },
      { name: 'Basic', description: 'Basic vendor subscription', productLimit: 50, durationDays: 30, price: 9.99, currency: 'INR', active: true },
      { name: 'Pro', description: 'Professional vendor subscription', productLimit: 500, durationDays: 30, price: 49.99, currency: 'INR', active: true }
    ];

    for (const p of plans) {
      const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await SubscriptionPlan.create({ ...p, slug });
    }

    console.log('Default plans seeded.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed plans:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();