const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
// ✅ AUTH MIDDLEWARE (for protecting routes)
const JWT_SECRET = process.env.JWT_SECRET;
 async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' })
      req.user = {
        id: user._id,
        name: user.name,
        phone:user.phone,
        balance: user.balance,
        email: user.email
      }; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
module.exports = authMiddleware