import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const CalendarExpenseView = ({ transactions = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate daily expenses
  const dailyExpenses = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map.has(dateKey)) {
        map.set(dateKey, { date: new Date(t.date), transactions: [], total: 0 });
      }
      const dayData = map.get(dateKey);
      dayData.transactions.push(t);
      if (t.type === 'expense') {
        dayData.total += Number(t.amount);
      }
    });
    return map;
  }, [transactions]);

  // Get calendar days for current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const calendarDays = [];
  const currentDay = new Date(startDate);
  while (currentDay <= lastDay || calendarDays.length % 7 !== 0) {
    calendarDays.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const getDayExpenses = (day) => {
    const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
    return dailyExpenses.get(dateKey);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
    setSelectedDate(null);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateData = selectedDate ? getDayExpenses(selectedDate) : null;

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 p-6 backdrop-blur-md border border-indigo-700/50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Calendar Expenses</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-indigo-700 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-semibold min-w-[150px] text-center">{monthName}</span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-indigo-700 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-indigo-300 py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayExpenses = getDayExpenses(day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();
          const isSelected =
            selectedDate &&
            day.getDate() === selectedDate.getDate() &&
            day.getMonth() === selectedDate.getMonth() &&
            day.getFullYear() === selectedDate.getFullYear();

          return (
            <motion.button
              key={index}
              onClick={() => {
                if (isCurrentMonth) {
                  setSelectedDate(isSelected ? null : new Date(day));
                }
              }}
              className={`p-2 rounded-lg transition-all aspect-square flex flex-col items-center justify-center text-sm relative ${
                !isCurrentMonth
                  ? 'bg-slate-900/50 text-gray-500 cursor-default'
                  : isSelected
                  ? 'bg-indigo-600 text-white border border-indigo-400'
                  : isToday
                  ? 'bg-indigo-700/60 text-white border border-indigo-500'
                  : dayExpenses
                  ? 'bg-indigo-800/40 text-indigo-200 hover:bg-indigo-700/50'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
              whileHover={isCurrentMonth && !isSelected ? { scale: 1.05 } : {}}
              whileTap={isCurrentMonth ? { scale: 0.95 } : {}}
            >
              <span className="font-medium">{day.getDate()}</span>
              {dayExpenses && (
                <span className="text-xs mt-1 font-semibold text-orange-300">
                  ₹{dayExpenses.total.toFixed(0)}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected day transactions */}
      <AnimatePresence>
        {selectedDateData && (
          <motion.div
            className="mt-6 pt-6 border-t border-indigo-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">
                {selectedDateData.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h4>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 hover:bg-indigo-600 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedDateData.transactions.length > 0 ? (
                selectedDateData.transactions.map((t, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-3 rounded-lg flex justify-between ${
                      t.type === 'expense'
                        ? 'bg-red-900/40 border border-red-700/50'
                        : 'bg-green-900/40 border border-green-700/50'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div>
                      <p className="text-white font-medium">{t.title}</p>
                      <p className="text-xs text-gray-400">{t.category}</p>
                    </div>
                    <p
                      className={`font-bold ${
                        t.type === 'expense' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {t.type === 'expense' ? '-' : '+'}₹{Number(t.amount).toFixed(0)}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No transactions on this date</p>
              )}
            </div>

            {selectedDateData.total > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-indigo-900/40 border border-indigo-700/50 text-center">
                <p className="text-xs text-gray-300">Total Expenses</p>
                <p className="text-2xl font-bold text-indigo-300">₹{selectedDateData.total.toFixed(0)}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarExpenseView;
