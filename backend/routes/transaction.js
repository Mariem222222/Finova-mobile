const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware =require('../Middleware/authMiddleware');
const calculateNextRun =require('../helper/calculateNextRun')


// Function to calculate current expenses for a user
const calculateCurrentExpenses = async (userId) => {
  try {
    const transactions = await Transaction.find({ userId });

    const totalExpenses = transactions.reduce((acc, transaction) => {
      // Check if the transaction is an expense (adjust 'type' based on your data model)
      if (transaction.type === 'expense') {
        return acc + parseFloat(transaction.amount);
      }
      return acc;
    }, 0);

    return totalExpenses;
  } catch (error) {
    console.error("Error calculating current expenses:", error);
    throw new Error("Error calculating current expenses");
  }
};
// Define the route to get current expenses
router.get("/current-expenses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentExpenses = await calculateCurrentExpenses(userId);
    res.status(200).json({ currentExpenses });
  } catch (error) {
    console.error("Error getting current expenses:", error);
    res.status(500).json({ error: error.message || "Failed to get current expenses" });
  }
});
  

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