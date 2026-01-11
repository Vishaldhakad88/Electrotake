function me(req, res) {
  // req.admin is attached by adminAuth middleware
  res.json({ admin: req.admin });
}

module.exports = { me };
