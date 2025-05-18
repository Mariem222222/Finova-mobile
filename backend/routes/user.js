
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const authMiddleware =require('../Middleware/authMiddleware')
const validatePassword = require("../Middleware/passwordValidator");
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budgets= require('../models/Budget');
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
// Dans votre fichier d'API backend (ex: routes/users.js)
router.delete('/delete-acc', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Suppression en base de données
    await User.findByIdAndDelete(req.user.id);

    // Suppression des données associées (ex: transactions)
    await Transaction.deleteMany({ user: req.user.id });
    await Budgets.deleteMany({ user: req.user.id });

    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});
// routes/users.js
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validate code
    if (user.ResetCode !== code || new Date() > user.ResetCodeExpire) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    // Validate password
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.message });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.ResetCode = undefined;
    user.ResetCodeExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to handle password reset
router.post("/forgot-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  const code_Reset = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60000);
 const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.ResetCode=code_Reset;
    user.ResetCodeExpire = expires;
    await user.save();
    await transporter.sendMail({
    from: '"Finova" FinovaTeam@gmail.com',
    to: user.email,
    subject: 'Reset Your Password ',
    text: `Your Resetting Paswword code is: ${code_Reset}`,
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header {
        background-color:rgb(81, 152, 84);
        color: white;
        padding: 24px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }

      .content {
        padding: 32px;
        text-align: center;
        color: #333333;
      }

      .code {
        display: inline-block;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        background-color: #f0f0ff;
        color:rgb(65, 205, 161);
        padding: 12px 24px;
        border-radius: 8px;
        margin-top: 16px;
      }

      .footer {
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Verify Your Email
      </div>
      <div class="content">
        <p>Finova Team</p>
        <p>Use the following code to Reset Your Password  and complete your login:</p>
        <div class="code"><strong>${code_Reset}</strong></div>
        <p style="margin-top: 24px;">
          This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        &copy; 2025 Your Company. All rights reserved.
      </div>
    </div>
  </body>
</html>
`
  });

  res.json({ message: 'Password resetting code sent to email. Please verify.' });


  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if reset code exists and is valid
    const resetData = resetCodes[email];
    if (!resetData || resetData.code !== code || Date.now() > resetData.expires) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

   

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Remove used reset code
    delete resetCodes[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Failed to reset password" });
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