// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate HTML email template for 2FA code
const generate2FAEmail = (code) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background-color: #4f46e5; color: white; padding: 24px; text-align: center; font-size: 24px; font-weight: bold; }
    .content { padding: 32px; text-align: center; color: #333333; }
    .code { display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; background-color: #f0f0ff; color: #4f46e5; padding: 12px 24px; border-radius: 8px; margin-top: 16px; }
    .footer { padding: 16px; text-align: center; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your Email</div>
    <div class="content">
      <p>Finova Team</p>
      <p>Use the following code to verify your email and complete your login:</p>
      <div class="code"><strong>${code}</strong></div>
      <p style="margin-top: 24px;">
        This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; 2025 Finova. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const AuthController = {
  // 🔐 Register new user
  register: async (req, res) => {
    try {
      const { name, phone, email, password } = req.body;
      
      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, phone, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
  },

  // 🔐 Login - Step 1: Validate credentials and send 2FA code
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Validate credentials
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate 2FA code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60000); // 10 minutes

      // Save code to user document
      user.twoFACode = code;
      user.twoFACodeExpires = expires;
      await user.save();

      // Send 2FA email
      await transporter.sendMail({
        from: '"Finova" <FinovaTeam@gmail.com>',
        to: user.email,
        subject: 'Your 2FA Code',
        text: `Your login verification code is: ${code}`,
        html: generate2FAEmail(code)
      });

      res.json({ message: '2FA code sent to your email. Please verify.' });
    } catch (err) {
      res.status(500).json({ error: 'Login failed: ' + err.message });
    }
  },

  // 🔐 Login - Step 2: Verify 2FA code
  verify2FA: async (req, res) => {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email });

      // Validate 2FA state
      if (!user || !user.twoFACode || !user.twoFACodeExpires) {
        return res.status(400).json({ error: '2FA not initialized' });
      }

      // Check expiration
      if (new Date() > user.twoFACodeExpires) {
        return res.status(403).json({ error: '2FA code expired' });
      }

      // Validate code
      if (user.twoFACode !== code) {
        return res.status(401).json({ error: 'Invalid 2FA code' });
      }

      // Clear 2FA data
      user.twoFACode = undefined;
      user.twoFACodeExpires = undefined;
      await user.save();

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.json({ 
        message: 'Login successful!', 
        token, 
        name: user.name,
        balance: user.balance
      });
    } catch (err) {
      res.status(500).json({ error: 'Verification failed: ' + err.message });
    }
  }
};

module.exports = AuthController;