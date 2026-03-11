import { useEffect, useMemo, useState } from 'react';
import AIInsightsPanel from '../components/AIInsightsPanel';
import AppShell from '../layouts/AppShell';
import api from '../services/api';
import { calculateTotals } from '../utils/analytics';

function AIInsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load AI insights.');
      }
    };

    loadData();
  }, []);

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);

  return (
    <AppShell title="AI Insights" subtitle="Smart financial suggestions from your transaction behavior">
      {error && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <AIInsightsPanel transactions={transactions} totals={totals} />
    </AppShell>
  );
}

export default AIInsightsPage;
