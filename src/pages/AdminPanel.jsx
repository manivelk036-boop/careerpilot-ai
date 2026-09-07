import { useState, useEffect } from 'react';
import {
  getCareerLmsGoals, getCareerLmsModules, getCareerLmsLessons,
  getCareerLmsNotes, getCareerLmsVideos, getCareerLmsQuizzes,
  adminCreateCareerModule, adminUpdateCareerModule, adminDeleteCareerModule,
  adminCreateCareerLesson, adminUpdateCareerLesson, adminDeleteCareerLesson,
  adminCreateCareerNotes, adminUpdateCareerNotes, adminDeleteCareerNotes,
  adminCreateCareerVideo, adminUpdateCareerVideo, adminDeleteCareerVideo,
  adminCreateCareerQuiz, adminUpdateCareerQuiz, adminDeleteCareerQuiz
} from '../services/api';
import Layout from '../components/Layout';
import { Plus, Edit2, Trash2, BookOpen, Layers, Play, FileText, Brain, ChevronRight, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [careerGoals, setCareerGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Lesson Content
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(false);

  // Modals
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleForm, setModuleForm] = useState({ id: null, name: '', description: '', moduleOrder: 1 });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState({ id: null, name: '', description: '', lessonOrder: 1 });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ id: null, title: '', content: '' });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoForm, setVideoForm] = useState({ id: null, title: '', youtubeUrl: '', durationMinutes: 15, orderNo: 1 });

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ id: null, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await getCareerLmsGoals();
      setCareerGoals(res.data || []);
    } catch (e) {
      toast.error('Failed to load career goals.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoal = async (goal) => {
    setSelectedGoal(goal);
    setSelectedModule(null);
    setSelectedLesson(null);
    setModules([]);
    setLessons([]);
    setNotes([]);
    setVideos([]);
    setQuizzes([]);

    try {
      const res = await getCareerLmsModules(goal.id);
      setModules(res.data || []);
    } catch (e) {
      toast.error('Failed to load modules.');
    }
  };

  const handleSelectModule = async (module) => {
    setSelectedModule(module);
    setSelectedLesson(null);
    setLessons([]);
    setNotes([]);
    setVideos([]);
    setQuizzes([]);

    try {
      const res = await getCareerLmsLessons(selectedGoal.id, module.id);
      setLessons(res.data || []);
    } catch (e) {
      toast.error('Failed to load lessons.');
    }
  };

  const handleSelectLesson = async (lesson) => {
    setSelectedLesson(lesson);
    fetchLessonContent(selectedGoal.id, selectedModule.id, lesson.id);
  };

  const fetchLessonContent = async (goalId, moduleId, lessonId) => {
    try {
      const [nRes, vRes, qRes] = await Promise.all([
        getCareerLmsNotes(goalId, moduleId, lessonId),
        getCareerLmsVideos(goalId, moduleId, lessonId),
        getCareerLmsQuizzes(goalId, moduleId, lessonId)
      ]);
      setNotes(nRes.data || []);
      setVideos(vRes.data || []);
      setQuizzes(qRes.data || []);
    } catch (e) {
      toast.error('Failed to load lesson content.');
    }
  };

  // ── MODULE ACTIONS ─────────────────────────────────────────

  const handleSaveModule = async () => {
    if (!moduleForm.name.trim()) return toast.error('Module name required');
    try {
      if (moduleForm.id) {
        await adminUpdateCareerModule(selectedGoal.id, moduleForm.id, moduleForm);
        toast.success('Module updated!');
      } else {
        await adminCreateCareerModule(selectedGoal.id, moduleForm);
        toast.success('Module created!');
      }
      setShowModuleModal(false);
      handleSelectGoal(selectedGoal);
    } catch (e) {
      toast.error('Failed to save module.');
    }
  };

  const handleDeleteModule = async (mId) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      await adminDeleteCareerModule(selectedGoal.id, mId);
      toast.success('Module deleted!');
      handleSelectGoal(selectedGoal);
    } catch (e) {
      toast.error('Failed to delete module.');
    }
  };

  // ── LESSON ACTIONS ─────────────────────────────────────────

  const handleSaveLesson = async () => {
    if (!lessonForm.name.trim()) return toast.error('Lesson name required');
    try {
      if (lessonForm.id) {
        await adminUpdateCareerLesson(selectedGoal.id, selectedModule.id, lessonForm.id, lessonForm);
        toast.success('Lesson updated!');
      } else {
        await adminCreateCareerLesson(selectedGoal.id, selectedModule.id, lessonForm);
        toast.success('Lesson created!');
      }
      setShowLessonModal(false);
      handleSelectModule(selectedModule);
    } catch (e) {
      toast.error('Failed to save lesson.');
    }
  };

  const handleDeleteLesson = async (lId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await adminDeleteCareerLesson(selectedGoal.id, selectedModule.id, lId);
      toast.success('Lesson deleted!');
      handleSelectModule(selectedModule);
    } catch (e) {
      toast.error('Failed to delete lesson.');
    }
  };

  // ── NOTES ACTIONS ──────────────────────────────────────────

  const handleSaveNote = async () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) return toast.error('Title and content required');
    try {
      if (noteForm.id) {
        await adminUpdateCareerNotes(selectedGoal.id, selectedModule.id, selectedLesson.id, noteForm.id, noteForm);
        toast.success('Notes updated!');
      } else {
        await adminCreateCareerNotes(selectedGoal.id, selectedModule.id, selectedLesson.id, noteForm);
        toast.success('Notes created!');
      }
      setShowNoteModal(false);
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error('Failed to save notes.');
    }
  };

  const handleDeleteNote = async (nId) => {
    if (!window.confirm('Delete notes?')) return;
    try {
      await adminDeleteCareerNotes(selectedGoal.id, selectedModule.id, selectedLesson.id, nId);
      toast.success('Notes deleted!');
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error('Failed to delete notes.');
    }
  };

  // ── VIDEO ACTIONS ──────────────────────────────────────────

  const handleSaveVideo = async () => {
    if (!videoForm.title.trim() || !videoForm.youtubeUrl.trim()) return toast.error('Title and YouTube URL required');
    try {
      if (videoForm.id) {
        await adminUpdateCareerVideo(selectedGoal.id, selectedModule.id, selectedLesson.id, videoForm.id, videoForm);
        toast.success('Video updated!');
      } else {
        await adminCreateCareerVideo(selectedGoal.id, selectedModule.id, selectedLesson.id, videoForm);
        toast.success('Video added!');
      }
      setShowVideoModal(false);
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid YouTube URL or server error.');
    }
  };

  const handleDeleteVideo = async (vId) => {
    if (!window.confirm('Delete video link?')) return;
    try {
      await adminDeleteCareerVideo(selectedGoal.id, selectedModule.id, selectedLesson.id, vId);
      toast.success('Video deleted!');
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error('Failed to delete video.');
    }
  };

  // ── QUIZ ACTIONS ───────────────────────────────────────────

  const handleSaveQuiz = async () => {
    if (!quizForm.question.trim() || !quizForm.optionA.trim() || !quizForm.optionB.trim()) return toast.error('Question and options A/B required');
    try {
      if (quizForm.id) {
        await adminUpdateCareerQuiz(selectedGoal.id, selectedModule.id, selectedLesson.id, quizForm.id, quizForm);
        toast.success('Quiz updated!');
      } else {
        await adminCreateCareerQuiz(selectedGoal.id, selectedModule.id, selectedLesson.id, quizForm);
        toast.success('Quiz created!');
      }
      setShowQuizModal(false);
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error('Failed to save quiz question.');
    }
  };

  const handleDeleteQuiz = async (qId) => {
    if (!window.confirm('Delete quiz question?')) return;
    try {
      await adminDeleteCareerQuiz(selectedGoal.id, selectedModule.id, selectedLesson.id, qId);
      toast.success('Quiz deleted!');
      fetchLessonContent(selectedGoal.id, selectedModule.id, selectedLesson.id);
    } catch (e) {
      toast.error('Failed to delete quiz.');
    }
  };

  return (
    <Layout title="Admin LMS Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Breadcrumb Banner */}
        <div className="glass p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <h1 className="font-display font-bold text-2xl text-white mb-2">⚡ Career LMS Content Management</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Career: {selectedGoal ? selectedGoal.name : 'Not Selected'}
            </span>
            <ChevronRight size={14} className="text-slate-500" />
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Module: {selectedModule ? selectedModule.name : 'Not Selected'}
            </span>
            <ChevronRight size={14} className="text-slate-500" />
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Lesson: {selectedLesson ? selectedLesson.name : 'Not Selected'}
            </span>
          </div>
        </div>

        {/* STEP 1: SELECT CAREER GOAL */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">1. Select Target Career Goal</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {careerGoals.map(goal => (
              <button
                key={goal.id}
                onClick={() => handleSelectGoal(goal)}
                className={`p-4 rounded-xl border text-left font-medium text-xs transition-all ${
                  selectedGoal?.id === goal.id
                    ? 'bg-blue-500/20 border-blue-500 text-white shadow-glow-blue'
                    : 'glass text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="font-bold text-sm mb-1">{goal.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{goal.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: MODULES FOR SELECTED CAREER */}
        {selectedGoal && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                2. Modules for <span className="text-blue-400">{selectedGoal.name}</span>
              </h2>
              <button
                onClick={() => { setModuleForm({ id: null, name: '', description: '', moduleOrder: modules.length + 1 }); setShowModuleModal(true); }}
                className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
              >
                <Plus size={14} /> Add Module
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modules.map(mod => (
                <div
                  key={mod.id}
                  onClick={() => handleSelectModule(mod)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedModule?.id === mod.id
                      ? 'bg-purple-500/20 border-purple-500 text-white'
                      : 'glass text-slate-300 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-purple-400 font-bold uppercase">Module {mod.moduleOrder}</span>
                      <h4 className="font-bold text-sm text-white">{mod.name}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setModuleForm(mod); setShowModuleModal(true); }} className="p-1 text-slate-400 hover:text-blue-400"><Edit2 size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id); }} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: LESSONS FOR SELECTED MODULE */}
        {selectedModule && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                3. Lessons for <span className="text-purple-400">{selectedModule.name}</span>
              </h2>
              <button
                onClick={() => { setLessonForm({ id: null, name: '', description: '', lessonOrder: lessons.length + 1 }); setShowLessonModal(true); }}
                className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3"
              >
                <Plus size={14} /> Add Lesson
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {lessons.map(l => (
                <div
                  key={l.id}
                  onClick={() => handleSelectLesson(l)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedLesson?.id === l.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'glass text-slate-300 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-emerald-400 font-bold">Lesson {l.lessonOrder}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setLessonForm(l); setShowLessonModal(true); }} className="p-1 text-slate-400 hover:text-blue-400"><Edit2 size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteLesson(l.id); }} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <h5 className="font-semibold text-xs text-white">{l.name}</h5>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: CONTENT MANAGEMENT (NOTES, YOUTUBE, QUIZ) */}
        {selectedLesson && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl space-y-6 border border-emerald-500/30">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Content for: <span className="text-emerald-400">{selectedLesson.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Strictly attached to {selectedGoal.name} → {selectedModule.name} → {selectedLesson.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* NOTES / CONTENT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <FileText size={14} className="text-blue-400" /> Lesson Notes ({notes.length})
                  </h4>
                  <button onClick={() => { setNoteForm({ id: null, title: '', content: '' }); setShowNoteModal(true); }} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add Notes
                  </button>
                </div>

                {notes.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{n.title}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setNoteForm(n); setShowNoteModal(true); }} className="text-slate-400 hover:text-blue-400"><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteNote(n.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-3 font-sans whitespace-pre-wrap">{n.content}</p>
                  </div>
                ))}
              </div>

              {/* YOUTUBE VIDEOS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Play size={14} className="text-red-400" /> YouTube Videos ({videos.length})
                  </h4>
                  <button onClick={() => { setVideoForm({ id: null, title: '', youtubeUrl: '', durationMinutes: 15, orderNo: videos.length + 1 }); setShowVideoModal(true); }} className="text-xs text-red-400 hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add Video
                  </button>
                </div>

                {videos.map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{v.title}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setVideoForm(v); setShowVideoModal(true); }} className="text-slate-400 hover:text-blue-400"><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteVideo(v.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="text-[10px] text-red-400 hover:underline truncate block">
                      {v.youtubeUrl}
                    </a>
                  </div>
                ))}
              </div>

              {/* QUIZZES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Brain size={14} className="text-purple-400" /> Quizzes ({quizzes.length})
                  </h4>
                  <button onClick={() => { setQuizForm({ id: null, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '' }); setShowQuizModal(true); }} className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add Quiz Question
                  </button>
                </div>

                {quizzes.map(q => (
                  <div key={q.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white line-clamp-1">{q.question}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setQuizForm(q); setShowQuizModal(true); }} className="text-slate-400 hover:text-blue-400"><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteQuiz(q.id)} className="text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">Ans: Option {q.correctAnswer}</span>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}

      </div>

      {/* MODAL: NOTES */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass p-6 rounded-2xl max-w-lg w-full space-y-4">
            <h3 className="text-white font-bold">{noteForm.id ? 'Edit Notes' : 'Add Lesson Notes'}</h3>
            <input className="input-field" placeholder="Notes Title" value={noteForm.title} onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))} />
            <textarea className="input-field h-32" placeholder="Write lesson study notes / explanation..." value={noteForm.content} onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNoteModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveNote} className="btn-primary text-xs">Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass p-6 rounded-2xl max-w-lg w-full space-y-4">
            <h3 className="text-white font-bold">{videoForm.id ? 'Edit Video' : 'Add YouTube Video Link'}</h3>
            <input className="input-field" placeholder="Video Title" value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} />
            <input className="input-field" placeholder="YouTube URL (https://www.youtube.com/...)" value={videoForm.youtubeUrl} onChange={e => setVideoForm(f => ({ ...f, youtubeUrl: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className="input-field" placeholder="Duration (mins)" value={videoForm.durationMinutes} onChange={e => setVideoForm(f => ({ ...f, durationMinutes: parseInt(e.target.value) || 0 }))} />
              <input type="number" className="input-field" placeholder="Order No" value={videoForm.orderNo} onChange={e => setVideoForm(f => ({ ...f, orderNo: parseInt(e.target.value) || 1 }))} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowVideoModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveVideo} className="btn-primary text-xs">Save Video</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUIZ */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto max-h-screen">
          <div className="glass p-6 rounded-2xl max-w-lg w-full space-y-3 my-8">
            <h3 className="text-white font-bold">{quizForm.id ? 'Edit Quiz Question' : 'Add Quiz Question'}</h3>
            <textarea className="input-field h-20" placeholder="Question Text" value={quizForm.question} onChange={e => setQuizForm(f => ({ ...f, question: e.target.value }))} />
            <input className="input-field" placeholder="Option A" value={quizForm.optionA} onChange={e => setQuizForm(f => ({ ...f, optionA: e.target.value }))} />
            <input className="input-field" placeholder="Option B" value={quizForm.optionB} onChange={e => setQuizForm(f => ({ ...f, optionB: e.target.value }))} />
            <input className="input-field" placeholder="Option C" value={quizForm.optionC} onChange={e => setQuizForm(f => ({ ...f, optionC: e.target.value }))} />
            <input className="input-field" placeholder="Option D" value={quizForm.optionD} onChange={e => setQuizForm(f => ({ ...f, optionD: e.target.value }))} />
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Correct Option</label>
              <select className="input-field" value={quizForm.correctAnswer} onChange={e => setQuizForm(f => ({ ...f, correctAnswer: e.target.value }))}>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <textarea className="input-field h-16" placeholder="Explanation" value={quizForm.explanation} onChange={e => setQuizForm(f => ({ ...f, explanation: e.target.value }))} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowQuizModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveQuiz} className="btn-primary text-xs">Save Question</button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
