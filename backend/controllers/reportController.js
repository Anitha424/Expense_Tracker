const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getMonthRange } = require('../services/dateUtils');
const { sendMonthlyReportEmail } = require('../services/emailService');
const { computeBudgetSummary } = require('../services/budgetService');

const getMonthlyReport = async (req, res) => {
  try {
    const { month, start, end } = getMonthRange(req.query.month);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end },
    }).sort({ date: -1, createdAt: -1 });

    const summary = transactions.reduce(
      (acc, txn) => {
        if (txn.type === 'income') {
          acc.income += txn.amount;
        } else {
          acc.expense += txn.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    summary.balance = summary.income - summary.expense;

    const budgetSummary = await computeBudgetSummary(req.user.id, month);

    const user = await User.findById(req.user.id);
    if (user) {
      await sendMonthlyReportEmail({
        email: user.email,
        name: user.name,
        month,
        income: summary.income,
        expense: summary.expense,
        balance: summary.balance,
      });
    }

    return res.status(200).json({
      month,
      summary,
      budgetSummary,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while generating monthly report' });
  }
};

module.exports = {
  getMonthlyReport,
};
