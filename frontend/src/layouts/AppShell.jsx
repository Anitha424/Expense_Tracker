import { useMemo, useState } from 'react';
import { BarChart3, Brain, LayoutDashboard, ListChecks, LogOut, Menu, Moon, Settings, Sun } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ListChecks },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/ai-insights', label: 'AI Insights', icon: Brain },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function AppShell({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const themeLabel = useMemo(() => (theme === 'dark' ? 'Light' : 'Dark'), [theme]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_-20%,rgba(14,165,233,0.25),transparent_45%),radial-gradient(circle_at_95%_0%,rgba(16,185,129,0.2),transparent_40%),linear-gradient(180deg,#020617,#0b1228)] text-slate-100">
      <div className="mx-auto flex max-w-[1400px] gap-4 px-3 py-3 md:px-5 md:py-5">
        <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 z-50 h-full w-72 border-r border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl transition-transform md:static md:h-auto md:w-64 md:translate-x-0 md:rounded-2xl`}>
          <div className="mb-6 flex items-center justify-between md:block">
            <Link to="/dashboard" className="text-lg font-bold tracking-tight text-cyan-300">
              ExpenseFlow AI
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-lg border border-white/10 p-2 md:hidden">
              <Menu size={16} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(true)} className="rounded-lg border border-white/10 p-2 md:hidden">
                  <Menu size={16} />
                </button>
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold"
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  {themeLabel} Mode
                </button>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">{user?.name || 'User'}</span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="space-y-4">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
