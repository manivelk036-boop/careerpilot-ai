import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCareerLmsModules,
  getCareerLmsLessons,
  getCareerLmsVideos,
  getCareerLmsNotes,
  getCareerLmsQuizzes,
} from '../services/api';
import Layout from '../components/Layout';
import {
  ArrowLeft, ChevronDown, ChevronUp, ChevronRight,
  Play, FileText, Brain, BookOpen, Layers, Lock, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Lesson row (expandable) ────────────────────────────────────────────
function LessonRow({ lesson, goalId, moduleId, index }) {
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadContent = async () => {
    if (loaded) { setOpen(o => !o); return; }
    setOpen(true);
    setLoading(true);
    try {
      const [vRes, nRes, qRes] = await Promise.all([
        getCareerLmsVideos(goalId, moduleId, lesson.id),
        getCareerLmsNotes(goalId, moduleId, lesson.id),
        getCareerLmsQuizzes(goalId, moduleId, lesson.id),
      ]);
      setVideos(vRes.data || []);
      setNotes(nRes.data || []);
      setQuizzes(qRes.data || []);
      setLoaded(true);
    } catch {
      toast.error('Could not load lesson content.');
    } finally {
      setLoading(false);
    }
  };

  const hasContent = videos.length > 0 || notes.length > 0 || quizzes.length > 0;

  return (
    <div className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
      {/* Lesson header */}
      <button
        onClick={loadContent}
        className="w-full flex items-center gap-3 p-3.5 hover:bg-white/5 transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-400">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{lesson.title || lesson.name}</p>
          {lesson.description && (
            <p className="text-slate-600 text-xs mt-0.5 truncate">{lesson.description}</p>
          )}
        </div>
        {loading ? (
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
        ) : open ? (
          <ChevronUp size={15} className="text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-slate-500 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && !loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {!hasContent ? (
                <p className="text-xs text-slate-600 text-center py-3">
                  No content added to this lesson yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Videos */}
                  {videos.length > 0 && (
                    <Link
                      to={`/learn/${goalId}/module/${moduleId}/lesson/${lesson.id}/video`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Play size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Watch Videos</p>
                        <p className="text-[10px] text-slate-500">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  )}

                  {/* Notes */}
                  {notes.length > 0 && (
                    <Link
                      to={`/learn/${goalId}/module/${moduleId}/lesson/${lesson.id}/notes`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">View Notes</p>
                        <p className="text-[10px] text-slate-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  )}

                  {/* Quiz */}
                  {quizzes.length > 0 && (
                    <Link
                      to={`/learn/${goalId}/module/${moduleId}/lesson/${lesson.id}/quiz`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Brain size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Take Quiz</p>
                        <p className="text-[10px] text-slate-500">{quizzes.length} question{quizzes.length !== 1 ? 's' : ''}</p>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Module accordion ────────────────────────────────────────────────────
function ModuleAccordion({ module, goalId, index }) {
  const [open, setOpen] = useState(index === 0);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggle = async () => {
    if (!loaded) {
      setLoading(true);
      try {
        const res = await getCareerLmsLessons(goalId, module.id);
        setLessons(res.data || []);
        setLoaded(true);
      } catch {
        toast.error('Could not load lessons.');
      } finally {
        setLoading(false);
      }
    }
    setOpen(o => !o);
  };

  // Auto-load if first module (open by default)
  useEffect(() => {
    if (index === 0) {
      getCareerLmsLessons(goalId, module.id)
        .then(res => { setLessons(res.data || []); setLoaded(true); })
        .catch(() => {});
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Module header */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center font-bold text-sm text-blue-400 flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-0.5">Module {index + 1}</p>
          <p className="text-white font-semibold text-sm">{module.title || module.name}</p>
          {(module.description) && (
            <p className="text-slate-600 text-xs mt-0.5 truncate">{module.description}</p>
          )}
        </div>
        {loading ? (
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin flex-shrink-0" />
        ) : open ? (
          <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        )}
      </button>

      {/* Lessons */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {lessons.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-4">
                  No lessons added to this module yet.
                </p>
              ) : (
                lessons.map((lesson, i) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    goalId={goalId}
                    moduleId={module.id}
                    index={i}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main CareerLearning Page ────────────────────────────────────────────
export default function CareerLearning() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalName, setGoalName] = useState('');

  useEffect(() => {
    fetchModules();
  }, [goalId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await getCareerLmsModules(goalId);
      setModules(res.data || []);
    } catch {
      toast.error('Could not load course content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="My Learning">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>

        {/* Header */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen size={28} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Career Learning Path</p>
              <h1 className="font-display font-bold text-2xl text-white">Course Modules</h1>
              <p className="text-slate-500 text-sm mt-1">
                {loading ? 'Loading...' : `${modules.length} module${modules.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
          </div>
        </div>

        {/* Modules */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="glass p-10 rounded-2xl text-center">
            <Layers size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No modules have been added to this course yet.</p>
            <p className="text-slate-600 text-xs mt-1">Admin will add content soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <ModuleAccordion
                key={mod.id}
                module={mod}
                goalId={goalId}
                index={i}
              />
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
