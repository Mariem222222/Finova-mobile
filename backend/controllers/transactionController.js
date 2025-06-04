const Transaction = require('../models/Transaction');
const User = require('../models/User');
const calculateNextRun = require('../helper/calculateNextRun');

class TransactionController {
  // Calculate expenses for a user
  static async calculateCurrentExpenses(userId) {
    const transactions = await Transaction.find({ user: userId });  // Fixed: use 'user' not 'userId'
    return transactions.reduce((total, t) => 
      t.type === 'expense' ? total + parseFloat(t.amount) : total, 0
    );
  }

  // Get current expenses (controller method)
  static async getCurrentExpenses(req, res) {
    try {
      const currentExpenses = await this.calculateCurrentExpenses(req.user.id);
      res.status(200).json({ currentExpenses });
    } catch (error) {
      res.status(500).json({ error: "Failed to get expenses" });
    }
  }

  // Create transaction (controller method)
  static async createTransaction(req, res) {
    try {
      const { amount, type, description, category, isRecurring, interval } = req.body;
      const amountNum = parseFloat(amount);

      // Validation
      if (!amount || isNaN(amountNum)) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      if (!type || !description) {
        return res.status(400).json({ error: 'Missing type or description' });
      }

      // Recurring validation
      if (isRecurring && !['daily', 'weekly', 'monthly'].includes(interval)) {
        return res.status(400).json({ error: 'Invalid interval' });
      }

      // Build transaction
      const transactionData = {
        user: req.user.id,
        amount: amountNum,
        type,
        description,
        category,
        date: new Date(),
        isRecurring: !!isRecurring
      };

      // Add recurring fields
      if (isRecurring) {
        transactionData.interval = interval;
        transactionData.nextRun = calculateNextRun(new Date(), interval);
        transactionData.active = true;
      }

      // Create transaction
      const transaction = new Transaction(transactionData);
      await transaction.save();

      // Update user
      const user = await User.findById(req.user.id);
      user.balance += type === "income" ? amountNum : -amountNum;
      user.transactions.push(transaction);
      await user.save();

      res.status(201).json(transaction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Get transactions (controller method)
  static async getTransactions(req, res) {
    try {
      const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
      res.json({ transactions });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TransactionController;