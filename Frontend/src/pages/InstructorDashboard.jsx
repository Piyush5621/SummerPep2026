import { useEffect, useState, useCallback } from 'react';
import {
  getCourses, createCourse, updateCourse, deleteCourse,
  getUsers, deleteUser
} from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

/* ─── Course Form ─── */
function CourseForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ title: '', price: '', instructor: '', ...initial });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => { e.preventDefault(); onSave(form); };
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" id="course-form">
      <div>
        <label htmlFor="cf-title" className="input-label">Course Title</label>
        <input id="cf-title" name="title" required value={form.title} onChange={onChange} className="input" placeholder="e.g. React for Beginners" />
      </div>
      <div>
        <label htmlFor="cf-instructor" className="input-label">Instructor Name</label>
        <input id="cf-instructor" name="instructor" required value={form.instructor} onChange={onChange} className="input" placeholder="e.g. Jane Doe" />
      </div>
      <div>
        <label htmlFor="cf-price" className="input-label">Price (₹)</label>
        <input id="cf-price" name="price" type="number" min="0" required value={form.price} onChange={onChange} className="input" placeholder="e.g. 999" />
      </div>
      <div className="flex gap-3 mt-2">
        <button type="submit" id="course-form-save" className="btn-primary flex-1" disabled={loading}>
          {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow inline-block" /> : null}
          {loading ? 'Saving…' : initial._id ? 'Update Course' : 'Create Course'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function InstructorDashboard() {
  const { user } = useAuth();

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courseModal, setCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [savingCourse, setSavingCourse] = useState(false);

  // Users state
  const [users, setUsers]     = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState('courses');
  const [toast, setToast]     = useState(null);

  const notify = (message, type = 'success') => setToast({ message, type });

  /* ── Load data ── */
  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const { data } = await getCourses();
      setCourses(data);
    } catch {
      notify('Failed to load courses', 'error');
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch {
      notify('Failed to load users', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => { loadCourses(); loadUsers(); }, [loadCourses, loadUsers]);

  /* ── Course CRUD ── */
  const openCreate = () => { setEditingCourse(null); setCourseModal(true); };
  const openEdit   = (c)  => { setEditingCourse(c); setCourseModal(true); };

  const handleSaveCourse = async (formData) => {
    setSavingCourse(true);
    try {
      if (editingCourse?._id) {
        await updateCourse(editingCourse._id, formData);
        notify('Course updated successfully!');
      } else {
        await createCourse(formData);
        notify('Course created successfully!');
      }
      setCourseModal(false);
      setEditingCourse(null);
      loadCourses();
    } catch (err) {
      notify(err.response?.data?.error || 'Failed to save course', 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await deleteCourse(id);
      notify('Course deleted.');
      loadCourses();
    } catch {
      notify('Failed to delete course', 'error');
    }
  };

  /* ── User CRUD ── */
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUser(id);
      notify('User deleted.');
      loadUsers();
    } catch {
      notify('Failed to delete user', 'error');
    }
  };

  return (
    <div className="page-container">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Course Modal */}
      <Modal
        isOpen={courseModal}
        onClose={() => { setCourseModal(false); setEditingCourse(null); }}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
      >
        <CourseForm
          initial={editingCourse || {}}
          onSave={handleSaveCourse}
          onCancel={() => { setCourseModal(false); setEditingCourse(null); }}
          loading={savingCourse}
        />
      </Modal>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <span className="badge badge-purple mb-2">🛠️ Dashboard</span>
          <h1 className="text-3xl font-bold text-white">Instructor Panel</h1>
          <p className="text-slate-400 mt-1">Welcome back, <strong className="text-purple-300">{user?.name}</strong></p>
        </div>
        <button id="create-course-btn" onClick={openCreate} className="btn-primary shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <StatCard icon="📚" label="Total Courses" value={courses.length} color="bg-purple-600/20" />
        <StatCard icon="👥" label="Total Users"   value={users.length}   color="bg-blue-600/20" />
        <StatCard icon="🎓" label="Students"       value={users.filter(u => u.role === 'student').length}    color="bg-emerald-600/20" />
        <StatCard icon="📖" label="Instructors"    value={users.filter(u => u.role === 'instructor').length} color="bg-orange-600/20" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
        {['courses', 'users'].map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'courses' ? '📚 ' : '👥 '}{tab}
          </button>
        ))}
      </div>

      {/* ── Courses Tab ── */}
      {activeTab === 'courses' && (
        <div className="animate-fade-in">
          {coursesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin-slow" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 glass">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-xl font-semibold text-white mb-2">No courses yet</p>
              <p className="text-slate-400 mb-6">Create your first course to get started.</p>
              <button onClick={openCreate} className="btn-primary">Create Course</button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <div key={course._id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <CourseCard course={course} showActions onEdit={openEdit} onDelete={handleDeleteCourse} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ── */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          {usersLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin-slow" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 glass">
              <p className="text-5xl mb-4">👤</p>
              <p className="text-xl font-semibold text-white">No users found</p>
            </div>
          ) : (
            <div className="table-container animate-fade-up">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td className="text-slate-500 text-xs">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{u.name}</span>
                          {u._id === user?.id && <span className="badge badge-purple text-[10px] py-0.5 px-2">You</span>}
                        </div>
                      </td>
                      <td className="text-slate-400 text-sm">{u.email}</td>
                      <td>
                        <span className={`badge text-[11px] ${u.role === 'instructor' ? 'badge-purple' : 'badge-blue'}`}>
                          {u.role === 'instructor' ? '📖 ' : '🎓 '}{u.role}
                        </span>
                      </td>
                      <td className="text-slate-400 text-sm">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td>
                        {u._id !== user?.id ? (
                          <button
                            id={`delete-user-${u._id}`}
                            onClick={() => handleDeleteUser(u._id)}
                            className="btn-danger py-1 px-3 text-xs"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
