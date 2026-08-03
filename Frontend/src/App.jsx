import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import InstructorDashboard from './pages/InstructorDashboard';

function HeroRedirect() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-up">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-700 shadow-2xl shadow-purple-900/50 mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">StudyStack</span>
      </h1>
      <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-10">
        The modern platform for learners and instructors. Explore courses, manage content, and grow your skills.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <a href="/courses" className="btn-primary text-base px-8 py-3">Browse Courses</a>
        <a href="/register" className="btn-secondary text-base px-8 py-3">Get Started Free</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"          element={<HeroRedirect />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/courses"   element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requireInstructor>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-900/20 py-6 mt-8">
          <p className="text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} StudyStack — Built with React + Node.js
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}
