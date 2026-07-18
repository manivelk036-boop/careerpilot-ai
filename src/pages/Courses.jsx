import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourses } from '../services/api';
import Layout from '../components/Layout';
import {
  BookOpen, Clock, Play, Users, ChevronRight,
  Layers, Star, Wifi, WifiOff
} from 'lucide-react';

// ── Skeleton card for loading state ──────────────────────────────────
function CourseSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/10 rounded-full w-1/3" />
        <div className="h-5 bg-white/10 rounded-full w-3/4" />
        <div className="h-3 bg-white/10 rounded-full w-full" />
        <div className="h-3 bg-white/10 rounded-full w-2/3" />
        <div className="flex gap-3 mt-4">
          <div className="h-8 bg-white/10 rounded-xl flex-1" />
          <div className="h-8 bg-white/10 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

// ── Difficulty color helper ───────────────────────────────────────────
const difficultyStyle = {
  Beginner:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Advanced:     'bg-red-500/15 text-red-400 border-red-500/20',
};

// ── Course Card ───────────────────────────────────────────────────────
function CourseCard({ course, index }) {
  const progress = course.progressPercent ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden flex flex-col hover:border-blue-500/30 transition-all duration-300 group"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-blue-900/40 to-purple-900/40">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-blue-400/40" />
          </div>
        )}
        {/* Difficulty badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${difficultyStyle[course.difficulty] || difficultyStyle.Beginner}`}>
          {course.difficulty || 'Beginner'}
        </span>
        {/* Progress overlay */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {course.category && (
          <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
            {course.category}
          </p>
        )}

        <h3 className="font-display font-bold text-white text-base mb-1.5 line-clamp-1 group-hover:text-blue-300 transition-colors">
          {course.title}
        </h3>

        <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {course.description || 'No description available.'}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Layers size={12} /> {course.totalModules || 0} Modules
          </span>
          <span className="flex items-center gap-1">
            <Play size={12} /> {course.totalVideos || 0} Videos
          </span>
          {course.durationHours && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {course.durationHours}h
            </span>
          )}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="text-blue-400 font-semibold">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-slate-600 mb-4">
            👨‍🏫 {course.instructor}
          </p>
        )}

        <div className="mt-auto">
          <Link
            to={`/courses/${course.id}`}
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl"
          >
            {progress > 0 ? '▶ Continue Learning' : '🚀 Start Course'}
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
        <BookOpen size={36} className="text-blue-400/50" />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">No Courses Available Yet</h3>
      <p className="text-slate-500 text-sm max-w-md">
        Courses will appear here once an admin adds them. Check back soon!
      </p>
    </div>
  );
}

// ── Main Courses Page ──────────────────────────────────────────────────
export default function Courses() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filter, setFilter]       = useState('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (err) {
      setError('Could not load courses. Please try again.');
      console.error('Courses fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const [diffFilter, setDiffFilter] = useState('All');

  const filtered = courses.filter(c => {
    const catOk  = filter === 'All' || c.category === filter;
    const diffOk = diffFilter === 'All' || c.difficulty === diffFilter;
    return catOk && diffOk;
  });

  return (
    <Layout title="Courses">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">📚 All Courses</h2>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? 'Loading courses...' : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {/* Connection status */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <WifiOff size={14} /> Backend offline
            </div>
          )}
        </div>

        {/* Filters */}
        {!loading && courses.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filter === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap ml-auto">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    diffFilter === d
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass p-6 rounded-2xl border border-red-500/20 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={fetchCourses} className="btn-secondary text-sm px-4 py-2">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)
            : filtered.length > 0
            ? filtered.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)
            : <EmptyState />
          }
        </div>

      </div>
    </Layout>
  );
}
