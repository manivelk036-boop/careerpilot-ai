import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourseDetail, getModules } from '../services/api';
import Layout from '../components/Layout';
import {
  ChevronDown, ChevronUp, Play, FileText, Brain,
  CheckCircle2, Lock, Clock, BookOpen, ArrowLeft, Layers
} from 'lucide-react';

// ── Skeleton ──────────────────────────────────────────────────────────
function ModuleSkeleton() {
  return (
    <div className="glass rounded-xl p-4 animate-pulse space-y-2">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
    </div>
  );
}

// ── Difficulty badge ───────────────────────────────────────────────────
const diffStyle = {
  Beginner:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/15  text-amber-400  border-amber-500/20',
  Advanced:     'bg-red-500/15    text-red-400    border-red-500/20',
};

// ── Module Row ─────────────────────────────────────────────────────────
function ModuleRow({ module, index, courseId, isCompleted }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Module header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left"
      >
        {/* Number */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          isCompleted
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-blue-500/15 text-blue-400'
        }`}>
          {isCompleted ? <CheckCircle2 size={18} /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium mb-0.5">Module {index + 1}</p>
          <p className="text-white font-semibold text-sm truncate">{module.title}</p>
          {module.description && (
            <p className="text-slate-600 text-xs mt-0.5 line-clamp-1">{module.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {module.hasVideos && <span className="text-xs text-slate-500">🎬</span>}
          {module.hasNotes  && <span className="text-xs text-slate-500">📄</span>}
          {module.hasQuiz   && <span className="text-xs text-slate-500">📝</span>}
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded actions */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Watch Video */}
              {module.hasVideos !== false && (
                <Link
                  to={`/courses/${courseId}/module/${module.id}/video`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Play size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Watch Video</p>
                    <p className="text-[10px] text-slate-500">
                      {module.videoCount || 0} video{(module.videoCount || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Link>
              )}

              {/* Download Notes */}
              {module.hasNotes && (
                <Link
                  to={`/courses/${courseId}/module/${module.id}/notes`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">View Notes</p>
                    <p className="text-[10px] text-slate-500">PDF available</p>
                  </div>
                </Link>
              )}

              {/* Take Quiz */}
              {module.hasQuiz && (
                <Link
                  to={`/courses/${courseId}/module/${module.id}/quiz`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Take Quiz</p>
                    <p className="text-[10px] text-slate-500">Test your knowledge</p>
                  </div>
                </Link>
              )}

              {!module.hasVideos && !module.hasNotes && !module.hasQuiz && (
                <p className="text-xs text-slate-600 col-span-3 text-center py-2">
                  Content coming soon for this module.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main CourseDetail Page ─────────────────────────────────────────────
export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course,  setCourse]  = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, modulesRes] = await Promise.all([
        getCourseDetail(courseId),
        getModules(courseId),
      ]);
      setCourse(courseRes.data);
      setModules(modulesRes.data || []);
    } catch (err) {
      setError('Could not load course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-48 bg-white/5 rounded-xl mb-4" />
            <div className="h-6 bg-white/10 rounded w-1/2 mb-2" />
            <div className="h-4 bg-white/5 rounded w-3/4" />
          </div>
          {[1,2,3].map(i => <ModuleSkeleton key={i} />)}
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout title="Error">
        <div className="glass p-8 text-center rounded-2xl">
          <p className="text-red-400 mb-4">{error || 'Course not found.'}</p>
          <button onClick={() => navigate('/courses')} className="btn-secondary">
            ← Back to Courses
          </button>
        </div>
      </Layout>
    );
  }

  const totalModules = modules.length;
  const completedCount = 0; // TODO: fetch from progress API
  const progressPct = totalModules > 0 ? Math.round(completedCount / totalModules * 100) : 0;

  return (
    <Layout title={course.title}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>

        {/* Course Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative w-full h-56 bg-gradient-to-br from-blue-900/40 to-purple-900/40">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={64} className="text-blue-400/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050912] via-transparent to-transparent" />

            {/* Difficulty badge */}
            {course.difficulty && (
              <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full border ${diffStyle[course.difficulty] || diffStyle.Beginner}`}>
                {course.difficulty}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6">
            {course.category && (
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
                {course.category}
              </p>
            )}
            <h1 className="font-display font-bold text-2xl text-white mb-2">{course.title}</h1>
            <p className="text-slate-400 text-sm mb-4">{course.description}</p>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
              {course.instructor && <span>👨‍🏫 {course.instructor}</span>}
              {course.durationHours && <span><Clock size={14} className="inline" /> {course.durationHours} hours</span>}
              <span><Layers size={14} className="inline" /> {totalModules} modules</span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Your Progress</span>
                <span className="text-blue-400 font-semibold">{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modules */}
        <div>
          <h2 className="font-display font-bold text-lg text-white mb-4">
            📋 Course Content
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({totalModules} modules)
            </span>
          </h2>

          {modules.length === 0 ? (
            <div className="glass p-8 rounded-2xl text-center">
              <p className="text-slate-500 text-sm">No modules have been added to this course yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((mod, i) => (
                <ModuleRow
                  key={mod.id}
                  module={mod}
                  index={i}
                  courseId={courseId}
                  isCompleted={false}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
