const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name, email, password } = req.body;
    // In registration route
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered!' });
    console.log("register sucsess")
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log("register failed")
  }
});

// Login (simplified)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Logged in!', user });
});

module.exports = router;