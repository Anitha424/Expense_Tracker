import { useEffect, useState } from 'react';
import { CATEGORY_OPTIONS } from '../utils/categories';

const buildDefaultForm = () => ({
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
});

const buildEditForm = (editingTransaction) => ({
  title: editingTransaction.title,
  amount: editingTransaction.amount,
  type: editingTransaction.type,
  category: editingTransaction.category,
  date: new Date(editingTransaction.date).toISOString().split('T')[0],
  isRecurring: false,
});

function AddTransactionForm({ onSubmit, editingTransaction, onCancelEdit }) {
  const [formData, setFormData] = useState(() =>
    editingTransaction ? buildEditForm(editingTransaction) : buildDefaultForm()
  );

  useEffect(() => {
    setFormData(editingTransaction ? buildEditForm(editingTransaction) : buildDefaultForm());
  }, [editingTransaction]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'type') {
      const nextCategory = CATEGORY_OPTIONS[value][0];
      setFormData((prev) => ({ ...prev, type: value, category: nextCategory }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      title: String(formData.title || '').trim(),
      amount: Number(formData.amount || 0),
      date: formData.date || new Date().toISOString().split('T')[0],
    };

    await onSubmit(payload);
    if (!editingTransaction) {
      setFormData(buildDefaultForm());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          min="0"
          step="0.01"
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {CATEGORY_OPTIONS[formData.type].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-cyan-500 focus:ring sm:col-span-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 sm:col-span-2">
          <input
            name="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(event) => setFormData((prev) => ({ ...prev, isRecurring: event.target.checked }))}
            className="h-4 w-4"
          />
          Make this a recurring monthly transaction
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
        >
          {editingTransaction ? 'Update' : 'Add'}
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddTransactionForm;
