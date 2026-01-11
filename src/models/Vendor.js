const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'blocked'],
      default: 'pending'
    },
    rejectedReason: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;
