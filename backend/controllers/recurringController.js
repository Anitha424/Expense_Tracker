const RecurringTransaction = require('../models/RecurringTransaction');
const { startOfDay } = require('../services/dateUtils');

const createRecurringTransaction = async (req, res) => {
  try {
    const { title, amount, type = 'expense', category, startDate, frequency = 'monthly' } = req.body;

    if (!title || !amount || !category || !startDate) {
      return res.status(400).json({ message: 'title, amount, category and startDate are required' });
    }

    const recurring = await RecurringTransaction.create({
      title,
      amount: Number(amount),
      type,
      category,
      frequency,
      startDate: startOfDay(startDate),
      nextRunDate: startOfDay(startDate),
      userId: req.user.id,
    });

    return res.status(201).json(recurring);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating recurring transaction' });
  }
};

const getRecurringTransactions = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({ userId: req.user.id }).sort({ nextRunDate: 1 });
    return res.status(200).json(recurring);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching recurring transactions' });
  }
};

const updateRecurringTransaction = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findById(req.params.id);

    if (!recurring) {
      return res.status(404).json({ message: 'Recurring transaction not found' });
    }

    if (recurring.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const payload = { ...req.body };

    if (payload.amount !== undefined) {
      payload.amount = Number(payload.amount);
    }

    if (payload.startDate) {
      payload.startDate = startOfDay(payload.startDate);
    }

    if (payload.nextRunDate) {
      payload.nextRunDate = startOfDay(payload.nextRunDate);
    }

    const updated = await RecurringTransaction.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while updating recurring transaction' });
  }
};

const deleteRecurringTransaction = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findById(req.params.id);

    if (!recurring) {
      return res.status(404).json({ message: 'Recurring transaction not found' });
    }

    if (recurring.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recurring.deleteOne();
    return res.status(200).json({ message: 'Recurring transaction deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while deleting recurring transaction' });
  }
};

module.exports = {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};
