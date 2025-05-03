
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const User = require('../models/User');

// 👤 GET USER INFO
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -twoFACode -twoFACodeExpires');
      
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      name: user.name,
      phone:user.phone,
      balance: user.balance,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;