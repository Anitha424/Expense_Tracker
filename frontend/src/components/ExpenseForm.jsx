import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { getDefaultCategories } from '../hooks/useLocalStorage';

const buildDefaultForm = () => ({
  title: '',
  amount: '',
  category: 'Food & Dining',
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
});

const ExpenseForm = ({ onAddTransaction, onUpdateTransaction, editingTransaction, onCancelEdit, categories = null }) => {
  const [formData, setFormData] = useState({
    ...buildDefaultForm(),
  });
  const [error, setError] = useState('');

  // Use provided categories or defaults
  const expenseCategories = categories 
    ? categories.map(c => c.name)
    : getDefaultCategories().map(c => c.name);
  
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: value === 'income' ? 'Salary' : expenseCategories[0] }),
    }));
  };

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount || '',
        category: editingTransaction.category || expenseCategories[0],
        type: editingTransaction.type || 'expense',
        date: editingTransaction.date
          ? new Date(editingTransaction.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData(buildDefaultForm());
    }
  }, [editingTransaction, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.title && formData.amount) {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const result = editingTransaction
        ? await onUpdateTransaction?.({ ...payload, id: editingTransaction.id, _id: editingTransaction._id })
        : await onAddTransaction?.(payload);

      if (result && result.ok === false) {
        setError(result.message || 'Unable to save transaction');
        return;
      }

      if (!editingTransaction) {
        setFormData(buildDefaultForm());
      }
    }
  };

  const categoryOptions = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200 dark:border-emerald-900/60 bg-white dark:bg-emerald-950/45 backdrop-blur-xl p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter transaction title"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-emerald-950/60 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            required
          />
        </motion.div>

        {/* Amount Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Amount (INR)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-emerald-950/60 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            required
          />
        </motion.div>

        {/* Type and Category Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Type Select */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-emerald-950/60 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </motion.div>

          {/* Category Select */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-emerald-950/60 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Date Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-emerald-950/60 text-gray-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </motion.button>

        {editingTransaction && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancelEdit}
            className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-200 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-all"
          >
            Cancel Edit
          </motion.button>
        )}

        {error && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default ExpenseForm;
