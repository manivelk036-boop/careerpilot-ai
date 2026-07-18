import { Link, useLocation } from 'react-router-dom';
import { useStudentStore } from '../store/useStudentStore';
import { getLevelInfo } from '../data/students';
import {
  LayoutDashboard, Map, BookOpen, Brain, FileText,
  Mic, Building2, TrendingUp, Trophy, User, Settings,
  Zap, Target, ChevronLeft, ChevronRight, Flame, BarChart3, Shield
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/roadmap', icon: Map, label: 'My Roadmap' },
  { path: '/quiz', icon: Brain, label: 'Assessments' },
  { path: '/aptitude', icon: Target, label: 'Aptitude' },
  { path: '/placement-score', icon: BarChart3, label: 'Placement Score' },
  { path: '/resume', icon: FileText, label: 'Resume Analyzer' },
  { path: '/interview', icon: Mic, label: 'Mock Interview' },
  { path: '/companies', icon: Building2, label: 'Company Match' },
  { path: '/salary', icon: TrendingUp, label: 'Salary Predictor' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/admin', icon: Shield, label: 'LMS Admin' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { xp, streak, name } = useStudentStore();
  const level = getLevelInfo(xp);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        background: 'rgba(5, 9, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-display font-bold text-white text-sm leading-none">CareerPilot</p>
              <p className="text-xs text-blue-400 font-medium">AI Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-bold text-amber-400">{streak} Day Streak</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-2 space-y-0.5">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 border-t border-white/5"
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{name || 'Student'}</p>
                <p className="text-xs text-slate-500">{level.icon} {level.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
