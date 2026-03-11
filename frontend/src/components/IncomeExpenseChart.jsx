import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const IncomeExpenseChart = ({ transactions = [] }) => {
  // Compute monthly income vs expense data
  const chartData = useMemo(() => {
    const groupedByMonth = new Map();

    const toMonthIndex = (date) => date.getFullYear() * 12 + date.getMonth();
    const fromMonthIndex = (monthIndex) => {
      const year = Math.floor(monthIndex / 12);
      const month = monthIndex % 12;
      return new Date(year, month, 1);
    };

    transactions.forEach((transaction) => {
      const parsedDate = new Date(transaction?.date);
      if (Number.isNaN(parsedDate.getTime())) return;

      const monthKey = toMonthIndex(parsedDate);

      if (!groupedByMonth.has(monthKey)) {
        groupedByMonth.set(monthKey, {
          income: 0,
          expense: 0,
        });
      }

      const amount = Number(transaction?.amount) || 0;
      const monthData = groupedByMonth.get(monthKey);

      if (transaction?.type === 'income') {
        monthData.income += amount;
      } else if (transaction?.type === 'expense') {
        monthData.expense += amount;
      }
    });

    const nowMonthIndex = toMonthIndex(new Date());
    const feedMonthIndexes = Array.from(groupedByMonth.keys()).sort((a, b) => a - b);
    const hasFeedData = feedMonthIndexes.length > 0;

    const firstFeedMonth = hasFeedData ? feedMonthIndexes[0] : nowMonthIndex;
    const lastFeedMonth = hasFeedData ? feedMonthIndexes[feedMonthIndexes.length - 1] : nowMonthIndex;

    const endMonth = Math.max(nowMonthIndex, lastFeedMonth);
    const minStartForSixMonths = endMonth - 5;
    const startMonth = Math.min(firstFeedMonth, minStartForSixMonths);

    const timeline = [];
    for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex += 1) {
      const date = fromMonthIndex(monthIndex);
      const monthLabel = date.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      const monthData = groupedByMonth.get(monthIndex) || { income: 0, expense: 0 };

      timeline.push({
        month: monthLabel,
        income: monthData.income,
        expense: monthData.expense,
        savings: monthData.income - monthData.expense,
      });
    }

    return timeline;
  }, [transactions]);

  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0);
  const totalSavings = totalIncome - totalExpense;

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-emerald-950/60 to-green-950/50 p-6 backdrop-blur-md border border-emerald-900/60 shadow-lg shadow-emerald-950/40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Income vs Expense Trend</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="p-4 rounded-lg bg-green-900/40 border border-green-700/50"
          variants={itemVariants}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs text-gray-300 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-400">₹{totalIncome.toFixed(0)}</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-red-900/40 border border-red-700/50"
          variants={itemVariants}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs text-gray-300 mb-1">Total Expense</p>
          <p className="text-2xl font-bold text-red-400">₹{totalExpense.toFixed(0)}</p>
        </motion.div>

        <motion.div
          className={`p-4 rounded-lg border border-emerald-700/50 ${
            totalSavings >= 0
              ? 'bg-emerald-900/40'
              : 'bg-orange-900/40 border-orange-700/50'
          }`}
          variants={itemVariants}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <p className="text-xs text-gray-300 mb-1">Total Savings</p>
          <p
            className={`text-2xl font-bold ${
              totalSavings >= 0 ? 'text-emerald-400' : 'text-orange-400'
            }`}
          >
            ₹{totalSavings.toFixed(0)}
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="h-80 rounded-lg bg-slate-950/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              fill="url(#incomeGradient)"
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              animationEasing="ease-out"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              fill="url(#expenseGradient)"
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              animationEasing="ease-out"
              name="Expense"
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#34d399"
              fill="url(#savingsGradient)"
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
              animationEasing="ease-out"
              name="Savings"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-sm text-gray-300">
          {totalSavings > 0
            ? `Great! You saved ₹${totalSavings.toFixed(0)} in total. Keep up the good work!`
            : totalSavings === 0
            ? "You're breaking even. Good balance between income and expenses!"
            : `You're spending more than earning by ₹${Math.abs(totalSavings).toFixed(0)}.`}
        </p>
      </div>
    </motion.div>
  );
};

export default IncomeExpenseChart;
