import { useEffect, useState } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import AppShell from '../layouts/AppShell';
import api from '../services/api';

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError('');
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <AppShell title="Analytics" subtitle="Monthly trends, category insights, and income-expense comparisons">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track trends, spending categories, and your money flow.</p>
        </div>
        {error && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Loading analytics...
          </div>
        ) : (
          <AnalyticsCharts transactions={transactions} />
        )}
      </div>
    </AppShell>
  );
}

export default AnalyticsPage;
