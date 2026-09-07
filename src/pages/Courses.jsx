import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCareerGoals } from '../services/api';
import Layout from '../components/Layout';
import { BookOpen, ChevronRight, Layers, Target, Zap } from 'lucide-react';

// Career-goal card colors by index
const CARD_GRADIENTS = [
  'from-blue-600/20 to-blue-900/20 border-blue-500/20',
  'from-purple-600/20 to-purple-900/20 border-purple-500/20',
  'from-emerald-600/20 to-emerald-900/20 border-emerald-500/20',
  'from-amber-600/20 to-amber-900/20 border-amber-500/20',
  'from-rose-600/20 to-rose-900/20 border-rose-500/20',
  'from-cyan-600/20 to-cyan-900/20 border-cyan-500/20',
];

const ICON_COLORS = [
  'text-blue-400', 'text-purple-400', 'text-emerald-400',
  'text-amber-400', 'text-rose-400', 'text-cyan-400',
];

function CareerCard({ goal, index }) {
  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const col  = ICON_COLORS[index % ICON_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`glass rounded-2xl overflow-hidden flex flex-col bg-gradient-to-br border hover:scale-[1.02] transition-all duration-300 group ${grad}`}
    >
      {/* Icon area */}
      <div className="p-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0`}>
          <Target size={28} className={col} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${col}`}>Career Path</p>
          <h3 className="font-display font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-blue-200 transition-colors">
            {goal.title || goal.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <div className="px-6 pb-4">
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
            {goal.description}
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto p-6 pt-2">
        <Link
          to={`/learn/${goal.id}`}
          className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl"
        >
          <Zap size={14} /> Start Learning
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/5 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-white/10 rounded w-1/3" />
          <div className="h-5 bg-white/10 rounded w-3/4" />
        </div>
      </div>
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
      <div className="h-10 bg-white/10 rounded-xl mt-4" />
    </div>
  );
}

export default function Courses() {
  const [goals,   setGoals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCareerGoals();
      setGoals(res.data || []);
    } catch (err) {
      setError('Could not load courses. Please try again.');
      console.error('Courses fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Courses">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">📚 Career Learning Paths</h2>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? 'Loading courses...' : `${goals.length} career path${goals.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="glass p-6 rounded-2xl border border-red-500/20 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={fetchGoals} className="btn-secondary text-sm px-4 py-2">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : goals.length > 0 ? (
            goals.map((goal, i) => <CareerCard key={goal.id} goal={goal} index={i} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <BookOpen size={36} className="text-blue-400/50" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">No Courses Available Yet</h3>
              <p className="text-slate-500 text-sm max-w-md">
                Courses will appear here once an admin adds career goals. Check back soon!
              </p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
