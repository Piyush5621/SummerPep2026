import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/courses';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
      setTimeout(() => navigate(user.role === 'instructor' ? '/dashboard' : from), 600);
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-2xl shadow-purple-900/50 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to your StudyStack account</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-5" id="login-form">
            <div>
              <label htmlFor="login-email" className="input-label">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="input-label">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={onChange}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" id="login-submit" className="btn-primary w-full mt-1" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
