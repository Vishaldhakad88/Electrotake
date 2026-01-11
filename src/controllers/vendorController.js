const Vendor = require('../models/Vendor');

// GET /api/v1/admin/vendors?status=&page=&limit=&q=
async function listVendors(req, res) {
  const { status, page = 1, limit = 20, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const docs = await Vendor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Vendor.countDocuments(filter);

  res.json({ vendors: docs, meta: { total, page: Number(page), limit: Number(limit) } });
}

// PUT /api/v1/admin/vendors/:id/status
// body: { status: 'approved'|'rejected'|'blocked', reason?: string }
async function updateVendorStatus(req, res) {
  const { id } = req.params;
  const { status, reason } = req.body;
  if (!['approved', 'rejected', 'blocked'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const vendor = await Vendor.findById(id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  // Apply transitions
  vendor.status = status;
  if (status === 'rejected') vendor.rejectedReason = reason || '';
  if (status === 'approved') vendor.approvedBy = req.admin._id;
  if (status === 'blocked') vendor.blockedBy = req.admin._id;

  await vendor.save();

  res.json({ vendor });
}

module.exports = { listVendors, updateVendorStatus };
