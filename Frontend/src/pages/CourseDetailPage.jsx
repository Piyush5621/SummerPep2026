import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../api/axios';
import Toast from '../components/Toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setToast({ message: 'Course not found.', type: 'error' });
          setTimeout(() => navigate('/courses'), 1500);
        } else {
          setToast({ message: 'Failed to load course.', type: 'error' });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <div className="glass p-8 flex flex-col gap-6">
          <div className="skeleton w-3/4 h-8 rounded" />
          <div className="skeleton w-1/2 h-5 rounded" />
          <div className="skeleton w-1/4 h-6 rounded" />
          <div className="skeleton w-full h-32 rounded" />
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="page-container max-w-2xl mx-auto">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Back link */}
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Courses
      </Link>

      <div className="glass p-8 animate-fade-up">
        {/* Icon + badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-purple-900/50">
            {course.title?.[0]?.toUpperCase()}
          </div>
          <div>
            <span className="badge badge-purple text-xs mb-2">Course</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{course.title}</h1>
          </div>
        </div>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl bg-white/5 border border-white/8 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Instructor</p>
            <p className="text-white font-semibold flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                {course.instructor?.[0]?.toUpperCase()}
              </span>
              {course.instructor}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/8 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Price</p>
            <p className="text-2xl font-extrabold text-emerald-400">
              ₹{Number(course.price).toLocaleString('en-IN')}
            </p>
          </div>
          {course.createdAt && (
            <div className="rounded-xl bg-white/5 border border-white/8 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Added On</p>
              <p className="text-white font-medium">
                {new Date(course.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
          {course.updatedAt && course.updatedAt !== course.createdAt && (
            <div className="rounded-xl bg-white/5 border border-white/8 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Last Updated</p>
              <p className="text-white font-medium">
                {new Date(course.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* Course ID */}
        <div className="rounded-xl bg-white/3 border border-white/5 p-4 mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Course ID</p>
          <p className="text-slate-400 font-mono text-sm break-all">{course._id}</p>
        </div>

        <button className="btn-primary w-full text-base py-3" onClick={() => setToast({ message: 'Enrollment coming soon!', type: 'info' })}>
          🎓 Enroll Now
        </button>
      </div>
    </div>
  );
}
