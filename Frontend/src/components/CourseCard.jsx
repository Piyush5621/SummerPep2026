import { Link } from 'react-router-dom';

export default function CourseCard({ course, onEdit, onDelete, showActions = false }) {
  const { _id, title, price, instructor, createdAt } = course;

  return (
    <div className="glass p-6 flex flex-col gap-4 transition-all duration-300 ease-out transform group hover:-translate-y-2 hover:border-sky-500/40 hover:shadow-[0_22px_70px_rgba(59,130,246,0.18)] animate-fade-up">
      <div className="absolute inset-x-0 -top-px h-1 rounded-t-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-500 opacity-90" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-900/30 shrink-0">
          {title?.[0]?.toUpperCase()}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <span className="study-chip">Live lesson</span>
          <span className="study-chip">Practice</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white text-lg leading-snug group-hover:text-sky-300 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          {instructor}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <span>Study-ready path</span>
          <span className="text-emerald-400 font-medium">Focus mode</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
        {createdAt && (
          <span className="text-[11px] text-slate-500">
            {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}

        {showActions ? (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => onEdit(course)} className="btn-success py-1 px-3 text-xs">Edit</button>
            <button onClick={() => onDelete(_id)} className="btn-danger py-1 px-3 text-xs">Delete</button>
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-sky-300">₹{Number(price).toLocaleString('en-IN')}</span>
            <Link to={`/courses/${_id}`} className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
              Open
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
