const mongoose = require('mongoose');

const VendorRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    emailOtp: { type: String, default: null },
    emailOtpExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

const VendorRequest = mongoose.model('VendorRequest', VendorRequestSchema);
module.exports = VendorRequest;
