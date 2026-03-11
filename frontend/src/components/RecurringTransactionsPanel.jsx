import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, RotateCw } from 'lucide-react';
import { useLocalStorage, generateId } from '../hooks/useLocalStorage';

const RecurringTransactionsPanel = ({ recurringTransactions = [], onDelete = null, onAddRecurring = null }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRecurring, setNewRecurring] = useState({
    title: '',
    amount: '',
    category: 'Utilities',
    frequency: 'monthly', // monthly, quarterly, yearly
    startDate: new Date().toISOString().split('T')[0],
  });

  const frequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly (Every 3 months)' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleAddRecurring = () => {
    if (newRecurring.title.trim() && newRecurring.amount) {
      const recurring = {
        id: generateId(),
        ...newRecurring,
        amount: Number(newRecurring.amount),
        createdAt: new Date().toISOString(),
        lastProcessed: null,
      };

      if (onAddRecurring) {
        onAddRecurring(recurring);
      }

      setNewRecurring({
        title: '',
        amount: '',
        category: 'Utilities',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
      });
      setIsAdding(false);
    }
  };

  const getNextDate = (startDate, frequency, lastProcessed) => {
    const lastDate = lastProcessed ? new Date(lastProcessed) : new Date(startDate);
    const nextDate = new Date(lastDate);

    if (frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (frequency === 'quarterly') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else if (frequency === 'yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    return nextDate;
  };

  const getDaysUntilNext = (nextDate) => {
    const today = new Date();
    const timeDiff = nextDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-teal-900/50 to-teal-800/50 p-6 backdrop-blur-md border border-teal-700/50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-teal-400" />
          Recurring Transactions
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {/* Add Recurring Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-teal-950/50 border border-teal-700/50 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newRecurring.title}
                  onChange={(e) => setNewRecurring({ ...newRecurring, title: e.target.value })}
                  placeholder="e.g., Netflix"
                  className="w-full px-3 py-2 bg-teal-900 border border-teal-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  value={newRecurring.amount}
                  onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-teal-900 border border-teal-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={newRecurring.category}
                  onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
                  placeholder="e.g., Entertainment"
                  className="w-full px-3 py-2 bg-teal-900 border border-teal-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Frequency</label>
                <select
                  value={newRecurring.frequency}
                  onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
                  className="w-full px-3 py-2 bg-teal-900 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={newRecurring.startDate}
                onChange={(e) => setNewRecurring({ ...newRecurring, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-teal-900 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddRecurring}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
              >
                Add Recurring
              </button>
              <button
                onClick={() => {
                  setNewRecurring({
                    title: '',
                    amount: '',
                    category: 'Utilities',
                    frequency: 'monthly',
                    startDate: new Date().toISOString().split('T')[0],
                  });
                  setIsAdding(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recurring List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recurringTransactions.length > 0 ? (
            recurringTransactions.map((recurring, index) => {
              const nextDate = getNextDate(
                recurring.startDate,
                recurring.frequency,
                recurring.lastProcessed
              );
              const daysUntil = getDaysUntilNext(nextDate);

              return (
                <motion.div
                  key={recurring.id || recurring._id}
                  className="p-3 rounded-lg bg-teal-950/40 border border-teal-700/50 flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{recurring.title}</p>
                    <p className="text-sm text-gray-400">
                      ₹{recurring.amount.toFixed(0)} • {recurring.category} •{' '}
                      <span className="capitalize">{recurring.frequency || 'monthly'}</span>
                    </p>
                    <p className="text-xs text-teal-300 mt-1">
                      {daysUntil > 0
                        ? `Due in ${daysUntil} days`
                        : daysUntil === 0
                        ? 'Due today!'
                        : 'Overdue'}
                    </p>
                  </div>

                  <button
                    onClick={() => onDelete && onDelete(recurring.id || recurring._id)}
                    className="px-2 py-1 hover:bg-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <motion.p
              className="text-center text-gray-400 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No recurring transactions. Add one to automate your expenses!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RecurringTransactionsPanel;
