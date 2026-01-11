const AdminSettings = require('../models/AdminSettings');

async function getSettings(req, res) {
  // Return the singleton settings document; create defaults if missing
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({});
  }
  res.json({ settings });
}

async function updateSettings(req, res) {
  const updates = {};
  const allowed = ['siteTitle', 'contactEmail', 'supportEmail', 'enableListings', 'defaultListingDurationDays'];

  allowed.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      updates[key] = req.body[key];
    }
  });

  const settings = await AdminSettings.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
  res.json({ settings });
}

module.exports = { getSettings, updateSettings };
