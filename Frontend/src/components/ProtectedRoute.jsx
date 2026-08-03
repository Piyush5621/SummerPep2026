import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireInstructor = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin-slow" />
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireInstructor && user.role !== 'instructor') {
    return (
      <div className="min-h-screen flex items-center justify-center page-container">
        <div className="glass p-10 text-center max-w-md animate-fade-up">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Instructor Only</h2>
          <p className="text-slate-400">This area is restricted to instructors. Your current role is <strong className="text-purple-400">{user.role}</strong>.</p>
        </div>
      </div>
    );
  }

  return children;
}
