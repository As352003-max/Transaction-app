const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Salary', 'Investment', 'Other Income', 'Misc Expense', 'Misc Income'],
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);