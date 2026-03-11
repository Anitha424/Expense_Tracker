const Transaction = require('../models/Transaction');
const { checkBudgetAndNotify } = require('../services/budgetService');
const { processDueRecurringTransactions } = require('../services/recurringService');

const buildSearchFilters = (search) => {
  if (!search) {
    return null;
  }

  const parsedAmount = Number(search);
  const dateCandidate = new Date(search);
  const dateIsValid = Number.isNaN(dateCandidate.getTime()) === false;

  const orFilters = [{ title: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];

  if (!Number.isNaN(parsedAmount)) {
    orFilters.push({ amount: parsedAmount });
  }

  if (dateIsValid) {
    const dayStart = new Date(dateCandidate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    orFilters.push({ date: { $gte: dayStart, $lt: dayEnd } });
  }

  return { $or: orFilters };
};

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = await Transaction.create({
      title,
      amount: Number(amount),
      type,
      category,
      date,
      userId: req.user.id,
    });

    await checkBudgetAndNotify(req.user.id);

    return res.status(201).json(transaction);
  } catch (error) {
    if (error?.name === 'ValidationError') {
      const firstError = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({ message: firstError || 'Invalid transaction data' });
    }

    return res.status(500).json({ message: 'Server error while creating transaction' });
  }
};

const getTransactions = async (req, res) => {
  try {
    await processDueRecurringTransactions(req.user.id);

    const { category, type, startDate, endDate, minAmount, maxAmount, search } = req.query;
    const filter = { userId: req.user.id };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const inclusiveEnd = new Date(endDate);
        inclusiveEnd.setHours(23, 59, 59, 999);
        filter.date.$lte = inclusiveEnd;
      }
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) {
        filter.amount.$gte = Number(minAmount);
      }
      if (maxAmount) {
        filter.amount.$lte = Number(maxAmount);
      }
    }

    const searchFilter = buildSearchFilters(search);
    const finalFilter = searchFilter ? { $and: [filter, searchFilter] } : filter;

    const transactions = await Transaction.find(finalFilter).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching transactions' });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching recent transactions' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        amount: req.body.amount !== undefined ? Number(req.body.amount) : transaction.amount,
      },
      { new: true, runValidators: true }
    );

    await checkBudgetAndNotify(req.user.id);

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while updating transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    await checkBudgetAndNotify(req.user.id);
    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting transaction' });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  getRecentTransactions,
  updateTransaction,
  deleteTransaction,
};
