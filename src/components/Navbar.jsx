import { useStudentStore } from '../store/useStudentStore';
import { getLevelInfo } from '../data/students';
import { Bell, Search, Flame, Coins, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar({ title = 'Dashboard' }) {
  const { xp, coins, streak, getXPProgress } = useStudentStore();
  const level = getLevelInfo(xp);
  const xpProgress = getXPProgress();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New quiz available: Java Collections', time: '5m ago', icon: '🧩' },
    { id: 2, text: 'You earned the "Week Warrior" badge!', time: '1h ago', icon: '🏆' },
    { id: 3, text: 'Resume analysis complete - Score: 72/100', time: '2h ago', icon: '📄' },
    { id: 4, text: 'TCS campus drive in 7 days', time: '1d ago', icon: '🏢' },
  ];

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3"
      style={{
        left: 240,
        background: 'rgba(5, 9, 18, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'left 0.3s ease',
      }}
    >
      {/* Title */}
      <div>
        <h1 className="font-display font-bold text-white text-lg">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl flex-1 max-w-xs mx-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Search size={14} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search topics, companies..."
          className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="streak-badge hidden sm:flex">
          <Flame size={14} />
          <span>{streak}</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hidden sm:flex"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <span className="text-base">🪙</span>
          <span className="text-sm font-bold text-amber-400">{coins.toLocaleString()}</span>
        </div>

        {/* XP + Level */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-semibold">{xp.toLocaleString()} XP</span>
            </div>
            <span className="text-xs text-slate-500">{level.icon} {level.title}</span>
          </div>
          {/* XP mini bar */}
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full xp-fill"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
              style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
            >
              <div className="p-4 border-b border-white/5">
                <p className="text-sm font-semibold text-white">Notifications</p>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
                  <span className="text-xl">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                    <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
