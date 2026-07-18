import { useState, useEffect } from 'react';
import { adminGetCourses, adminCreateCourse, adminUpdateCourse, adminDeleteCourse,
         adminGetModules, adminCreateModule, adminUpdateModule, adminDeleteModule,
         adminGetVideos, adminCreateVideo, adminDeleteVideo,
         adminGetNotes, adminCreateNote, adminDeleteNote,
         adminGetQuiz, adminCreateQuiz, adminDeleteQuiz } from '../services/api';
import Layout from '../components/Layout';
import { Plus, Edit2, Trash2, BookOpen, Layers, Play, FileText, Brain, ChevronRight, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // Lists for selected module
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('courses'); // courses, modules, content

  // Form modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ id: null, title: '', description: '', thumbnailUrl: '', difficulty: 'Beginner', category: '', instructor: '', durationHours: '' });

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleForm, setModuleForm] = useState({ id: null, title: '', description: '', moduleOrder: 1 });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: '', youtubeUrl: '', durationMinutes: 10, orderNo: 1 });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', pdfUrl: '' });

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: 1, explanation: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await adminGetCourses();
      setCourses(res.data || []);
    } catch (e) {
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      const res = await adminGetModules(courseId);
      setModules(res.data || []);
    } catch (e) {
      toast.error('Failed to load modules.');
    }
  };

  const fetchModuleContent = async (moduleId) => {
    try {
      const [vRes, nRes, qRes] = await Promise.all([
        adminGetVideos(moduleId),
        adminGetNotes(moduleId),
        adminGetQuiz(moduleId)
      ]);
      setVideos(vRes.data || []);
      setNotes(nRes.data || []);
      setQuizzes(qRes.data || []);
    } catch (e) {
      toast.error('Failed to load module contents.');
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    fetchModules(course.id);
    setActiveTab('modules');
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    fetchModuleContent(module.id);
    setActiveTab('content');
  };

  // ── COURSE ACTIONS ──────────────────────────────────────────
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (courseForm.id) {
        await adminUpdateCourse(courseForm.id, courseForm);
        toast.success('Course updated!');
      } else {
        await adminCreateCourse(courseForm);
        toast.success('Course created!');
      }
      fetchCourses();
      setShowCourseModal(false);
    } catch (err) {
      toast.error('Failed to save course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course? All modules, videos, notes, and quizzes will be deleted.')) return;
    try {
      await adminDeleteCourse(id);
      toast.success('Course deleted.');
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setSelectedModule(null);
        setModules([]);
        setActiveTab('courses');
      }
      fetchCourses();
    } catch (e) {
      toast.error('Failed to delete course.');
    }
  };

  // ── MODULE ACTIONS ──────────────────────────────────────────
  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      if (moduleForm.id) {
        await adminUpdateModule(moduleForm.id, moduleForm);
        toast.success('Module updated!');
      } else {
        await adminCreateModule({ ...moduleForm, courseId: selectedCourse.id });
        toast.success('Module created!');
      }
      fetchModules(selectedCourse.id);
      setShowModuleModal(false);
    } catch (e) {
      toast.error('Failed to save module.');
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      await adminDeleteModule(id);
      toast.success('Module deleted.');
      if (selectedModule?.id === id) {
        setSelectedModule(null);
        setVideos([]);
        setNotes([]);
        setQuizzes([]);
        setActiveTab('modules');
      }
      fetchModules(selectedCourse.id);
    } catch (e) {
      toast.error('Failed to delete module.');
    }
  };

  // ── VIDEO ACTIONS ───────────────────────────────────────────
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    try {
      await adminCreateVideo({ ...videoForm, moduleId: selectedModule.id });
      toast.success('Video added!');
      fetchModuleContent(selectedModule.id);
      setShowVideoModal(false);
    } catch (e) {
      toast.error('Failed to add video.');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      await adminDeleteVideo(id);
      toast.success('Video removed.');
      fetchModuleContent(selectedModule.id);
    } catch (e) {
      toast.error('Failed to remove video.');
    }
  };

  // ── NOTE ACTIONS ────────────────────────────────────────────
  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      await adminCreateNote({ ...noteForm, moduleId: selectedModule.id });
      toast.success('Note added!');
      fetchModuleContent(selectedModule.id);
      setShowNoteModal(false);
    } catch (e) {
      toast.error('Failed to add note.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Remove this note?')) return;
    try {
      await adminDeleteNote(id);
      toast.success('Note removed.');
      fetchModuleContent(selectedModule.id);
    } catch (e) {
      toast.error('Failed to remove note.');
    }
  };

  // ── QUIZ ACTIONS ────────────────────────────────────────────
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      await adminCreateQuiz({ ...quizForm, moduleId: selectedModule.id });
      toast.success('Quiz question added!');
      fetchModuleContent(selectedModule.id);
      setShowQuizModal(false);
    } catch (e) {
      toast.error('Failed to add quiz question.');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await adminDeleteQuiz(id);
      toast.success('Question deleted.');
      fetchModuleContent(selectedModule.id);
    } catch (e) {
      toast.error('Failed to delete question.');
    }
  };

  return (
    <Layout title="LMS Admin Panel">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">⚙️ LMS Management</h2>
            <p className="text-slate-500 text-sm">Create and organize courses, modules, videos, notes, and quiz questions.</p>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'courses' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Courses ({courses.length})
          </button>
          {selectedCourse && (
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'modules' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📂 Modules: {selectedCourse.title}
            </button>
          )}
          {selectedModule && (
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'content' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 Contents: {selectedModule.title}
            </button>
          )}
        </div>

        {/* TAB 1: COURSES LIST */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-base">Select a course to manage its content</h3>
              <button
                onClick={() => {
                  setCourseForm({ id: null, title: '', description: '', thumbnailUrl: '', difficulty: 'Beginner', category: '', instructor: '', durationHours: '' });
                  setShowCourseModal(true);
                }}
                className="btn-primary flex items-center gap-1 text-xs py-2 px-4"
              >
                <Plus size={14} /> Add Course
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl" />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="glass p-12 text-center rounded-2xl">
                <p className="text-slate-500 mb-4">No courses available in LMS. Start by adding one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="glass rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/20 transition-all">
                    <div className="w-full h-32 bg-white/5 relative">
                      {course.thumbnailUrl && <img src={course.thumbnailUrl} className="w-full h-full object-cover" />}
                      <span className="absolute top-2 left-2 text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-semibold border border-white/10">
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-white font-semibold text-sm line-clamp-1">{course.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2 mt-1 mb-4">{course.description}</p>
                      
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleSelectCourse(course)}
                          className="btn-primary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1"
                        >
                          Manage Modules <ChevronRight size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setCourseForm(course);
                            setShowCourseModal(true);
                          }}
                          className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/25 border border-red-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODULES LIST */}
        {activeTab === 'modules' && selectedCourse && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <button onClick={() => setActiveTab('courses')} className="text-xs text-blue-400 hover:underline">← Back to Course Selection</button>
                <h3 className="text-white font-bold text-base mt-1">Modules in "{selectedCourse.title}"</h3>
              </div>
              <button
                onClick={() => {
                  setModuleForm({ id: null, title: '', description: '', moduleOrder: modules.length + 1 });
                  setShowModuleModal(true);
                }}
                className="btn-primary flex items-center gap-1 text-xs py-2 px-4"
              >
                <Plus size={14} /> Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="glass p-12 text-center rounded-2xl">
                <p className="text-slate-500">No modules added to this course yet. Get started by adding a module!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((mod, i) => (
                  <div key={mod.id} className="glass p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all">
                    <div>
                      <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase font-mono">Module {mod.moduleOrder || i + 1}</span>
                      <h4 className="text-white font-semibold text-sm mt-0.5">{mod.title}</h4>
                      {mod.description && <p className="text-slate-500 text-xs mt-0.5">{mod.description}</p>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectModule(mod)}
                        className="btn-primary text-xs py-2 px-3 flex items-center gap-1"
                      >
                        Manage Content <ChevronRight size={12} />
                      </button>
                      <button
                        onClick={() => {
                          setModuleForm(mod);
                          setShowModuleModal(true);
                        }}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(mod.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/25 border border-red-500/10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTENT MANAGEMENT */}
        {activeTab === 'content' && selectedModule && (
          <div className="space-y-6">
            <div>
              <button onClick={() => setActiveTab('modules')} className="text-xs text-blue-400 hover:underline">← Back to Modules</button>
              <h3 className="text-white font-bold text-base mt-1">Content Manager — {selectedModule.title}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* 1. VIDEOS SECTION */}
              <div className="glass p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
                    <Play size={14} className="text-blue-400" /> Videos ({videos.length})
                  </h4>
                  <button
                    onClick={() => {
                      setVideoForm({ title: '', youtubeUrl: '', durationMinutes: 10, orderNo: videos.length + 1 });
                      setShowVideoModal(true);
                    }}
                    className="p-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/10"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {videos.length === 0 ? (
                    <p className="text-xs text-slate-600">No videos uploaded.</p>
                  ) : (
                    videos.map(v => (
                      <div key={v.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="text-white font-medium truncate">{v.title}</p>
                          <p className="text-slate-600 truncate text-[10px]">{v.youtubeUrl}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          className="text-red-400 hover:text-red-500 p-1 flex-shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 2. NOTES SECTION */}
              <div className="glass p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
                    <FileText size={14} className="text-purple-400" /> Notes ({notes.length})
                  </h4>
                  <button
                    onClick={() => {
                      setNoteForm({ title: '', pdfUrl: '' });
                      setShowNoteModal(true);
                    }}
                    className="p-1 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded border border-purple-500/10"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {notes.length === 0 ? (
                    <p className="text-xs text-slate-600">No notes uploaded.</p>
                  ) : (
                    notes.map(n => (
                      <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="text-white font-medium truncate">{n.title}</p>
                          <a href={n.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline truncate text-[10px] block">
                            View PDF Link
                          </a>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="text-red-400 hover:text-red-500 p-1 flex-shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3. QUIZ QUESTIONS SECTION */}
              <div className="glass p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
                    <Brain size={14} className="text-emerald-400" /> Quiz Questions ({quizzes.length})
                  </h4>
                  <button
                    onClick={() => {
                      setQuizForm({ question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: 1, explanation: '' });
                      setShowQuizModal(true);
                    }}
                    className="p-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded border border-emerald-500/10"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {quizzes.length === 0 ? (
                    <p className="text-xs text-slate-600">No quiz questions added.</p>
                  ) : (
                    quizzes.map((q, idx) => (
                      <div key={q.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] text-emerald-400 font-semibold uppercase">Q{idx + 1}</span>
                          <p className="text-white font-medium line-clamp-2 mt-0.5">{q.question}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteQuiz(q.id)}
                          className="text-red-400 hover:text-red-500 p-1 flex-shrink-0 mt-0.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ── MODAL: COURSE ────────────────────────────────────────────────── */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-lg p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setShowCourseModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
            <h3 className="text-white font-bold text-lg">{courseForm.id ? 'Edit Course' : 'Create New Course'}</h3>
            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Course Title *</label>
                  <input required type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Java Programming" />
                </div>
                <div>
                  <label className="text-slate-400">Category *</label>
                  <input required type="text" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Programming, Web Dev" />
                </div>
              </div>
              <div>
                <label className="text-slate-400">Description</label>
                <textarea rows={3} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="input-field mt-1 py-2" placeholder="Describe the course goals..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400">Difficulty</label>
                  <select value={courseForm.difficulty} onChange={e => setCourseForm({...courseForm, difficulty: e.target.value})} className="input-field mt-1 py-2 bg-[#090F1E]">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Instructor</label>
                  <input type="text" value={courseForm.instructor} onChange={e => setCourseForm({...courseForm, instructor: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-slate-400">Duration (Hours)</label>
                  <input type="number" value={courseForm.durationHours} onChange={e => setCourseForm({...courseForm, durationHours: e.target.value ? Number(e.target.value) : ''})} className="input-field mt-1 py-2" placeholder="e.g. 24" />
                </div>
              </div>
              <div>
                <label className="text-slate-400">Thumbnail URL</label>
                <input type="text" value={courseForm.thumbnailUrl} onChange={e => setCourseForm({...courseForm, thumbnailUrl: e.target.value})} className="input-field mt-1 py-2" placeholder="https://images.unsplash.com/... or cloud URL" />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 mt-2 rounded-xl text-sm font-semibold">Save Course</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: MODULE ────────────────────────────────────────────────── */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-md p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setShowModuleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
            <h3 className="text-white font-bold text-base">{moduleForm.id ? 'Edit Module' : 'Create New Module'}</h3>
            <form onSubmit={handleSaveModule} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Module Title *</label>
                <input required type="text" value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Variables & Data Types" />
              </div>
              <div>
                <label className="text-slate-400">Description</label>
                <textarea rows={2} value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} className="input-field mt-1 py-2" placeholder="What is taught in this module..." />
              </div>
              <div>
                <label className="text-slate-400">Module Order (1, 2, 3...)</label>
                <input required type="number" value={moduleForm.moduleOrder} onChange={e => setModuleForm({...moduleForm, moduleOrder: Number(e.target.value)})} className="input-field mt-1 py-2" />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 mt-2 rounded-xl font-semibold">Save Module</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: VIDEO ─────────────────────────────────────────────────── */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-md p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
            <h3 className="text-white font-bold text-base">Add Video to Module</h3>
            <form onSubmit={handleSaveVideo} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Video Title *</label>
                <input required type="text" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Introduction to Variables" />
              </div>
              <div>
                <label className="text-slate-400">YouTube URL *</label>
                <input required type="text" value={videoForm.youtubeUrl} onChange={e => setVideoForm({...videoForm, youtubeUrl: e.target.value})} className="input-field mt-1 py-2" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Duration (Minutes)</label>
                  <input type="number" value={videoForm.durationMinutes} onChange={e => setVideoForm({...videoForm, durationMinutes: Number(e.target.value)})} className="input-field mt-1 py-2" />
                </div>
                <div>
                  <label className="text-slate-400">Order No</label>
                  <input type="number" value={videoForm.orderNo} onChange={e => setVideoForm({...videoForm, orderNo: Number(e.target.value)})} className="input-field mt-1 py-2" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 mt-2 rounded-xl font-semibold">Add Video</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: NOTE ──────────────────────────────────────────────────── */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-md p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setShowNoteModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
            <h3 className="text-white font-bold text-base">Add Notes PDF Link</h3>
            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Notes Title *</label>
                <input required type="text" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Week 1 Reference Manual" />
              </div>
              <div>
                <label className="text-slate-400">PDF URL *</label>
                <input required type="text" value={noteForm.pdfUrl} onChange={e => setNoteForm({...noteForm, pdfUrl: e.target.value})} className="input-field mt-1 py-2" placeholder="https://res.cloudinary.com/... or AWS S3 URL" />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 mt-2 rounded-xl font-semibold">Add Note</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── MODAL: QUIZ ──────────────────────────────────────────────────── */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-lg p-6 rounded-2xl space-y-4 relative">
            <button onClick={() => setShowQuizModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18} /></button>
            <h3 className="text-white font-bold text-base">Add Quiz Question</h3>
            <form onSubmit={handleSaveQuiz} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Question *</label>
                <textarea required rows={2} value={quizForm.question} onChange={e => setQuizForm({...quizForm, question: e.target.value})} className="input-field mt-1 py-2" placeholder="What is the default value of..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Option 1 *</label>
                  <input required type="text" value={quizForm.option1} onChange={e => setQuizForm({...quizForm, option1: e.target.value})} className="input-field mt-1 py-2" />
                </div>
                <div>
                  <label className="text-slate-400">Option 2 *</label>
                  <input required type="text" value={quizForm.option2} onChange={e => setQuizForm({...quizForm, option2: e.target.value})} className="input-field mt-1 py-2" />
                </div>
                <div>
                  <label className="text-slate-400">Option 3 *</label>
                  <input required type="text" value={quizForm.option3} onChange={e => setQuizForm({...quizForm, option3: e.target.value})} className="input-field mt-1 py-2" />
                </div>
                <div>
                  <label className="text-slate-400">Option 4 *</label>
                  <input required type="text" value={quizForm.option4} onChange={e => setQuizForm({...quizForm, option4: e.target.value})} className="input-field mt-1 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400">Correct Answer Option (1-4) *</label>
                  <select value={quizForm.correctAnswer} onChange={e => setQuizForm({...quizForm, correctAnswer: Number(e.target.value)})} className="input-field mt-1 py-2 bg-[#090F1E]">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                    <option value={3}>Option 3</option>
                    <option value={4}>Option 4</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Explanation</label>
                  <input type="text" value={quizForm.explanation} onChange={e => setQuizForm({...quizForm, explanation: e.target.value})} className="input-field mt-1 py-2" placeholder="e.g. Because primitive types..." />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 mt-2 rounded-xl font-semibold">Add Question</button>
            </form>
          </motion.div>
        </div>
      )}

    </Layout>
  );
}
