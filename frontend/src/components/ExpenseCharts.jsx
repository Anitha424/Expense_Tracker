import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const ExpenseCharts = ({ trendData = [], categoryData = [] }) => {
  const COLORS = ['#22c55e', '#ef4444', '#fbbf24', '#06b6d4', '#3b82f6', '#a855f7', '#f97316'];
  const [activeSlice, setActiveSlice] = useState(-1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: { duration: 0.55 },
          y: { duration: 0.8, ease: 'easeOut' },
        }}
        whileHover={{ scale: 1.03 }}
        className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 backdrop-blur-lg transition duration-300"
      >
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Income vs Expense Trend</h3>
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  color: '#e2e8f0',
                }}
                wrapperStyle={{ transition: 'opacity 180ms ease, transform 180ms ease' }}
                cursor={{ stroke: 'rgba(52, 211, 153, 0.35)', strokeWidth: 1 }}
                animationDuration={250}
              />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ color: '#cbd5e1' }} />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="none"
                fill="url(#savingsAreaFill)"
                animationDuration={2200}
                animationEasing="ease-out"
                animationBegin={400}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5, fill: '#22c55e', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#22c55e', stroke: '#dcfce7', strokeWidth: 2 }}
                animationDuration={2200}
                animationEasing="ease-out"
                animationBegin={550}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5, fill: '#ef4444', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#ef4444', stroke: '#fee2e2', strokeWidth: 2 }}
                animationDuration={2200}
                animationEasing="ease-out"
                animationBegin={700}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 5, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#fbbf24', stroke: '#fef3c7', strokeWidth: 2 }}
                animationDuration={2200}
                animationEasing="ease-out"
                animationBegin={900}
                isAnimationActive={true}
              />
              <defs>
                <linearGradient id="savingsAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.36} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.02} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: { duration: 0.55, delay: 0.15 },
          y: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
        }}
        whileHover={{ scale: 1.03 }}
        className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 backdrop-blur-lg transition duration-300"
      >
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Expense by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              animationDuration={1700}
              animationEasing="ease-out"
              animationBegin={300}
              onMouseEnter={(_, index) => setActiveSlice(index)}
              onMouseLeave={() => setActiveSlice(-1)}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#0f172a"
                  strokeWidth={activeSlice === index ? 3 : 1}
                  fillOpacity={activeSlice === -1 || activeSlice === index ? 1 : 0.7}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
              wrapperStyle={{ transition: 'opacity 180ms ease, transform 180ms ease' }}
              animationDuration={250}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className="lg:col-span-2 rounded-xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 backdrop-blur-lg transition duration-300"
      >
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Monthly Comparison</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} animationDuration={1300} animationBegin={120} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} animationDuration={1400} animationBegin={240} />
            <Bar dataKey="savings" fill="#06b6d4" radius={[8, 8, 0, 0]} animationDuration={1500} animationBegin={360} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ExpenseCharts;
