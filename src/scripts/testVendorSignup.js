require('dotenv').config();
const mongoose = require('mongoose');
const VendorRequest = require('../models/VendorRequest');
const fetch = require('node-fetch');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

    const email = 'signup-test@example.com';
    // cleanup old
    await VendorRequest.deleteOne({ email });

    // submit vendor request
    const signupRes = await fetch('http://localhost:5000/api/v1/vendor-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone: '1234567890', location: 'Indore', description: 'Test shop' })
    });
    console.log('Submit status', signupRes.status, await signupRes.json());

    // read OTP from DB (test-only script)
    const vr = await VendorRequest.findOne({ email });
    if (!vr) {
      console.error('VendorRequest not found after submit');
      process.exit(1);
    }
    console.log('OTP (from DB, test only):', vr.emailOtp);

    // verify
    const verifyRes = await fetch('http://localhost:5000/api/v1/vendor-requests/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: vr.emailOtp })
    });
    console.log('Verify status', verifyRes.status, await verifyRes.json());

    // verify again should give already verified
    const verifyRes2 = await fetch('http://localhost:5000/api/v1/vendor-requests/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: vr.emailOtp })
    });
    console.log('Verify again status', verifyRes2.status, await verifyRes2.json());

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();