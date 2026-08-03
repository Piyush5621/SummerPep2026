import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      return setToast({ message: 'Password must be at least 8 characters', type: 'error' });
    }
    setLoading(true);
    try {
      const user = await registerUser(form.name, form.email, form.password, form.role);
      setToast({ message: `Account created! Welcome, ${user.name}!`, type: 'success' });
      setTimeout(() => navigate(user.role === 'instructor' ? '/dashboard' : '/courses'), 700);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Registration failed.';
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-2xl shadow-emerald-900/40 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1">Join StudyStack and start learning</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-5" id="register-form">
            <div>
              <label htmlFor="reg-name" className="input-label">Full Name</label>
              <input id="reg-name" name="name" type="text" required
                value={form.name} onChange={onChange} className="input" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="reg-email" className="input-label">Email address</label>
              <input id="reg-email" name="email" type="email" required
                value={form.email} onChange={onChange} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="reg-password" className="input-label">Password <span className="text-xs text-slate-500">(min 8 chars)</span></label>
              <input id="reg-password" name="password" type="password" required
                value={form.password} onChange={onChange} className="input" placeholder="••••••••" />
            </div>
            <div>
              <label htmlFor="reg-role" className="input-label">I am a…</label>
              <div className="grid grid-cols-2 gap-3" id="reg-role">
                {['student', 'instructor'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    id={`role-${r}`}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all duration-200 ${
                      form.role === r
                        ? 'border-purple-500 bg-purple-600/20 text-purple-300 shadow-lg shadow-purple-900/30'
                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {r === 'student' ? '🎓 ' : '📚 '}{r}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" id="register-submit" className="btn-primary w-full mt-1" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow" />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
