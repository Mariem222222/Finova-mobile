
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware =require('../Middleware/authMiddleware')


// Add this new route to your transaction routes
// routes/data.js
router.get('/:type', authMiddleware, async (req, res) => {
    try {
      const validTypes = ['revenue', 'depense', 'loan'];
      if (!validTypes.includes(req.params.type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }
      const transactions = await Transaction.find({
        user: req.user.id,
        type: req.params.type
      }).sort({ date: -1 });
      
      // Group by category for chart
      const categoryMap = {};
      transactions.forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
      });
  
      const chartData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value
      }));
  
      res.json({
        chartData,
        transactions: transactions.map(t => ({
          date: t.formattedDate,
          description: t.description,
          amount: t.type === 'depense' ? -t.amount : t.amount,
          category: t.category
        }))
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
module.exports = router;