const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const authMiddleware = require('../Middleware/authMiddleware');

// Get all budgets
router.get('/',authMiddleware,async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
          .sort({ date: -1 })
        res.json({
          budgets
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new budget
router.post('/',authMiddleware, async (req, res) => {
  const budget = new Budget({
    user: req.user.id,
    title: req.body.title,
    currentAmount: req.body.currentAmount,
    targetAmount: req.body.targetAmount,
    type: req.body.type,
    description: req.body.description
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.title = req.body.title || budget.title;
    budget.currentAmount = req.body.currentAmount || budget.currentAmount;
    budget.targetAmount = req.body.targetAmount || budget.targetAmount;
    budget.type = req.body.type || budget.type;
    budget.description = req.body.description || budget.description;
    budget.lastUpdated = Date.now();

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;