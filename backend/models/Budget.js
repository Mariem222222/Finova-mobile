const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  completedAt: {
    type: Date}
});

module.exports = mongoose.model('Budget', budgetSchema);