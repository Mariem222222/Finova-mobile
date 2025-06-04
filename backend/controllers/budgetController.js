// controllers/budgetController.js
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

class BudgetController {
  // Calculate current savings (income - expenses)
  static async calculateCurrentSavings(userId) {
    try {
      const transactions = await Transaction.find({ user: userId });
      
      const result = transactions.reduce((acc, transaction) => {
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'income') {
          acc.income += amount;
        } else if (transaction.type === 'expense') {
          acc.expense += amount;
        }
        return acc;
      }, { income: 0, expense: 0 });
      
      return result.income - result.expense;
      
    } catch (error) {
      throw new Error('Error calculating savings: ' + error.message);
    }
  }

  // Get all budgets for a user
  static async getBudgets(req, res) {
    try {
      const userId = req.user.id;
      const budgets = await Budget.find({ 
        user: userId, 
        status: { $ne: 'deleted' } 
      }).sort({ priority: 1 });

      const currentSavings = await thiscalculateCurrentSavings(req.user.id);
      
      // Only set currentAmount for top priority budget
      const budgetsWithData = budgets.map((budget, index) => ({
        ...budget.toObject(),
        currentAmount: index === 0 ? currentSavings : 0
      }));

      res.status(200).json(budgetsWithData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get current savings amount
  static async getCurrentSavings(req, res) {
    try {
      const currentSavings = BudgetController.calculateCurrentSavings(req.user.id);
      res.status(200).json({ currentSavings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create new budget
  static async createBudget(req, res) {
    try {
      const userId = req.user.id;
      const { name, targetAmount, targetDate, type, description, priority } = req.body;
      
      // Validate priority
      if (typeof priority !== 'number' || priority < 1) {
        return res.status(400).json({ error: 'Priority must be a positive integer' });
      }

      // Shift existing priorities
      await this.shiftPriorities(userId, priority, 1);

      // Create new budget
      const budget = new Budget({
        user: userId,
        title: name,
        targetAmount,
        targetDate,
        type,
        description,
        priority,
        status: 'active'
      });

      const newBudget = await budget.save();
      res.status(201).json(newBudget);
      
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Update existing budget
  static async updateBudget(req, res) {
    try {
      const userId = req.user.id;
      const budgetId = req.params.id;
      const updates = req.body;
      
      // Validate priority if provided
      if (updates.priority && (typeof updates.priority !== 'number' || updates.priority < 1)) {
        return res.status(400).json({ error: 'Priority must be a positive integer' });
      }

      const existingBudget = await Budget.findById(budgetId);
      if (!existingBudget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      // Handle priority changes
      if (updates.priority && updates.priority !== existingBudget.priority) {
        await this.handlePriorityChange(
          userId, 
          existingBudget.priority, 
          updates.priority
        );
      }

      // Prepare update data
      const updateData = {
        title: updates.name || existingBudget.title,
        targetAmount: updates.targetAmount || existingBudget.targetAmount,
        targetDate: updates.targetDate || existingBudget.targetDate,
        type: updates.type || existingBudget.type,
        description: updates.description || existingBudget.description,
        priority: updates.priority || existingBudget.priority,
        lastUpdated: Date.now()
      };

      const updatedBudget = await Budget.findByIdAndUpdate(budgetId, updateData, {
        new: true,
        runValidators: true
      });

      res.json(updatedBudget);
      
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete budget (soft delete)
  static async deleteBudget(req, res) {
    try {
      const budget = await Budget.findOneAndUpdate(
        { 
          _id: req.params.id, 
          user: req.user.id 
        },
        { status: 'deleted' },
        { new: true }
      );

      if (!budget) {
        return res.status(404).json({ error: "Budget not found" });
      }

      // Shift priorities for remaining budgets
      await this.shiftPriorities(
        req.user.id, 
        budget.priority + 1, 
        -1
      );

      res.status(200).json({ message: "Budget marked as deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  // Helper: Shift priorities for budgets
  static async shiftPriorities(userId, startingPriority, increment) {
    await Budget.updateMany(
      { 
        user: userId, 
        priority: { $gte: startingPriority } 
      },
      { $inc: { priority: increment } }
    );
  }

  // Helper: Handle priority changes during updates
  static async handlePriorityChange(userId, oldPriority, newPriority) {
    if (oldPriority < newPriority) {
      // Moving down in priority (higher number)
      await this.shiftPriorities(
        userId,
        oldPriority + 1,
        -1
      );
      await this.shiftPriorities(
        userId,
        newPriority + 1,
        1
      );
    } else {
      // Moving up in priority (lower number)
      await this.shiftPriorities(
        userId,
        newPriority,
        1
      );
      await this.shiftPriorities(
        userId,
        oldPriority + 1,
        -1
      );
    }
  }
}

module.exports = BudgetController;