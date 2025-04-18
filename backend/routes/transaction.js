const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth'); // <== updated import
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, description, category } = req.body;

    if (!amount || !type || !description) {
      return res.status(401).json({ error: 'Missing required fields' });
    }

    const transaction = new Transaction({
      user: req.user._id,
      amount,
      type,
      description,
      category
    });

    const user = await User.findById(req.user._id);
    user.balance += type === 'credit' ? amount : -amount;

    await transaction.save();
    user.transactions.push(transaction);
    await user.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(20);

    res.json({
      balance: req.user.balance,
      transactions
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
