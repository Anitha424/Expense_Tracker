import { useCallback, useEffect, useMemo, useState } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionFilters from '../components/TransactionFilters';
import TransactionList from '../components/TransactionList';
import AppShell from '../layouts/AppShell';
import api from '../services/api';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
  });

  const categories = useMemo(() => [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES], []);

  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    if (filters.search.trim()) query.append('search', filters.search.trim());
    if (filters.category !== 'all') query.append('category', filters.category);
    if (filters.type !== 'all') query.append('type', filters.type);
    if (filters.startDate) query.append('startDate', filters.startDate);
    if (filters.endDate) query.append('endDate', filters.endDate);
    return query.toString();
  }, [filters]);

  const loadTransactions = useCallback(async () => {
    try {
      setError('');
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (formData) => {
    try {
      setError('');
      const { isRecurring, ...payload } = formData;

      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, payload);
        setEditingTransaction(null);
      } else {
        await api.post('/transactions', payload);
        if (isRecurring) {
          await api.post('/recurring', {
            title: payload.title,
            amount: payload.amount,
            type: payload.type,
            category: payload.category,
            startDate: payload.date,
          });
        }
      }

      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save transaction.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await api.delete(`/transactions/${id}`);
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete transaction.');
    }
  };

  return (
    <AppShell title="Transactions" subtitle="Create, edit, search, and manage all records from one workspace">
      {error && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <AddTransactionForm
          key={editingTransaction?._id || 'new'}
          onSubmit={handleSubmit}
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />
        <section className="space-y-3">
          <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
            onEdit={setEditingTransaction}
            isLoading={loading}
          />
        </section>
      </div>
    </AppShell>
  );
}

export default TransactionsPage;
