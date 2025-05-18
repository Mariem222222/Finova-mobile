const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware =require('../Middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, description, category,frequency } = req.body;
    if (!amount || !type || !description) {
      console.error('Validation failed: Missing required fields');
      return res.status(401).json({ error: 'Missing required fields' });
    }
     if (!['one-time', 'monthly'].includes(frequency)) {
      return res.status(400).json({ error: 'Invalid frequency' });
    }
    const transaction = new Transaction({
      user: req.user.id,
      amount:amount,
      type:type,
      description:description,
      category:category,
      frequency,
      nextPaymentDate: frequency === 'monthly' ? 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    });

    const user = await User.findById(req.user.id);
    user.balance += type === "income" ? amount : -amount;
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
    res.json({
      transactions
    });
  } catch (err) {
    console.error(`[ERROR] Transaction fetch failed: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;