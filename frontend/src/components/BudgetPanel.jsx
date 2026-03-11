import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BudgetPanel = ({ transactions = [] }) => {
  const [budget, setBudgetInput] = useLocalStorage('monthlyBudget', 20000);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget);

  // Calculate current month's expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remaining = budget - currentMonthExpenses;
  const percentageUsed = (currentMonthExpenses / budget) * 100;
  const isExceeded = remaining < 0;

  const handleSaveBudget = () => {
    const newBudget = Number(inputValue);
    if (newBudget > 0) {
      setBudgetInput(newBudget);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue(budget);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-emerald-950/60 to-green-950/45 p-6 backdrop-blur-md border border-emerald-900/60 shadow-lg shadow-emerald-950/40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Monthly Budget
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 bg-emerald-950/70 border border-emerald-900/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter budget amount"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveBudget}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Budget Display */}
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-1">Budget Set</p>
            <p className="text-3xl font-bold text-emerald-300">₹{budget.toLocaleString()}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Spent: ₹{currentMonthExpenses.toFixed(0)}</span>
              <span className={`font-semibold ${isExceeded ? 'text-red-400' : 'text-green-400'}`}>
                {percentageUsed.toFixed(1)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-emerald-950/70 rounded-full h-3 overflow-hidden border border-emerald-900/60">
              <motion.div
                className={`h-full transition-all duration-500 ${
                  isExceeded
                    ? 'bg-gradient-to-r from-red-600 to-red-400'
                    : percentageUsed > 75
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                    : 'bg-gradient-to-r from-green-600 to-green-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Remaining Budget */}
          <motion.div
            className={`p-3 rounded-lg text-center ${
              isExceeded
                ? 'bg-red-900/40 border border-red-700/50'
                : 'bg-green-900/40 border border-green-700/50'
            }`}
            animate={{
              scale: isExceeded ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 2, repeat: isExceeded ? Infinity : 0 }}
          >
            <p className="text-xs text-gray-300 mb-1">Remaining Budget</p>
            <p
              className={`text-2xl font-bold ${
                isExceeded ? 'text-red-400' : 'text-green-400'
              }`}
            >
              ₹{Math.abs(remaining).toFixed(0)}
            </p>
            {isExceeded && (
              <p className="text-xs text-red-300 mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Budget exceeded by ₹{Math.abs(remaining).toFixed(0)}
              </p>
            )}
          </motion.div>

          {/* Warning Alert */}
          {percentageUsed > 75 && !isExceeded && (
            <motion.div
              className="p-3 rounded-lg bg-yellow-900/40 border border-yellow-700/50 flex items-start gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-300">
                You&apos;ve used {percentageUsed.toFixed(1)}% of your budget. Be mindful of your
                spending!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default BudgetPanel;
