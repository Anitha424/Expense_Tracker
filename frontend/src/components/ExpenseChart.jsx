import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function ExpenseChart({ transactions }) {
  // Monthly data
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.expense += t.amount;
      } else {
        acc.push({ month, expense: t.amount });
      }
      return acc;
    }, []);

  // Category data
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const colors = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-300">Monthly Expenses</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="expense" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-400 text-center py-12">No expense data available</p>
        )}
      </div>

      {/* Pie Chart */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-emerald-300">Expenses by Category</h3>
        {categoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className="text-sm text-slate-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-center py-12">No category data available</p>
        )}
      </div>
    </div>
  );
}

export default ExpenseChart;
