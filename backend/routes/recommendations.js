const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const { getGroqRecommendation } = require("../services/aiService");

// GET /api/recommendations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    // Calculate user savings (monthly/yearly)
    const transactions = await Transaction.find({ userId });
    const Budgets = await Budget.find({ userId });
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();

    const monthlySavings = Budgets
      .filter(tx => tx.title === "savings" && new Date(tx.dateTime).getFullYear() === thisYear && new Date(tx.dateTime).getMonth() === thisMonth)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const yearlySavings = Budgets
      .filter(tx => tx.title === "savings" && new Date(tx.dateTime).getFullYear() === thisYear)
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Get user's spending patterns
    const spendingByCategory = transactions
      .filter(tx => tx.type === "expense")
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

    // Compose prompt for Groq
  const prompt = `As a financial advisor, analyze this user's financial situation and provide recommendations:
Monthly Savings: $${monthlySavings.toFixed(2)}
Yearly Savings: $${yearlySavings.toFixed(2)}
Spending by Category: ${JSON.stringify(spendingByCategory)}
 Return ONLY a valid JSON array following this exact structure:
[
  {
    "title": "Recommendation Title",
    "detail": "Detailed explanation...",
    "actionItems": ["Action 1", "Action 2"],
  }
]

Formatting Rules:
- No markdown
- No additional text
- Valid JSON syntax
- Only the array or object with 'cards' property`;
    // Get recommendations from Groq
    const cards = await getGroqRecommendation(prompt);

    res.json({ cards });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

module.exports = router;