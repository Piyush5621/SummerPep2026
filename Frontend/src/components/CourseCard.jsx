import { Link } from 'react-router-dom';

export default function CourseCard({ course, onEdit, onDelete, showActions = false }) {
  const { _id, title, price, instructor, createdAt } = course;

  return (
    <div className="glass p-6 flex flex-col gap-4 hover:border-purple-600/40 transition-all duration-300 group"
      style={{ transform: 'translateY(0)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)';  e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/40 shrink-0">
          {title?.[0]?.toUpperCase()}
        </div>
        <span className="text-xl font-bold text-emerald-400">
          ₹{Number(price).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-white text-lg leading-snug group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          {instructor}
        </p>
      </div>

      {/* Footer */}
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
          <Link to={`/courses/${_id}`}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 ml-auto">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
