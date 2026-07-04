import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import { careerPaths } from '../data/careers';
import { Check, TrendingUp, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CareerGoal() {
  const [selected, setSelected] = useState(null);
  const { setCareerGoal } = useStudentStore();
  const navigate = useNavigate();

  const handleSelect = () => {
    if (!selected) return;
    setCareerGoal(selected);
    toast.success(`${careerPaths.find(c => c.id === selected)?.title} path selected! 🎯`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen py-12 px-4 relative" style={{ background: '#050912' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(120px)', transform: 'translateX(-50%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-blue-400 mb-4"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            ✨ AI Roadmap Generator
          </motion.div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Choose Your <span className="gradient-text">Career Path</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select your dream career. Our AI will generate a personalized month-by-month roadmap tailored just for you.
          </p>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {careerPaths.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(career.id)}
              className="relative cursor-pointer group"
            >
              <div
                className="glass p-5 h-full transition-all duration-300 relative overflow-hidden"
                style={{
                  border: selected === career.id
                    ? '1px solid rgba(59,130,246,0.6)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: selected === career.id
                    ? 'rgba(59,130,246,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  transform: selected === career.id ? 'translateY(-4px)' : undefined,
                  boxShadow: selected === career.id ? '0 0 30px rgba(59,130,246,0.2)' : undefined,
                }}
              >
                {/* Selected check */}
                {selected === career.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                    <Check size={12} className="text-white" />
                  </motion.div>
                )}

                {/* Gradient blob */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 bg-gradient-to-br ${career.color}`} style={{ filter: 'blur(20px)' }} />

                <div className="text-4xl mb-3">{career.icon}</div>
                <h3 className="font-display font-bold text-white text-sm mb-1">{career.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{career.description}</p>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrendingUp size={11} className="text-emerald-400" />
                    <span>{career.avgSalary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={11} className="text-blue-400" />
                    <span>{career.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users size={11} className="text-purple-400" />
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${career.demand === 'Extremely High' ? 'text-red-400' : career.demand === 'Very High' ? 'text-orange-400' : 'text-emerald-400'}`}
                      style={{ background: career.demand === 'Extremely High' ? 'rgba(239,68,68,0.1)' : career.demand === 'Very High' ? 'rgba(249,115,22,0.1)' : 'rgba(16,185,129,0.1)' }}>
                      {career.demand}
                    </span>
                  </div>
                </div>

                {/* Skills preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {career.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded text-blue-300"
                      style={{ background: 'rgba(59,130,246,0.1)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-4"
            >
              <p className="text-slate-400 text-sm">
                Selected: <span className="text-white font-semibold">{careerPaths.find(c => c.id === selected)?.title}</span>
              </p>
              <button
                onClick={handleSelect}
                className="btn-primary px-10 py-4 text-base flex items-center gap-3"
              >
                <span>Generate My AI Roadmap</span>
                <span className="text-xl">🗺️</span>
              </button>
            </motion.div>
          )}
          {!selected && (
            <p className="text-slate-600 text-sm">👆 Select a career path to continue</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
