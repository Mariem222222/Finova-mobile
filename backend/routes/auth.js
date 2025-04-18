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

// ✅ AUTH MIDDLEWARE (for protecting routes)
async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // 👈 This is what your other routes rely on
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// 🔐 REGISTER (hash password only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

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
    html: `<p>Your login verification code is: <strong>${code}</strong></p>`
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

  // Issue JWT
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ message: 'Login successful!', token });
});

// 🟢 Export both router and middleware
module.exports = {
  router,
  authMiddleware
};
