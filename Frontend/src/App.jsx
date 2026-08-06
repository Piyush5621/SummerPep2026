import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import InstructorDashboard from './pages/InstructorDashboard';
import GenAIAssistantPage from './pages/GenAIAssistantPage';

function HeroRedirect() {
  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-16 animate-fade-up">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div className="text-left">
          <span className="study-pill mb-5">Study-focused learning</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Learn with calm focus and <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">clear direction</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-8">
            StudyStack brings together guided lessons, practical practice, and a smooth learning flow for students who want to grow every day.
          </p>
          <div className="flex gap-4 flex-wrap justify-start">
            <Link to="/courses" className="btn-primary text-base px-8 py-3">Explore Courses</Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-3">Join as Learner</Link>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              ['24/7', 'Access'],
              ['100+', 'Lessons'],
              ['1:1', 'Support']
            ].map(([value, label]) => (
              <div key={label} className="glass p-3 rounded-2xl">
                <p className="text-xl font-semibold text-white">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="study-shell glass p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-slate-400">Today’s focus</p>
              <h2 className="text-xl font-semibold text-white">Practice with purpose</h2>
            </div>
            <span className="study-pill">Live learning</span>
          </div>

          <div className="rounded-2xl border border-sky-400/20 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Study path</span>
              <span className="text-sm text-emerald-400">On track</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
            </div>
            <p className="text-sm text-slate-400 mt-3">Complete your next module and keep your momentum going.</p>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            {['Weekly lessons curated for you', 'Short practice tasks after every topic', 'Clear progress reminders to stay consistent'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-10 w-72 h-72 rounded-full bg-sky-500/12 blur-3xl animate-float" />
          <div className="absolute right-0 bottom-24 w-64 h-64 rounded-full bg-indigo-500/12 blur-3xl animate-float" />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-52 h-52 rounded-full bg-fuchsia-500/10 blur-3xl animate-ripple" />
        </div>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HeroRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/genai" element={<GenAIAssistantPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requireInstructor>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-sky-900/20 py-6 mt-8">
          <p className="text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} StudyStack — Learn steadily, grow confidently
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
