const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, default: '' },
    productLimit: { type: Number, default: 0 },
    durationDays: { type: Number, default: 30 },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
module.exports = SubscriptionPlan;
