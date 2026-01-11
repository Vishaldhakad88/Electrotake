const mongoose = require('mongoose');

const VendorSubscriptionSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const VendorSubscription = mongoose.model('VendorSubscription', VendorSubscriptionSchema);
module.exports = VendorSubscription;
