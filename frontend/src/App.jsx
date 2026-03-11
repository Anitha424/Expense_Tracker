import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AddExpense from './pages/AddExpense';
import ErrorBoundary from './components/ErrorBoundary';
import ParticleBackground from './components/ParticleBackground';
import { useTheme } from './context/ThemeContext';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const App = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ErrorBoundary>
      <div className={`cartoon-ui relative isolate min-h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-slate-900'}`}>
        <ParticleBackground />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route 
                path="/" 
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <PageTransition>
                    <Analytics />
                  </PageTransition>
                } 
              />
              <Route
                path="/add-expense"
                element={
                  <PageTransition>
                    <AddExpense />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
