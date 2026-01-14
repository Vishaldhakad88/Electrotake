const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'user' || !decoded.userId) {
      return res.status(403).json({ error: 'Forbidden: Invalid user token' });
    }

    // 🔥 IMPORTANT FIX
    const user = await User.findById(decoded.userId).select('_id name email');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // now req.user._id exists ✅

    // Update last active silently
    User.findByIdAndUpdate(user._id, { lastActiveAt: new Date() }).catch(() => {});

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = userAuth;
