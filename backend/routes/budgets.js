const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction=require('../models/Transaction')
const authMiddleware = require('../Middleware/authMiddleware');


const calculateCurrentSavings = async (userId) => {
  try {
    const transactions = await Transaction.find({ userId });

    const stats = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      acc[transaction.type] += amount;
      return acc;
    }, {
      income: 0,
      expense: 0,
      savings: 0
    });

    return stats.savings > 0 ? stats.savings : stats.income - stats.expense;
  } catch (error) {
    console.error("Error calculating savings:", error);
    throw new Error("Error calculating current savings");
  }
};
// Get all budgets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Get budgets sorted by priority (ascending)
    const budgets = await Budget.find({ userId, status: { $ne: 'deleted' } })
      .sort({ priority: 1 }); // Sort by priority ascending

    const currentSavings = await calculateCurrentSavings(userId);

    // Only set currentAmount for the top priority budget
    const budgetsWithLiveData = budgets.map((budget, index) => ({
      ...budget.toObject(),
      currentAmount: index === 0 ? currentSavings : 0 
    }));

    res.status(200).json(budgetsWithLiveData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer l'épargne actuelle
router.get("/current-savings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentSavings = await calculateCurrentSavings(userId);
    res.status(200).json({ currentSavings });
  } catch (error) {
    console.error("Error getting current savings:", error);
    res.status(500).json({ error: error.message || "Failed to get current savings" });
  }
});
// Create new budget
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Consistent user ID
    const { name, targetAmount, targetDate, type, description, priority } = req.body;

    // Validate priority
    if (typeof priority !== 'number' || priority < 1) {
      return res.status(400).json({ error: 'Priority must be a positive integer' });
    }

    // Update existing priorities first
    await Budget.updateMany(
      { user: userId, priority: { $gte: priority } },
      { $inc: { priority: 1 } }
    );

    // Create new budget
    const budget = new Budget({
      user: userId,
      title: name,
      targetAmount,
      targetDate,
      type,
      description,
      priority 
    });

    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// update budget
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { 
      name: title, 
      targetAmount, 
      type, 
      description, 
      priority: newPriority 
    } = req.body;

    // Validation de la priorité
    if (typeof newPriority !== 'number' || newPriority < 1) {
      return res.status(400).json({ error: 'Priority must be a positive integer' });
    }

    // Récupération du budget existant
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const oldPriority = budget.priority;

    // Si changement de priorité
    if (newPriority !== oldPriority) {
      // 1. Supprimer l'ancienne priorité
      await Budget.updateMany(
        { user: userId, priority: { $gt: oldPriority } },
        { $inc: { priority: -1 } }
      );

      // 2. Faire de la place pour la nouvelle priorité
      await Budget.updateMany(
        { user: userId, priority: { $gte: newPriority } },
        { $inc: { priority: 1 } }
      );
    }

    // Mise à jour complète du budget
    const updatedBudget = await Budget.findByIdAndUpdate(id, {
      title,
      targetAmount,
      type,
      description,
      priority: newPriority,
      lastUpdated: Date.now(),
      targetDate: req.body.targetDate || budget.targetDate
    }, { new: true });

    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete budget
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const goal = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!goal) {
      return res.status(404).json({ error: "Objectif non trouvé" });
    }

    // Mark as deleted instead of removing
    await Budget.findByIdAndUpdate(req.params.id, { status: 'deleted' });
    res.status(200).json({ message: "Objectif marqué comme supprimé" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;