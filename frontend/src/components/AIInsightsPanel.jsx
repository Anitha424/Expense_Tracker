import { useMemo } from 'react';

function AIInsightsPanel({ transactions, totals }) {
  const insights = useMemo(() => {
    const expenses = transactions.filter((item) => item.type === 'expense');
    const monthKey = new Date().toISOString().slice(0, 7);

    const thisMonthExpenses = expenses.filter((item) => {
      const itemMonth = new Date(item.date).toISOString().slice(0, 7);
      return itemMonth === monthKey;
    });

    const byCategory = thisMonthExpenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const categoryPercent =
      topCategory && totals.income > 0 ? Math.round((topCategory[1] / totals.income) * 100) : 0;

    const results = [];

    if (topCategory) {
      results.push(`You spent ${categoryPercent}% of your income on ${topCategory[0]} this month.`);
    }

    if (totals.expense > totals.income) {
      results.push('Your expenses are higher than income. Consider reducing discretionary spending this week.');
    } else {
      results.push('Great job. Your income is higher than expenses this month.');
    }

    const avgDailySpend = thisMonthExpenses.length
      ? Math.round(thisMonthExpenses.reduce((sum, t) => sum + Number(t.amount), 0) / thisMonthExpenses.length)
      : 0;

    results.push(`Average expense transaction this month is Rs. ${avgDailySpend}.`);

    return results;
  }, [transactions, totals.expense, totals.income]);

  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-cyan-200">AI Financial Insights</h3>
      <p className="mt-1 text-sm text-slate-200">Actionable suggestions generated from your latest spending patterns.</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-100">
        {insights.map((item) => (
          <li key={item} className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AIInsightsPanel;
