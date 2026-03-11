import { useCallback, useEffect, useMemo, useState } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import AIInsightsPanel from '../components/AIInsightsPanel';
import AnalyticsCharts from '../components/AnalyticsCharts';
import BudgetPanel from '../components/BudgetPanel';
import IncomeSummaryPanel from '../components/IncomeSummaryPanel';
import RecentTransactions from '../components/RecentTransactions';
import RecurringTransactionsPanel from '../components/RecurringTransactionsPanel';
import ReportExportButtons from '../components/ReportExportButtons';
import SummaryCards from '../components/SummaryCards';
import TransactionFilters from '../components/TransactionFilters';
import TransactionList from '../components/TransactionList';
import AppShell from '../layouts/AppShell';
import api from '../services/api';
import { calculateTotals } from '../utils/analytics';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [isBudgetSaving, setIsBudgetSaving] = useState(false);
  const [incomeSummary, setIncomeSummary] = useState(null);
  const [isIncomeSaving, setIsIncomeSaving] = useState(false);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
  });

  const queryString = useMemo(() => {
    const query = new URLSearchParams();

    if (filters.search.trim()) {
      query.append('search', filters.search.trim());
    }
    if (filters.category !== 'all') {
      query.append('category', filters.category);
    }
    if (filters.type !== 'all') {
      query.append('type', filters.type);
    }
    if (filters.startDate) {
      query.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      query.append('endDate', filters.endDate);
    }

    return query.toString();
  }, [filters]);

  const loadTransactions = useCallback(async () => {
    try {
      setError('');
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [queryString]);
  const loadBudget = useCallback(async () => {
    const response = await api.get('/budgets/monthly');
    setBudgetSummary(response.data);
  }, []);

  const loadIncome = useCallback(async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const response = await api.get(`/income/targets/monthly?month=${month}`);
      setIncomeSummary(response.data);
    } catch (err) {
      console.error('Error loading income:', err);
    }
  }, []);

  const loadRecurring = useCallback(async () => {
    const response = await api.get('/recurring');
    setRecurringTransactions(response.data);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([loadTransactions(), loadBudget(), loadIncome(), loadRecurring()]);
    };

    loadDashboard();
  }, [loadTransactions, loadBudget, loadIncome, loadRecurring]);

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
          await loadRecurring();
        }
      }

      await Promise.all([loadTransactions(), loadBudget()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save transaction.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');
      await api.delete(`/transactions/${id}`);
      await Promise.all([loadTransactions(), loadBudget()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete transaction.');
    }
  };

  const handleDeleteRecurring = async (id) => {
    try {
      await api.delete(`/recurring/${id}`);
      await loadRecurring();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete recurring transaction.');
    }
  };

  const handleBudgetSave = async (amount) => {
    try {
      setIsBudgetSaving(true);
      setError('');
      const response = await api.put('/budgets/monthly', { amount });
      setBudgetSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save budget.');
    } finally {
      setIsBudgetSaving(false);
    }
  };

  const handleIncomeSave = async (targetAmount) => {
    try {
      setIsIncomeSaving(true);
      setError('');
      const month = new Date().toISOString().slice(0, 7);
      const response = await api.put('/income/targets/monthly', { month, targetAmount });
      setIncomeSummary({
        month: response.data.month,
        target: response.data.target,
        actual: response.data.actual,
        remaining: response.data.remaining,
        underTarget: response.data.underTarget,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save income target.');
    } finally {
      setIsIncomeSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setError('');
      const response = await api.get(`/reports/monthly?month=${reportMonth}`);
      setReportData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate report.');
    }
  };

  const categories = useMemo(() => {
    return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  }, []);

  const totals = calculateTotals(transactions);
  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <AppShell title="Dashboard" subtitle="Track your money flow with AI-powered insights">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <SummaryCards totals={totals} />
        <RecentTransactions transactions={recentTransactions} />
        <AIInsightsPanel transactions={transactions} totals={totals} />
        {error && <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}
        <BudgetPanel
          key={`${budgetSummary?.month || 'current'}-${budgetSummary?.budget || 0}`}
          summary={budgetSummary}
          onSave={handleBudgetSave}
          isSaving={isBudgetSaving}
        />
        <IncomeSummaryPanel
          key={`${incomeSummary?.month || 'current'}-${incomeSummary?.target || 0}`}
          summary={incomeSummary}
          onSave={handleIncomeSave}
          isSaving={isIncomeSaving}
        />
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            <AddTransactionForm
              key={editingTransaction?._id || 'new'}
              onSubmit={handleSubmit}
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
            <RecurringTransactionsPanel
              recurringTransactions={recurringTransactions}
              onDelete={handleDeleteRecurring}
            />
          </div>
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transaction History</h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="month"
                  value={reportMonth}
                  onChange={(event) => setReportMonth(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={handleGenerateReport}
                  className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
                >
                  Generate Report
                </button>
                {reportData && <ReportExportButtons reportData={reportData} month={reportMonth} />}
              </div>
            </div>
            <TransactionFilters filters={filters} onChange={setFilters} categories={categories} />
            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
              onEdit={setEditingTransaction}
              isLoading={loading}
            />
          </section>
        </div>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Analytics Snapshot</h2>
          <AnalyticsCharts transactions={transactions} />
        </section>
      </div>
    </AppShell>
  );
}

export default DashboardPage;
