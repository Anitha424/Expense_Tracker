const mongoose = require('mongoose');

const recurringTransactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['monthly'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextRunDate: {
      type: Date,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTransaction', recurringTransactionSchema);
