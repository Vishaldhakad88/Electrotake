const Vendor = require('../models/Vendor');
const VendorSubscription = require('../models/VendorSubscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const AdminSettings = require('../models/AdminSettings');
const Product = require('../models/Product');

async function getActiveSubscriptionForVendor(vendorId) {
  const now = new Date();
  return VendorSubscription.findOne({ vendor: vendorId, active: true, startDate: { $lte: now }, endDate: { $gt: now } }).populate('plan');
}

async function canVendorCreateProduct(vendorId) {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return { allowed: false, reason: 'Vendor not found' };

  if (vendor.status !== 'approved') return { allowed: false, reason: 'Vendor is not approved' };
  if (vendor.status === 'blocked') return { allowed: false, reason: 'Vendor is blocked' };

  const activeSub = await getActiveSubscriptionForVendor(vendorId);
  let limit;
  if (activeSub && activeSub.plan) {
    limit = activeSub.plan.productLimit;
  } else {
    const settings = await AdminSettings.findOne();
    limit = settings ? settings.freeProductLimit : 5;
  }

  const currentCount = await Product.countDocuments({ vendor: vendorId });
  const allowed = currentCount < limit;
  return { allowed, limit, currentCount, vendorStatus: vendor.status, reason: allowed ? null : 'Product limit exceeded' };
}

module.exports = { canVendorCreateProduct, getActiveSubscriptionForVendor };
