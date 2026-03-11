import { formatINR } from '../utils/currency';

function SummaryCards({ totals }) {
  const cards = [
    {
      label: 'Total Balance',
      value: totals.balance,
      className: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Total Income',
      value: totals.income,
      className: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Total Expense',
      value: totals.expense,
      className: 'from-orange-500 to-rose-600',
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-2xl bg-gradient-to-r ${card.className} p-5 text-white shadow-lg`}>
          <p className="text-sm opacity-90">{card.label}</p>
          <p className="mt-2 text-2xl font-bold">{formatINR(card.value)}</p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
