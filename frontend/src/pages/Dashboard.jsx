import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseCards from "../components/ExpenseCards";
import ExpenseCharts from '../components/ExpenseCharts';
import TransactionTable from '../components/TransactionTable';
import BudgetPanel from '../components/BudgetPanel';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryManagement from '../components/CategoryManagement';
import CalendarExpenseView from '../components/CalendarExpenseView';
import RecurringTransactionsPanel from '../components/RecurringTransactionsPanel';
import SpendingInsights from '../components/SpendingInsights';
import ReportExportButtons from '../components/ReportExportButtons';
import { Github, Linkedin, Mail, Phone, DollarSign } from 'lucide-react';
import api from '../services/api';
import { formatINR } from '../utils/currency';
import { useLocalStorage, getStoredTransactions, saveTransactions, getStoredCategories, saveCategories, getDefaultCategories } from '../hooks/useLocalStorage';

const Dashboard = () => {
  console.log('🎯 Dashboard component rendering');

  // Initialize state with safe defaults
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [categories, setCategories] = useLocalStorage('categories', getDefaultCategories());
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage('recurringTransactions', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage('monthlyIncome', 0);
  const [monthlyBudget, setMonthlyBudget] = useLocalStorage('monthlyBudget', 0);
  const [incomeInput, setIncomeInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  console.log('📊 Dashboard state:', {
    transactionsCount: transactions?.length || 0,
    categoriesCount: categories?.length || 0,
    monthlyIncome,
    monthlyBudget,
    activeTab
  });

  const saveMonthlyIncome = () => {
    const value = parseFloat(incomeInput);
    if (!isNaN(value) && value >= 0) {
      setMonthlyIncome(value);
      setIncomeInput('');
    }
  };

  const saveMonthlyBudget = () => {
    const value = parseFloat(budgetInput);
    if (!isNaN(value) && value >= 0) {
      setMonthlyBudget(value);
      setBudgetInput('');
    }
  };

  // Sync transactions with localStorage
  const syncTransactions = (newTransactions) => {
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('📥 Loading transactions, token:', token ? 'exists' : 'none');
      
      // Load from API if authenticated
      if (token) {
        try {
          const response = await api.get('/transactions');
          const data = response.data || [];
          console.log('✅ Loaded from API:', data.length, 'transactions');
          syncTransactions(data);
        } catch (error) {
          console.error('⚠️ Failed to load from API, using localStorage:', error.message);
          // Fall back to localStorage
          const stored = getStoredTransactions();
          setTransactions(stored || []);
        }
      } else {
        // Load from localStorage if not authenticated
        console.log('📦 Loading from localStorage (no auth)');
        const stored = getStoredTransactions();
        setTransactions(stored || []);
      }
    } catch (error) {
      console.error('❌ Error in loadTransactions:', error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    console.log('🔄 Dashboard mounted, loading transactions');
    loadTransactions();
  }, []);

  const addTransaction = async (newTransaction) => {
    const token = localStorage.getItem('token');
    
    const transactionToAdd = {
      ...newTransaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    if (!token) {
      // Offline mode - save to localStorage
      const updated = [transactionToAdd, ...transactions];
      syncTransactions(updated);
      return { ok: true };
    }

    try {
      const response = await api.post('/transactions', newTransaction);
      const updated = [response.data, ...transactions];
      syncTransactions(updated);
      return { ok: true };
    } catch (error) {
      console.error('Failed to add transaction', error);
      // Still add to localStorage as fallback
      const updated = [transactionToAdd, ...transactions];
      syncTransactions(updated);
      return { ok: true };
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    const transactionId = updatedTransaction._id || updatedTransaction.id;
    const token = localStorage.getItem('token');

    if (!token) {
      const updated = transactions.map((transaction) => {
        const id = transaction._id || transaction.id;
        return id === transactionId ? { ...transaction, ...updatedTransaction } : transaction;
      });
      syncTransactions(updated);
      setEditingTransaction(null);
      setActiveTab('transactions');
      return { ok: true };
    }

    try {
      const response = await api.put(`/transactions/${transactionId}`, updatedTransaction);
      const updated = transactions.map((transaction) => {
        const id = transaction._id || transaction.id;
        return id === transactionId ? response.data : transaction;
      });
      syncTransactions(updated);
      setEditingTransaction(null);
      setActiveTab('transactions');
      return { ok: true };
    } catch (error) {
      console.error('Failed to update transaction', error);
      return {
        ok: false,
        message: error?.response?.data?.message || 'Failed to update transaction',
      };
    }
  };

  const deleteTransaction = async (id) => {
    console.log('🗑️ deleteTransaction called with ID:', id);
    console.log('📋 Current transactions count:', transactions.length);
    console.log('📋 Transaction IDs:', transactions.map(t => ({ id: t.id, _id: t._id })));
    
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    
    if (!token) {
      console.log('💾 Offline mode - filtering locally');
      const updated = transactions.filter((t) => {
        const txId = t.id || t._id;
        const match = txId !== id;
        console.log(`  Checking transaction ${txId} !== ${id}:`, match);
        return match;
      });
      console.log('✅ Filtered transactions count:', updated.length);
      syncTransactions(updated);
      return;
    }

    try {
      console.log('🌐 Online mode - calling API');
      await api.delete(`/transactions/${id}`);
      console.log('✅ API delete successful');
      const updated = transactions.filter((t) => (t.id || t._id) !== id);
      console.log('✅ Filtered transactions count:', updated.length);
      syncTransactions(updated);
    } catch (error) {
      console.error('❌ Failed to delete transaction', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add-expense');
  };

  const cancelEditTransaction = () => {
    setEditingTransaction(null);
  };

  const handleAddRecurringTransaction = (recurring) => {
    // When user adds or updates recurring transaction
    setRecurringTransactions([...recurringTransactions, recurring]);
  };

  // Calculate totals with safe defaults
  const totalIncome = Number(monthlyIncome || 0);
  
  const totalExpense = Array.isArray(transactions)
    ? transactions
        .filter(t => t && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
  
  const totalSavings = totalIncome - totalExpense;
  const totalBalance = totalSavings;

  const trendData = useMemo(
    () => [
      {
        name: 'Budget',
        budget: Number(monthlyBudget || 0),
        income: totalIncome,
        expense: totalExpense,
        savings: totalSavings,
      },
    ],
    [monthlyBudget, totalIncome, totalExpense, totalSavings]
  );

  const summaryCards = [
    {
      label: 'Total Income',
      value: formatINR(totalIncome),
      valueClass: 'text-emerald-400',
    },
    {
      label: 'Total Expense',
      value: formatINR(totalExpense),
      valueClass: 'text-red-400',
    },
    {
      label: 'Total Savings',
      value: formatINR(totalSavings),
      valueClass: totalSavings >= 0 ? 'text-amber-300' : 'text-red-400',
    },
  ];

  console.log('💰 Calculated totals:', { totalIncome, totalExpense, totalSavings, monthlyBudget });

  const categoryData = useMemo(() => {
    if (!Array.isArray(transactions)) {
      console.warn('⚠️ transactions is not an array for categoryData');
      return [
        { name: 'Food', value: 0 },
        { name: 'Transport', value: 0 },
        { name: 'Shopping', value: 0 },
      ];
    }

    const categoryTotals = new Map();

    transactions
      .filter((transaction) => transaction && transaction.type === 'expense')
      .forEach((transaction) => {
        const amount = Number(transaction.amount) || 0;
        const category = transaction.category || 'Uncategorized';
        categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
      });

    if (categoryTotals.size === 0) {
      return [
        { name: 'Food', value: 0 },
        { name: 'Transport', value: 0 },
        { name: 'Shopping', value: 0 },
      ];
    }

    return Array.from(categoryTotals.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      {console.log('🎨 Rendering Dashboard with activeTab:', activeTab)}
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 p-5 backdrop-blur-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h1 className="text-3xl font-semibold text-slate-100">Expense Tracker Dashboard</h1>
                  <p className="mt-2 text-slate-400">Track cash flow, monitor spending behavior, and act on trends.</p>
                </div>
                <img
                  src="/cash-stack.svg"
                  alt="Cash stack illustration"
                  className="h-20 w-full max-w-[220px] rounded-xl border border-slate-700 object-cover opacity-90"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              >
                <ExpenseCards balance={totalBalance} income={totalIncome} expense={totalExpense} />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                <BudgetPanel transactions={transactions} />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-full rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 backdrop-blur-lg transition duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-green-400">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-100">Set Monthly Income</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <input
                        type="number"
                        value={incomeInput}
                        onChange={(e) => setIncomeInput(e.target.value)}
                        placeholder="Enter your monthly income"
                        className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        min="0"
                        step="0.01"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveMonthlyIncome}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-400 hover:shadow-lg text-white font-semibold transition duration-300"
                      >
                        Save Income
                      </motion.button>
                    </div>
                    {monthlyIncome > 0 && (
                      <p className="mt-3 text-sm text-slate-400">
                        Current: <span className="font-semibold text-emerald-400">{formatINR(monthlyIncome)}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="mb-6"
              >
                <div className="h-full rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 backdrop-blur-lg transition duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-400">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100">Set Monthly Budget</h3>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="Enter your monthly budget"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      min="0"
                      step="0.01"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveMonthlyBudget}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-400 hover:shadow-lg text-white font-semibold transition duration-300"
                    >
                      Save Budget
                    </motion.button>
                  </div>
                  {monthlyBudget > 0 && (
                    <p className="mt-3 text-sm text-slate-400">
                      Current: <span className="font-semibold text-cyan-300">{formatINR(monthlyBudget)}</span>
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -4, 0] }}
                transition={{ duration: 0.7 }}
                className="mb-6"
              >
                <IncomeExpenseChart transactions={transactions} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <ExpenseCharts 
                  trendData={trendData}
                  categoryData={categoryData}
                />
              </motion.div>

              {/* Calendar & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
                <CalendarExpenseView transactions={transactions} />
                <SpendingInsights transactions={transactions} />
              </div>

              {/* Transaction Table */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="rounded-xl border border-slate-700 bg-slate-900/60 p-2 shadow-lg shadow-slate-950/40 backdrop-blur-lg"
              >
                <TransactionTable 
                  transactions={transactions} 
                  deleteTransaction={deleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'add-expense' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900/60 p-4 backdrop-blur-lg"
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </span>
              </h2>
              <ExpenseForm
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                editingTransaction={editingTransaction}
                onCancelEdit={cancelEditTransaction}
                categories={categories}
              />
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-semibold mb-8 text-slate-100">Analytics & Insights</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {summaryCards.map((card, index) => (
                  <motion.div
                    key={`analysis-${card.label}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg shadow-slate-950/40 transition duration-300"
                  >
                    <p className="text-sm tracking-wide uppercase text-slate-400">{card.label}</p>
                    <p className={`mt-3 text-3xl font-bold ${card.valueClass}`}>{card.value}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <IncomeExpenseChart transactions={transactions} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ExpenseCharts 
                    trendData={trendData}
                    categoryData={categoryData}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <SpendingInsights transactions={transactions} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ReportExportButtons transactions={transactions} categories={categories} />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 backdrop-blur-lg"
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  All Transactions
                </span>
              </h2>
              <TransactionTable 
                transactions={transactions} 
                deleteTransaction={deleteTransaction}
                onEditTransaction={handleEditTransaction}
              />
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Budget Management
                </span>
              </h2>
              <div className="space-y-6">
                <BudgetPanel transactions={transactions} />
                <RecurringTransactionsPanel 
                  recurringTransactions={recurringTransactions}
                  onDelete={(id) => setRecurringTransactions(recurringTransactions.filter(r => r.id !== id))}
                  onAddRecurring={handleAddRecurringTransaction}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Category Management
                </span>
              </h2>
              <CategoryManagement 
                onCategoriesUpdate={(updatedCategories) => {
                  setCategories(updatedCategories);
                  saveCategories(updatedCategories);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Calendar View
                </span>
              </h2>
              <CalendarExpenseView transactions={transactions} />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8">
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Export Reports
                </span>
              </h2>
              <div className="space-y-6">
                <ReportExportButtons transactions={transactions} categories={categories} />
                <CalendarExpenseView transactions={transactions} />
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex min-h-[calc(100vh-190px)] w-full items-center justify-center"
            >
              <div className="w-full max-w-3xl rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 text-center shadow-2xl shadow-cyan-950/30 backdrop-blur-xl md:p-14">
                <h2 className="mb-10 text-center text-4xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    Contact
                  </span>
                </h2>
                <h3 className="mb-3 text-5xl font-bold text-white">Anitha B</h3>
                <p className="mb-3 text-base text-cyan-400">B.E Electronics & Communication</p>
                <p className="mb-10 text-xl font-semibold text-slate-300">Full Stack Developer | MERN Developer</p>

                {/* Contact Links */}
                <div className="mb-10 flex flex-wrap justify-center gap-6">
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    href="tel:+919629885044"
                    className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    title="Phone"
                  >
                    <Phone size={28} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    href="mailto:baskaranitha2005@gmail.com"
                    className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    title="Email"
                  >
                    <Mail size={28} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://www.linkedin.com/in/anitha-b-70869a296"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    title="LinkedIn"
                  >
                    <Linkedin size={28} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    href="https://github.com/Anitha424"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    title="GitHub"
                  >
                    <Github size={28} />
                  </motion.a>
                </div>
                <p className="text-base text-slate-400">
                  📧 baskaranitha2005@gmail.com | 📞 +91 9629885044
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
