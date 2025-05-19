const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income','expense','loan'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['transfer', 'payment', 'deposit', 'withdrawal', 'purchase'],
    default: 'payment'
  },
  isRecurring: { type: Boolean, default: false },
  interval: { type: String, enum: ["daily", "weekly", "monthly","yearly"] },
  nextRun: { type: Date },
  active: { type: Boolean, default: true }
});

// Add virtual for formatted date
TransactionSchema.virtual('formattedDate').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Transaction', TransactionSchema);