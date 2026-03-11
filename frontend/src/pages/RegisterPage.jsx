import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setAuthSession(response.data.token, response.data.user);
      setSuccess(response.data.message || 'Registration successful');
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Unable to reach server. Please check backend is running on port 5000.');
      } else {
        setError('Unexpected error during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_-10%,rgba(14,165,233,0.35),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.3),transparent_40%),linear-gradient(180deg,#020617,#0f172a)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Create Account</h1>
        <p className="mt-2 text-sm text-slate-300">Join your AI-powered financial command center.</p>
        {error && <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>}
        {success && <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{success}</p>}
        <div className="mt-5 space-y-3">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-4 py-3 text-slate-100 outline-none ring-cyan-500 focus:ring"
          />
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
            minLength={6}
            className="w-full rounded-xl border border-white/20 bg-slate-900/40 px-4 py-3 text-slate-100 outline-none ring-cyan-500 focus:ring"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;
