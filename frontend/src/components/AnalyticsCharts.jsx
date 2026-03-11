import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { buildCategoryExpenses, buildMonthlyExpenses, buildWeeklySpending, calculateTotals } from '../utils/analytics';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

function AnalyticsCharts({ transactions }) {
  const totals = calculateTotals(transactions);
  const monthly = buildMonthlyExpenses(transactions);
  const categories = buildCategoryExpenses(transactions);
  const weekly = buildWeeklySpending(transactions);
  const hasTransactions = transactions.length > 0;

  const palette = useMemo(
    () => ({
      cyan: '#06b6d4',
      blue: '#2563eb',
      emerald: '#10b981',
      amber: '#f59e0b',
      rose: '#fb7185',
      indigo: '#6366f1',
      violet: '#8b5cf6',
      sky: '#0ea5e9',
      teal: '#14b8a6',
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 10,
            padding: 18,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderColor: 'rgba(148, 163, 184, 0.35)',
          borderWidth: 1,
          padding: 12,
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          displayColors: true,
        },
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart',
      },
    }),
    []
  );

  const barOptions = useMemo(
    () => ({
      ...chartOptions,
      scales: {
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.14)' },
          ticks: { color: '#94a3b8' },
        },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.14)' },
          ticks: { color: '#94a3b8' },
        },
      },
      animations: {
        y: {
          delay: (ctx) => ctx.dataIndex * 90,
        },
      },
    }),
    [chartOptions]
  );

  const lineOptions = useMemo(
    () => ({
      ...chartOptions,
      scales: {
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: { color: '#94a3b8' },
        },
        y: {
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: { color: '#94a3b8' },
        },
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
        },
      },
    }),
    [chartOptions]
  );

  const incomeExpenseData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [totals.income, totals.expense],
        backgroundColor: [palette.emerald, palette.rose],
        borderColor: ['#34d399', '#fda4af'],
        borderWidth: 1,
        hoverOffset: 12,
      },
    ],
  };

  const monthlyExpenseData = {
    labels: monthly.labels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthly.values,
        borderRadius: 8,
        backgroundColor: [
          'rgba(6, 182, 212, 0.85)',
          'rgba(14, 165, 233, 0.85)',
          'rgba(37, 99, 235, 0.85)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(20, 184, 166, 0.85)',
        ],
      },
    ],
  };

  const weeklySpendingData = {
    labels: weekly.labels,
    datasets: [
      {
        label: 'Weekly Spend',
        data: weekly.values,
        borderColor: palette.rose,
        backgroundColor: 'rgba(251, 113, 133, 0.18)',
        fill: true,
        pointBackgroundColor: '#fda4af',
        pointBorderColor: '#fff1f2',
        borderWidth: 3,
        tension: 0.38,
      },
    ],
  };

  const comparisonData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [totals.income, totals.expense],
        backgroundColor: [palette.emerald, palette.amber],
        borderRadius: 12,
        barThickness: 46,
      },
    ],
  };

  const categoryData = {
    labels: categories.labels,
    datasets: [
      {
        label: 'Category Expense',
        data: categories.values,
        backgroundColor: [palette.rose, palette.emerald, palette.blue, palette.amber, palette.violet, palette.teal, palette.indigo, palette.sky],
        hoverOffset: 10,
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  const ChartCard = ({ title, children, fullWidth = false }) => (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-lg shadow-slate-900/5 transition-all dark:border-slate-700/80 dark:bg-slate-900/80 ${fullWidth ? 'lg:col-span-2' : ''}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 opacity-80" />
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="h-72">{children}</div>
    </motion.div>
  );

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 lg:grid-cols-2"
    >
      <ChartCard title="Income vs Expense">
        {hasTransactions ? <Doughnut data={incomeExpenseData} options={chartOptions} /> : <p className="text-slate-500 dark:text-slate-400">No data yet.</p>}
      </ChartCard>

      <ChartCard title="Category-wise Expense">
        {categories.labels.length ? <Pie data={categoryData} options={chartOptions} /> : <p className="text-slate-500 dark:text-slate-400">No expense data yet.</p>}
      </ChartCard>

      <ChartCard title="Income vs Expense Comparison">
        {hasTransactions ? <Bar data={comparisonData} options={barOptions} /> : <p className="text-slate-500 dark:text-slate-400">No comparison data yet.</p>}
      </ChartCard>

      <ChartCard title="Weekly Spending">
        {hasTransactions ? <Line data={weeklySpendingData} options={lineOptions} /> : <p className="text-slate-500 dark:text-slate-400">No weekly data yet.</p>}
      </ChartCard>

      <ChartCard title="Monthly Expense Trend" fullWidth>
        {monthly.labels.length ? <Bar data={monthlyExpenseData} options={barOptions} /> : <p className="text-slate-500 dark:text-slate-400">No monthly expense data yet.</p>}
      </ChartCard>
    </motion.section>
  );
}

export default AnalyticsCharts;
