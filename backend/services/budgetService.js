const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const { sendBudgetExceededEmail } = require('./emailService');
const { getMonthRange } = require('./dateUtils');

const computeBudgetSummary = async (userId, monthInput) => {
  const { month, start, end } = getMonthRange(monthInput);

  const [budgetDoc, expenseAgg] = await Promise.all([
    Budget.findOne({ userId, month }),
    Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),
  ]);

  const spent = expenseAgg[0]?.total || 0;
  const budget = budgetDoc?.amount || 0;
  const remaining = budget - spent;
  const exceeded = budget > 0 && spent > budget;

  return {
    month,
    budget,
    spent,
    remaining,
    exceeded,
    alertSentAt: budgetDoc?.alertSentAt || null,
  };
};

const checkBudgetAndNotify = async (userId, monthInput) => {
  const { month } = getMonthRange(monthInput);
  const budgetDoc = await Budget.findOne({ userId, month });

  if (!budgetDoc) {
    return computeBudgetSummary(userId, month);
  }

  const summary = await computeBudgetSummary(userId, month);

  if (summary.exceeded && !budgetDoc.alertSentAt) {
    const user = await User.findById(userId);

    if (user) {
      await sendBudgetExceededEmail({
        email: user.email,
        name: user.name,
        month: summary.month,
        budget: summary.budget,
        spent: summary.spent,
        remaining: summary.remaining,
      });
    }

    budgetDoc.alertSentAt = new Date();
    await budgetDoc.save();
  }

  if (!summary.exceeded && budgetDoc.alertSentAt) {
    budgetDoc.alertSentAt = null;
    await budgetDoc.save();
  }

  return computeBudgetSummary(userId, month);
};

module.exports = {
  computeBudgetSummary,
  checkBudgetAndNotify,
};
