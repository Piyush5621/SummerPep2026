import axios from 'axios';

const api = axios.create({
  baseURL: 'https://summerpep2026.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studystack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login    = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);

// Courses
export const getCourses    = ()       => api.get('/api/courses');
export const getCourseById = (id)     => api.get(`/api/courses/${id}`);
export const createCourse  = (data)   => api.post('/api/courses', data);
export const updateCourse  = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse  = (id)     => api.delete(`/api/courses/${id}`);

// Users (instructor only)
export const getUsers    = ()         => api.get('/api/users');
export const getUserById = (id)       => api.get(`/api/users/${id}`);
export const createUser  = (data)     => api.post('/api/users', data);
export const updateUser  = (id, data) => api.put(`/api/users/${id}`, data);
export const deleteUser  = (id)       => api.delete(`/api/users/${id}`);

export default api;
