
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const authMiddleware =require('../Middleware/authMiddleware')
const validatePassword = require("../Middleware/passwordValidator");
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
router.put("/change-password", authMiddleware, async (req, res) => {


  try {
    const user = await User.findById(req.user.id)
    .select('-twoFACode -twoFACodeExpires');
    
  if (!user) return res.status(404).json({ error: 'User not found' });
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords must match" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }
    
    
    // Encrypt new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;