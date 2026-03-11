import { formatINR } from '../utils/currency';

function TransactionList({ transactions, onDelete, onEdit, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Loading transactions...
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No transactions yet. Add your first transaction to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{txn.title}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{txn.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      txn.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatINR(txn.amount)}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(txn)}
                      className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(txn._id)}
                      className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
