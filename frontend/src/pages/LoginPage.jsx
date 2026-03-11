import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_10%_-5%,rgba(14,165,233,0.35),transparent_35%),radial-gradient(circle_at_100%_5%,rgba(99,102,241,0.3),transparent_40%),linear-gradient(180deg,#020617,#0f172a)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-300">Log in to your AI finance workspace.</p>
        {error && <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="mt-5 space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-4 py-3 text-slate-100 outline-none ring-cyan-500 focus:ring"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-4 py-3 text-slate-100 outline-none ring-cyan-500 focus:ring"
          />
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-slate-300">
          New here?{' '}
          <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
