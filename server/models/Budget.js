const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Budget', budgetSchema);