import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowDownRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import { useLocalStorage, getDefaultCategories } from '../hooks/useLocalStorage';

const AddExpense = () => {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [categories] = useLocalStorage('categories', getDefaultCategories());
  const [lastType, setLastType] = useState(null);

  const latest = useMemo(() => transactions?.[0] || null, [transactions]);

  const handleAddTransaction = async (payload) => {
    const newTransaction = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...(transactions || [])]);
    setLastType(payload.type);
    return { ok: true };
  };

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <Sidebar activeTab="add-expense" setActiveTab={() => {}} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 backdrop-blur-lg"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-100">Add Transaction</h1>
              <p className="text-slate-400">Track income and expenses with animated feedback.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ExpenseForm onAddTransaction={handleAddTransaction} categories={categories} />
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 backdrop-blur-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-100">Latest Activity</h3>
                {latest ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300">{latest.title}</p>
                    <p className={`text-sm font-semibold ${latest.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {latest.type.toUpperCase()} - INR {Number(latest.amount || 0).toLocaleString('en-IN')}
                    </p>
                    <motion.div
                      key={lastType || latest.type}
                      initial={{ opacity: 0, scale: 0.7, y: 8 }}
                      animate={{ opacity: 1, scale: [1, 1.1, 1], y: [0, -4, 0] }}
                      transition={{ duration: 0.9 }}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        latest.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {latest.type === 'income' ? <Coins size={14} /> : <ArrowDownRight size={14} />}
                      {latest.type === 'income' ? 'Green coin animation' : 'Red arrow animation'}
                    </motion.div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No transactions yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AddExpense;
