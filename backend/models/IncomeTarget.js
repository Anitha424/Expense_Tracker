const mongoose = require('mongoose');

const incomeTargetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
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

incomeTargetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('IncomeTarget', incomeTargetSchema);
