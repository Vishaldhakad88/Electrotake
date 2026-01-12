const VendorRequest = require('../models/VendorRequest');
const Vendor = require('../models/Vendor');

// GET /api/v1/admin/vendor-requests?status=pending
async function listRequests(req, res) {
  const status = req.query.status || 'pending';

  // Per requirements: admin should only see verified requests
  const filter = { emailVerified: true };
  if (status) filter.status = status;

  const requests = await VendorRequest.find(filter).sort({ createdAt: -1 });
  res.json({ requests });
}

// PUT /api/v1/admin/vendor-requests/:id
async function updateRequest(req, res) {
  const { id } = req.params;
  const { action, reason } = req.body;
  if (!action || !['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' });

  const vr = await VendorRequest.findById(id);
  if (!vr) return res.status(404).json({ error: 'Vendor request not found' });
  if (!vr.emailVerified && action === 'approve') return res.status(400).json({ error: 'Email must be verified before approval' });

  if (action === 'reject') {
    vr.status = 'rejected';
    await vr.save();
    return res.json({ message: 'Vendor request rejected' });
  }

  // Approve
  // Ensure no existing Vendor with same email
  const existingVendor = await Vendor.findOne({ email: vr.email });
  if (existingVendor) return res.status(400).json({ error: 'Vendor already exists for this email' });

  const vendor = await Vendor.create({
    email: vr.email,
    phone: vr.phone || '',
    description: vr.description || '',
    status: 'approved',
    emailVerified: true,
    password: null
  });

  vr.status = 'approved';
  await vr.save();

  res.json({ message: 'Vendor request approved and vendor account created', vendorId: vendor._id });
}

module.exports = { listRequests, updateRequest };
