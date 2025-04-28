const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, description, category } = req.body;
    if (!amount || !type || !description) {
      console.error('Validation failed: Missing required fields');
      return res.status(401).json({ error: 'Missing required fields' });
    }
    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      description,
      category
    });

    const user = await User.findById(req.user.id);
    user.balance += type === 'revenue' ? amount : -amount;
    await transaction.save();
    console.log(`Transaction saved with ID: ${transaction._id}`);
    user.transactions.push(transaction);
    await user.save();
    console.log('User record updated with new transaction');
    res.status(201).json(transaction);
  } catch (err) {
    console.error(`[ERROR] Transaction creation failed: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {    
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(20);
    res.json({
      balance: req.user.balance,
      name:req.user.name,
      transactions
    });
  } catch (err) {
    console.error(`[ERROR] Transaction fetch failed: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;