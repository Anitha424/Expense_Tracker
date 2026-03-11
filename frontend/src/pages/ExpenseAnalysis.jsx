import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

function ExpenseAnalysis() {
  const navigate = useNavigate();
  const [expenses] = useState([
    { id: 1, date: '2026-03-09', category: 'Food', amount: 45.50, description: 'Lunch' },
    { id: 2, date: '2026-03-08', category: 'Transport', amount: 12.00, description: 'Uber' },
    { id: 3, date: '2026-03-07', category: 'Entertainment', amount: 25.00, description: 'Movie tickets' },
    { id: 4, date: '2026-03-06', category: 'Utilities', amount: 80.00, description: 'Electricity bill' },
    { id: 5, date: '2026-03-05', category: 'Food', amount: 35.75, description: 'Dinner' },
  ]);

  // Monthly data for bar chart
  const monthlyData = [
    { month: 'Jan', expense: 650 },
    { month: 'Feb', expense: 720 },
    { month: 'Mar', expense: 580 },
    { month: 'Apr', expense: 690 },
    { month: 'May', expense: 740 },
    { month: 'Jun', expense: 620 },
  ];

  // Category data for pie chart
  const categoryData = [
    { name: 'Food', value: 320, color: '#3B82F6' },
    { name: 'Transport', value: 150, color: '#06B6D4' },
    { name: 'Entertainment', value: 200, color: '#8B5CF6' },
    { name: 'Utilities', value: 230, color: '#EC4899' },
    { name: 'Other', value: 100, color: '#F59E0B' },
  ];

  // Calculate totals
  const totalIncome = 5000;
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBalance = totalIncome - totalExpense;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
    >
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Expense Dashboard
            </span>
          </h1>
          <div className="w-20" />
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Income</p>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-3xl font-bold text-green-400"
                >
                  ${totalIncome.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-3 rounded-lg bg-green-500/20"
              >
                <TrendingUp className="w-8 h-8 text-green-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Total Expense Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Expense</p>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-3xl font-bold text-red-400"
                >
                  ${totalExpense.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="p-3 rounded-lg bg-red-500/20"
              >
                <TrendingDown className="w-8 h-8 text-red-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Remaining Balance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Remaining Balance</p>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-3xl font-bold text-blue-400"
                >
                  ${remainingBalance.toFixed(2)}
                </motion.p>
              </div>
              <motion.div 
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="p-3 rounded-lg bg-blue-500/20"
              >
                <DollarSign className="w-8 h-8 text-blue-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Monthly Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="expense" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4">Expense by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-slate-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expense Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Recent Expenses</h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              <Plus size={18} />
              Add Transaction
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <motion.tr 
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', scale: 1.01 }}
                    className="border-b border-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white">{expense.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-400">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{expense.description}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}

export default ExpenseAnalysis;
