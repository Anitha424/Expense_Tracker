import { useState } from 'react';
import { formatINR } from '../utils/currency';

function IncomeSummaryPanel({ summary, onSave, isSaving }) {
  const [targetAmount, setTargetAmount] = useState(() => summary?.target || '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(Number(targetAmount));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Monthly Income Target</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Set your income goal for this month.</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          min="0"
          step="0.01"
          value={targetAmount}
          onChange={(event) => setTargetAmount(event.target.value)}
          placeholder="Enter income target"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save Target'}
        </button>
      </form>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Target</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(summary?.target || 0)}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Actual</p>
          <p className="font-semibold text-emerald-600">{formatINR(summary?.actual || 0)}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Remaining to Goal</p>
          <p className={`font-semibold ${(summary?.remaining || 0) <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {formatINR(Math.abs(summary?.remaining || 0))}
          </p>
        </div>
      </div>

      {!summary?.underTarget && summary?.target > 0 && (
        <p className="mt-4 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          ✓ Income target reached! Keep up the good work.
        </p>
      )}

      {summary?.underTarget && (
        <p className="mt-4 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          You're {formatINR(summary?.remaining || 0)} away from your income target.
        </p>
      )}
    </section>
  );
}

export default IncomeSummaryPanel;
