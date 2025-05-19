const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware =require('../Middleware/authMiddleware');
const calculateNextRun =require('../helper/calculateNextRun')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, description, category, isRecurring, interval } = req.body;
    
    // Validate required fields
    if (!amount || !type || !description) {
      return res.status(400).json({ error: 'Missing required fields: amount, type, description' });
    }

    // Additional validations for recurring transactions
    if (isRecurring) {
      if (!interval) {
        return res.status(400).json({ error: 'Recurring transactions require  interval' });
      }
      
      const parsedDate = new Date(Date.now());
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid dateTime format' });
      }

      const validIntervals = ['daily', 'weekly', 'monthly'];
      if (!validIntervals.includes(interval)) {
        return res.status(400).json({ error: 'Invalid interval. Use daily, weekly, or monthly' });
      }
    }

    // Calculate nextRun if recurring
    let nextRunDate;
    if (isRecurring) {
      const parsedDateTime = new Date(Date.now());
      nextRunDate = calculateNextRun(parsedDateTime, interval);
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      description,
      category,
      isRecurring: isRecurring || false,
      interval: isRecurring ? interval : undefined,
      nextRun: isRecurring ? nextRunDate : undefined,
      active: isRecurring ? true : undefined,
      date: new Date(Date.now()) 
    });

    // Update user balance and save transaction
    const user = await User.findById(req.user.id);
    user.balance += type === "income" ? amount : -amount;
    await transaction.save();
    
    user.transactions.push(transaction);
    await user.save();
    
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