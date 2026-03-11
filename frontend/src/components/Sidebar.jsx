import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, BarChart3, List, User, LogOut, Wallet, Tag, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-expense', label: 'Add Expense', icon: Plus },
    { id: 'analysis', label: 'Analytics', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'contact', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-slate-100/85 dark:bg-slate-900/75 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col h-screen sticky top-0 shadow-sm overflow-y-auto"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            ExpenseTracker
          </span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your finances</p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 text-cyan-200 shadow-lg shadow-slate-900/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-400/50 transition-all duration-200"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
