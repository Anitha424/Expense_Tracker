import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatINR } from '../utils/currency';

const renderCardIcon = (type) => {
  if (type === 'income') {
    return <TrendingUp className="w-6 h-6 text-white" />;
  }
  if (type === 'expense') {
    return <TrendingDown className="w-6 h-6 text-white" />;
  }
  return <Wallet className="w-6 h-6 text-white" />;
};

const renderBadgeImage = (type) => {
  if (type === 'income') {
    return '/money-coin.svg';
  }
  if (type === 'expense') {
    return '/flying-cash-cartoon.svg';
  }
  return '/money-bag-cartoon.svg';
};

export default function ExpenseCards({ balance = 0, income = 0, expense = 0 }) {
  const savings = balance;
  const cards = [
    {
      id: 1,
      type: 'income',
      title: 'Total Income',
      value: income,
      color: 'from-emerald-600 to-green-400',
      bgGlow: 'bg-emerald-500/25',
      textColor: 'text-emerald-100',
    },
    {
      id: 2,
      type: 'expense',
      title: 'Total Expense',
      value: expense,
      color: 'from-red-600 to-pink-500',
      bgGlow: 'bg-red-500/25',
      textColor: 'text-red-100',
    },
    {
      id: 3,
      type: 'savings',
      title: 'Total Savings',
      value: savings,
      color: 'from-yellow-500 to-amber-400',
      bgGlow: 'bg-amber-300/25',
      textColor: 'text-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative"
          >
            <div className={`relative rounded-xl border border-white/10 bg-gradient-to-r ${card.color} p-6 overflow-hidden group transition duration-300 hover:shadow-lg`}>
              <div className={`absolute inset-0 ${card.bgGlow} opacity-50 blur-2xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/30 backdrop-blur-md">
                    {renderCardIcon(card.type)}
                  </div>
                  <div className="h-14 w-14">
                    <img src={renderBadgeImage(card.type)} alt="" className="h-14 w-14 object-contain" />
                  </div>
                </div>
                
                <h3 className="text-sm font-medium mb-1 text-white/80">
                  {card.title}
                </h3>
                
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18 + index * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
                  className={`text-3xl font-bold ${card.textColor}`}
                >
                  {formatINR(card.value)}
                </motion.p>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
