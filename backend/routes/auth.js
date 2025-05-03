const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
// Email transporter config
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// 🔐 REGISTER (hash password only)
router.post('/register', async (req, res) => {
  try {
    const { name,phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name,phone, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔐 STEP 1: LOGIN + SEND 2FA CODE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate 2FA code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60000);

  user.twoFACode = code;
  user.twoFACodeExpires = expires;
  await user.save();

  // Send email
  await transporter.sendMail({
    from: '"Finova" FinovaTeam@gmail.com',
    to: user.email,
    subject: 'Your 2FA Code',
    text: `Your login verification code is: ${code}`,
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
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
        background-color: #4f46e5;
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
        color: #4f46e5;
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
        <p>Use the following code to verify your email and complete your login:</p>
        <div class="code"><strong>${code}</strong></div>
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

  res.json({ message: '2FA code sent to email. Please verify.' });
});

// 🔐 STEP 2: VERIFY 2FA CODE AND LOGIN
router.post('/verify-2fa', async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.twoFACode || !user.twoFACodeExpires) {
    return res.status(401).json({ error: '2FA not initialized' });
  }

  if (new Date() > user.twoFACodeExpires) {
    return res.status(403).json({ error: '2FA code expired' });
  }

  if (user.twoFACode !== code) {
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }

  // Clear code after successful login
  user.twoFACode = undefined;
  user.twoFACodeExpires = undefined;
  await user.save();
  const Name=user.name;
  const Balance=user.balance;

  // Issue JWT
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: 'Login successful!', token,Name,Balance });
});


// 🟢 Export both router and middleware
module.exports = router;
