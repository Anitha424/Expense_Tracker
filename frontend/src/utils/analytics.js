export const calculateTotals = (transactions) => {
  return transactions.reduce(
    (acc, txn) => {
      if (txn.type === 'income') {
        acc.income += txn.amount;
      } else {
        acc.expense += txn.amount;
      }
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
};

export const buildMonthlyExpenses = (transactions) => {
  const monthly = new Map();

  transactions
    .filter((txn) => txn.type === 'expense')
    .forEach((txn) => {
      const key = new Date(txn.date).toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthly.set(key, (monthly.get(key) || 0) + txn.amount);
    });

  return {
    labels: Array.from(monthly.keys()),
    values: Array.from(monthly.values()),
  };
};

export const buildCategoryExpenses = (transactions) => {
  const categories = new Map();

  transactions
    .filter((txn) => txn.type === 'expense')
    .forEach((txn) => {
      categories.set(txn.category, (categories.get(txn.category) || 0) + txn.amount);
    });

  return {
    labels: Array.from(categories.keys()),
    values: Array.from(categories.values()),
  };
};

export const buildWeeklySpending = (transactions) => {
  const days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const labels = days.map((day) => day.toLocaleDateString('en-IN', { weekday: 'short' }));
  const values = days.map((day) => {
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return transactions
      .filter((txn) => txn.type === 'expense' && new Date(txn.date) >= day && new Date(txn.date) < dayEnd)
      .reduce((sum, txn) => sum + txn.amount, 0);
  });

  return { labels, values };
};
