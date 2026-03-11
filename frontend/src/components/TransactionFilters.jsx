function TransactionFilters({ filters, onChange, categories }) {
  const handleInput = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4 dark:border-slate-700 dark:bg-slate-900">
      <input
        value={filters.search}
        onChange={handleInput('search')}
        placeholder="Search title/category/date/amount"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-500 focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />
      <select
        value={filters.category}
        onChange={handleInput('category')}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={filters.type}
        onChange={handleInput('type')}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={filters.startDate}
          onChange={handleInput('startDate')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={handleInput('endDate')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
    </div>
  );
}

export default TransactionFilters;
