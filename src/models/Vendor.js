const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, default: '' },
    description: { type: String, default: '' },
    password: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailOtp: { type: String, default: null },
    emailOtpExpires: { type: Date, default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'blocked'],
      default: 'pending'
    },
    // Profile completion fields
    profileImage: { type: String, default: '' },
    shopImages: { type: [String], default: [] },
    profileCompleted: { type: Boolean, default: false },
    rejectedReason: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

// Hash password before save if modified
VendorSchema.pre('save', async function (next) {
  // Only hash when the password field is modified
  if (!this.isModified('password')) return next();

  // Skip hashing when password is null/undefined or not a string
  if (this.password == null) return next();
  if (typeof this.password !== 'string') return next();

  // Avoid hashing empty strings
  if (this.password.length === 0) return next();

  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
VendorSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;
