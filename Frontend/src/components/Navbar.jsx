import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isInstructor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? 'bg-sky-500/15 text-sky-300'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-900/30"
      style={{ background: 'rgba(6,17,31,0.9)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-900/40 group-hover:shadow-sky-700/40 transition-shadow">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="font-bold text-white text-lg tracking-tight block">Study<span className="text-sky-400">Stack</span></span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Learning hub</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/courses">Courses</NavLink>
          {isInstructor && <NavLink to="/dashboard">Dashboard</NavLink>}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-900/40">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[10px] text-sky-400 capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 px-3">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-secondary text-xs py-1.5 px-3">Login</button></Link>
              <Link to="/register"><button className="btn-primary text-xs py-1.5 px-4">Register</button></Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-sky-900/30 px-4 py-3 flex flex-col gap-2 animate-fade-in">
          <NavLink to="/courses">Courses</NavLink>
          {isInstructor && <NavLink to="/dashboard">Dashboard</NavLink>}
          <div className="border-t border-sky-900/30 pt-2 mt-1 flex flex-col gap-2">
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-xs w-full">Logout ({user.name})</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}><button className="btn-secondary text-xs w-full">Login</button></Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}><button className="btn-primary text-xs w-full">Register</button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
