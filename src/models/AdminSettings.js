const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'ElectroMart' },
    contactEmail: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    enableListings: { type: Boolean, default: true },
    defaultListingDurationDays: { type: Number, default: 30 }
  },
  { timestamps: true }
);

const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);
module.exports = AdminSettings;
