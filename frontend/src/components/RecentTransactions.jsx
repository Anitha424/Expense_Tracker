import { formatINR } from '../utils/currency';

function RecentTransactions({ transactions }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Latest 5</span>
      </div>

      {!transactions.length ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No recent transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((txn) => (
            <li
              key={txn._id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{txn.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {txn.category} • {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <p className={`text-sm font-semibold ${txn.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                {txn.type === 'income' ? '+' : '-'}{formatINR(txn.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentTransactions;
