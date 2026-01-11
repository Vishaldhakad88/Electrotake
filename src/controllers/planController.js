const SubscriptionPlan = require('../models/SubscriptionPlan');

function slugify(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// POST /api/v1/admin/plans
async function createPlan(req, res) {
  const { name, description, productLimit = 0, durationDays = 30, price = 0, currency = 'INR', active = true } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (price < 0) return res.status(400).json({ error: 'Price must be >= 0' });

  const slug = slugify(name);
  const exists = await SubscriptionPlan.findOne({ slug });
  if (exists) return res.status(400).json({ error: 'A plan with the same name/slug already exists' });

  const plan = await SubscriptionPlan.create({ name, slug, description, productLimit, durationDays, price, currency, active, createdBy: req.admin._id });
  res.status(201).json({ plan });
}

// GET /api/v1/admin/plans?active=&page=&limit=&q=
async function listPlans(req, res) {
  const { active, page = 1, limit = 20, q } = req.query;
  const filter = {};
  if (typeof active !== 'undefined') filter.active = active === 'true' || active === '1';
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { slug: { $regex: q, $options: 'i' } }];

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const docs = await SubscriptionPlan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await SubscriptionPlan.countDocuments(filter);

  res.json({ plans: docs, meta: { total, page: Number(page), limit: Number(limit) } });
}

// GET /api/v1/admin/plans/:id
async function getPlan(req, res) {
  const plan = await SubscriptionPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json({ plan });
}

// PUT /api/v1/admin/plans/:id
async function updatePlan(req, res) {
  const allowed = ['name', 'description', 'productLimit', 'durationDays', 'price', 'currency', 'active'];
  const updates = {};
  allowed.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
  });

  if (updates.name) updates.slug = slugify(updates.name);
  if (updates.price !== undefined && updates.price < 0) return res.status(400).json({ error: 'Price must be >= 0' });

  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json({ plan });
}

// DELETE /api/v1/admin/plans/:id (soft-delete -> set active=false)
async function deletePlan(req, res) {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, { $set: { active: false } }, { new: true });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json({ plan });
}

module.exports = { createPlan, listPlans, getPlan, updatePlan, deletePlan };
