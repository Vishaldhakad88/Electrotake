const express = require('express');
const router = express.Router();
const { submitRequest, verifyOtp } = require('../controllers/vendorRequestController');
const { createPublicLimiter } = require('../middleware/rateLimiter');

const limiter = createPublicLimiter();

// Public: submit vendor request
router.post('/', limiter, submitRequest);

// Public: verify OTP
router.post('/verify-otp', limiter, verifyOtp);

module.exports = router;
