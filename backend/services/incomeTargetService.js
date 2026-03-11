const IncomeTarget = require('../models/IncomeTarget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const { getMonthRange } = require('./dateUtils');

const computeIncomeSummary = async (userId, monthInput) => {
  const { month, start, end } = getMonthRange(monthInput);

  const [targetDoc, incomeAgg] = await Promise.all([
    IncomeTarget.findOne({ userId, month }),
    Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'income',
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

  const actual = incomeAgg[0]?.total || 0;
  const target = targetDoc?.targetAmount || 0;
  const remaining = target - actual;
  const underTarget = target > 0 && actual < target;

  return {
    month,
    target,
    actual,
    remaining,
    underTarget,
  };
};

module.exports = {
  computeIncomeSummary,
};
