const express = require('express');
const router = express.Router();
const { createPlan, listPlans, getPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { adminAuth } = require('../middleware/auth');

// Admin-only plan management
router.get('/', adminAuth, listPlans);
router.post('/', adminAuth, createPlan);
router.get('/:id', adminAuth, getPlan);
router.put('/:id', adminAuth, updatePlan);
router.delete('/:id', adminAuth, deletePlan);

module.exports = router;
