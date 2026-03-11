import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Sun, Moon, LogOut, UserCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  // Use ThemeContext instead of local state
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/55 px-3 py-1.5">
            <UserCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{displayName}</span>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className="relative p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center mb-3">
                        <Bell className="w-6 h-6 text-gray-400 dark:text-slate-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        No new notifications
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                        We'll notify you when something arrives
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-300/60 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors hover:bg-rose-100 dark:hover:bg-rose-500/20"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
