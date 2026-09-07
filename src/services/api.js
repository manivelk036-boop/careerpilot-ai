import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

// ── Career Goals & Hierarchy ──────────────────────────────
export const getCareerGoals       = () => api.get('/career-goals');
export const getCareerGoalModules = (goalId) => api.get(`/career-goals/${goalId}/modules`);
export const getModuleLessons     = (moduleId) => api.get(`/modules/${moduleId}/lessons`);
export const getLessonQuizzes     = (lessonId) => api.get(`/lessons/${lessonId}/quizzes`);

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
export const getQuiz             = (moduleId) => api.get(`/quiz/module/${moduleId}`);
export const submitQuiz          = (data)     => api.post('/quiz/submit', data);
export const generateQuiz        = (params)   => api.get('/quiz/generate', { params });
export const getCompanyMockTest  = (company, count = 15) => api.get(`/quiz/company/${company}`, { params: { count } });
export const getQuizTopics       = ()         => api.get('/quiz/topics');
export const getQuizCompanies    = ()         => api.get('/quiz/companies');

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

// ── Career-Specific LMS (Strict Hierarchy) ──────────────
export const getCareerLmsGoals = () => api.get('/career-goals');
export const getCareerLmsModules = (goalId) => api.get(`/career-goals/${goalId}/modules`);
export const getCareerLmsLessons = (goalId, moduleId) => api.get(`/career-goals/${goalId}/modules/${moduleId}/lessons`);
export const getCareerLmsNotes = (goalId, moduleId, lessonId) => api.get(`/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/notes`);
export const getCareerLmsVideos = (goalId, moduleId, lessonId) => api.get(`/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/videos`);
export const getCareerLmsQuizzes = (goalId, moduleId, lessonId) => api.get(`/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/quizzes`);

// Admin Career-Specific LMS CRUD
export const adminCreateCareerModule = (goalId, data) => api.post(`/admin/lms/career-goals/${goalId}/modules`, data);
export const adminUpdateCareerModule = (goalId, moduleId, data) => api.put(`/admin/lms/career-goals/${goalId}/modules/${moduleId}`, data);
export const adminDeleteCareerModule = (goalId, moduleId) => api.delete(`/admin/lms/career-goals/${goalId}/modules/${moduleId}`);

export const adminCreateCareerLesson = (goalId, moduleId, data) => api.post(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons`, data);
export const adminUpdateCareerLesson = (goalId, moduleId, lessonId, data) => api.put(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}`, data);
export const adminDeleteCareerLesson = (goalId, moduleId, lessonId) => api.delete(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}`);

export const adminCreateCareerNotes = (goalId, moduleId, lessonId, data) => api.post(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/notes`, data);
export const adminUpdateCareerNotes = (goalId, moduleId, lessonId, noteId, data) => api.put(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/notes/${noteId}`, data);
export const adminDeleteCareerNotes = (goalId, moduleId, lessonId, noteId) => api.delete(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/notes/${noteId}`);

export const adminCreateCareerVideo = (goalId, moduleId, lessonId, data) => api.post(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/videos`, data);
export const adminUpdateCareerVideo = (goalId, moduleId, lessonId, videoId, data) => api.put(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/videos/${videoId}`, data);
export const adminDeleteCareerVideo = (goalId, moduleId, lessonId, videoId) => api.delete(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/videos/${videoId}`);

export const adminCreateCareerQuiz = (goalId, moduleId, lessonId, data) => api.post(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/quizzes`, data);
export const adminUpdateCareerQuiz = (goalId, moduleId, lessonId, quizId, data) => api.put(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${quizId}`, data);
export const adminDeleteCareerQuiz = (goalId, moduleId, lessonId, quizId) => api.delete(`/admin/lms/career-goals/${goalId}/modules/${moduleId}/lessons/${lessonId}/quizzes/${quizId}`);

export default api;
