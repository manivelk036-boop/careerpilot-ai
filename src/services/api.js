import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://careerpilot-ai-production-6050.up.railway.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Auto-attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerpilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careerpilot_token');
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authLogin  = (data) => api.post('/api/auth/login', data);
export const authRegister = (data) => api.post('/api/auth/register', data);

// ── Courses ───────────────────────────────────────────────
export const getCourses       = () => api.get('/courses');
export const getCourseDetail  = (id) => api.get(`/courses/${id}`);

// ── Modules ───────────────────────────────────────────────
export const getModules = (courseId) => api.get(`/modules/course/${courseId}`);

// ── Videos ───────────────────────────────────────────────
export const getVideos = (moduleId) => api.get(`/videos/module/${moduleId}`);

// ── Notes ─────────────────────────────────────────────────
export const getNotes = (moduleId) => api.get(`/notes/module/${moduleId}`);

// ── Quiz ──────────────────────────────────────────────────
export const getQuiz    = (moduleId) => api.get(`/quiz/module/${moduleId}`);
export const submitQuiz = (data)     => api.post('/quiz/submit', data);

// ── Progress ──────────────────────────────────────────────
export const markProgress      = (data) => api.post('/progress', data);
export const getCourseProgress = (studentId, courseId) =>
  api.get(`/progress/${studentId}/course/${courseId}`);

// ── Admin ─────────────────────────────────────────────────
export const adminGetCourses   = () => api.get('/admin/courses');
export const adminCreateCourse = (data) => api.post('/admin/course', data);
export const adminUpdateCourse = (id, data) => api.put(`/admin/course/${id}`, data);
export const adminDeleteCourse = (id) => api.delete(`/admin/course/${id}`);

export const adminGetModules   = (courseId) => api.get(`/admin/modules/${courseId}`);
export const adminCreateModule = (data) => api.post('/admin/module', data);
export const adminUpdateModule = (id, data) => api.put(`/admin/module/${id}`, data);
export const adminDeleteModule = (id) => api.delete(`/admin/module/${id}`);

export const adminGetVideos    = (moduleId) => api.get(`/admin/videos/${moduleId}`);
export const adminCreateVideo  = (data) => api.post('/admin/video', data);
export const adminUpdateVideo  = (id, data) => api.put(`/admin/video/${id}`, data);
export const adminDeleteVideo  = (id) => api.delete(`/admin/video/${id}`);

export const adminGetNotes    = (moduleId) => api.get(`/admin/notes/${moduleId}`);
export const adminCreateNote  = (data) => api.post('/admin/note', data);
export const adminDeleteNote  = (id) => api.delete(`/admin/note/${id}`);

export const adminGetQuiz    = (moduleId) => api.get(`/admin/quiz/${moduleId}`);
export const adminCreateQuiz = (data) => api.post('/admin/quiz', data);
export const adminDeleteQuiz = (id) => api.delete(`/admin/quiz/${id}`);

export default api;
