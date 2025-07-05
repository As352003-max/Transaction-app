const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

router.post('/', async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Budget for this category and month already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1, category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;