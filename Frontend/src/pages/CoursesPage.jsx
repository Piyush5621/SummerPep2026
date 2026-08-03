import { useEffect, useState } from 'react';
import { getCourses } from '../api/axios';
import CourseCard from '../components/CourseCard';
import Toast from '../components/Toast';

function SkeletonCard() {
  return (
    <div className="glass p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-5 rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="skeleton w-3/4 h-5 rounded" />
        <div className="skeleton w-1/2 h-4 rounded" />
      </div>
      <div className="skeleton w-full h-px rounded mt-auto" />
      <div className="flex justify-between">
        <div className="skeleton w-20 h-3 rounded" />
        <div className="skeleton w-16 h-3 rounded" />
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourses();
        setCourses(data);
      } catch {
        setToast({ message: 'Failed to load courses. Is the backend running?', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="study-shell glass p-6 sm:p-8 mb-8 animate-fade-up">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="study-pill mb-4">Discover your next lesson</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
              Build a calm, focused <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">study routine</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Browse practical learning paths designed to help you study steadily and stay motivated.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 min-w-[280px]">
            {[
              ['Fresh', 'Courses'],
              ['Guided', 'Learning'],
              ['Easy', 'Search']
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-center">
                <p className="text-lg font-semibold text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 max-w-2xl mx-auto animate-fade-in">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            id="course-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or instructor…"
            className="input pl-10"
          />
        </div>
      </div>

      {!loading && (
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-400 animate-fade-in">
          <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{filtered.length} course{filtered.length !== 1 ? 's' : ''} {search ? 'found' : 'ready to explore'}</span>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-up">
          <p className="text-6xl mb-4">🔎</p>
          <p className="text-xl font-semibold text-white mb-2">{search ? 'No results' : 'No courses yet'}</p>
          <p className="text-slate-400">{search ? `No courses match "${search}"` : 'Check back later or ask an instructor to add some.'}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => (
            <div key={course._id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
