const Budget = require('../models/Budget');
const { computeBudgetSummary, checkBudgetAndNotify } = require('../services/budgetService');
const { getMonthRange } = require('../services/dateUtils');

const setMonthlyBudget = async (req, res) => {
  try {
    const { amount, month } = req.body;

    if (amount === undefined || Number(amount) < 0) {
      return res.status(400).json({ message: 'A valid amount is required' });
    }

    const resolved = getMonthRange(month).month;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month: resolved },
      { amount: Number(amount) },
      { new: true, upsert: true, runValidators: true }
    );

    const summary = await checkBudgetAndNotify(req.user.id, resolved);

    return res.status(200).json({ budget, summary });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while saving budget' });
  }
};

const getMonthlyBudgetSummary = async (req, res) => {
  try {
    const summary = await computeBudgetSummary(req.user.id, req.query.month);
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching budget summary' });
  }
};

module.exports = {
  setMonthlyBudget,
  getMonthlyBudgetSummary,
};
