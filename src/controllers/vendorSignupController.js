// Deprecated: old signup & OTP flow removed in favor of VendorRequest flow.
// This module intentionally throws if called so that legacy endpoints fail fast.

function _deprecated(req, res) {
  return res.status(410).json({ error: 'Vendor signup endpoint removed. Use /api/v1/vendor-requests' });
}

module.exports = { signup: _deprecated, verifyEmail: _deprecated };

