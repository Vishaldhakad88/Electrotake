require('dotenv').config();
const { connectDB } = require('../config/db');
const Vendor = require('../models/Vendor');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const VendorSubscription = require('../models/VendorSubscription');

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI must be set in .env to seed vendor subscription.');
      process.exit(1);
    }

    await connectDB();

    // Pick first vendor and first plan (for convenience)
    const vendor = await Vendor.findOne();
    const plan = await SubscriptionPlan.findOne({ slug: 'basic' }) || (await SubscriptionPlan.findOne());

    if (!vendor || !plan) {
      console.error('Vendor or SubscriptionPlan not found. Ensure you have seeded vendors and plans.');
      process.exit(1);
    }

    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 30);

    await VendorSubscription.create({ vendor: vendor._id, plan: plan._id, startDate: now, endDate: end, active: true });

    console.log('Vendor subscription created for vendor:', vendor.email, 'plan:', plan.name);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed vendor subscription:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();