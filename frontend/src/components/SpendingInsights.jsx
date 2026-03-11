import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';
import { generateSpendingInsights } from '../services/reportService';

const SpendingInsights = ({ transactions = [] }) => {
  const insights = useMemo(() => {
    return generateSpendingInsights(transactions, []);
  }, [transactions]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'category':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'positive':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getInsightBg = (type, urgency) => {
    if (type === 'warning' || urgency === 'high') {
      return 'from-red-900/30 to-red-800/30 border-red-700/50';
    } else if (type === 'positive') {
      return 'from-green-900/30 to-green-800/30 border-green-700/50';
    } else if (type === 'category') {
      return 'from-orange-900/30 to-orange-800/30 border-orange-700/50';
    } else {
      return 'from-blue-900/30 to-blue-800/30 border-blue-700/50';
    }
  };

  const getInsightIconColor = (type, urgency) => {
    if (type === 'warning' || urgency === 'high') return 'text-red-400';
    if (type === 'positive') return 'text-green-400';
    if (type === 'category') return 'text-orange-400';
    return 'text-blue-400';
  };

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-amber-900/50 to-amber-800/50 p-6 backdrop-blur-md border border-amber-700/50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        Spending Insights
      </h3>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg bg-gradient-to-r ${getInsightBg(
                  insight.type,
                  insight.urgency
                )} border flex items-start gap-3`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`flex-shrink-0 mt-1 ${getInsightIconColor(
                    insight.type,
                    insight.urgency
                  )}`}
                >
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200 leading-relaxed">{insight.message}</p>
                </div>
                <motion.span
                  className="text-2xl flex-shrink-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {insight.icon}
                </motion.span>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="p-4 rounded-lg bg-blue-900/30 border border-blue-700/50 text-center text-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Start adding transactions to get personalized spending insights!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Tips */}
      {insights.length > 0 && (
        <motion.div
          className="mt-6 pt-6 border-t border-amber-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-semibold text-amber-200 mb-3">💡 Quick Tips</h4>
          <ul className="text-xs text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">→</span>
              <span>Review your spending by category to identify areas to cut back</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">→</span>
              <span>Set a reasonable budget and track it consistently</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">→</span>
              <span>Use recurring transactions for fixed expenses like subscriptions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">→</span>
              <span>Export monthly reports to analyze spending patterns over time</span>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpendingInsights;
