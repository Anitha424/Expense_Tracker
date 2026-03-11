const IncomeTarget = require('../models/IncomeTarget');
const { computeIncomeSummary } = require('../services/incomeTargetService');

const setMonthlyIncomeTarget = async (req, res) => {
  try {
    const { month, targetAmount } = req.body;
    const userId = req.user.id;

    if (!month || targetAmount === undefined) {
      return res.status(400).json({ message: 'Month and targetAmount are required' });
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    if (targetAmount < 0) {
      return res.status(400).json({ message: 'Target amount cannot be negative' });
    }

    const existingTarget = await IncomeTarget.findOne({ userId, month });

    let target;
    if (existingTarget) {
      existingTarget.targetAmount = targetAmount;
      target = await existingTarget.save();
    } else {
      target = await IncomeTarget.create({
        month,
        targetAmount,
        userId,
      });
    }
    
    const summary = await computeIncomeSummary(userId, month);
    res.json(summary);
  } catch (error) {
    console.error('Error setting monthly income target:', error);
    res.status(500).json({ message: 'Failed to set monthly income target' });
  }
};

const getMonthlyIncomeSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user.id;

    if (!month) {
      return res.status(400).json({ message: 'Month query parameter is required' });
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ message: 'Month must be in YYYY-MM format' });
    }

    const summary = await computeIncomeSummary(userId, month);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching monthly income summary:', error);
    res.status(500).json({ message: 'Failed to fetch monthly income summary' });
  }
};

module.exports = {
  setMonthlyIncomeTarget,
  getMonthlyIncomeSummary,
};
