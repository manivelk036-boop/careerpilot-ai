import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, TrendingUp, Award, X } from 'lucide-react';

// Generates random confetti pieces
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][Math.floor(Math.random() * 7)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, rotate: p.rotation, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotation + 360 * 3, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

/**
 * CelebrationModal
 * Props:
 *   show         – boolean
 *   onClose      – () => void
 *   score        – number (0-100)
 *   xpEarned     – number
 *   coinsEarned  – number
 *   leveledUp    – boolean
 *   oldLevel     – { level, title, icon }
 *   newLevel     – { level, title, icon }
 *   title        – string (e.g. "Quiz Complete!")
 *   type         – 'quiz' | 'aptitude' | 'interview'
 */
export default function CelebrationModal({
  show, onClose,
  score = 0, xpEarned = 0, coinsEarned = 0,
  leveledUp = false,
  oldLevel = null, newLevel = null,
  title = 'Congratulations!',
  type = 'quiz',
}) {
  const isGreat = score >= 70;
  const isGood = score >= 50;

  const emoji = isGreat ? '🏆' : isGood ? '⚡' : '📚';
  const label = isGreat ? 'Excellent Work!' : isGood ? 'Good Job!' : 'Keep Practicing!';
  const labelColor = isGreat ? '#10B981' : isGood ? '#F59E0B' : '#EF4444';
  const bgGlow = isGreat ? '#10B98120' : isGood ? '#F59E0B20' : '#EF444420';

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          {isGood && <Confetti />}

          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,9,18,0.85)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Card */}
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0D1526, #111827)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: `0 0 80px ${bgGlow}, 0 25px 60px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Header gradient bar */}
              <div className="h-1.5" style={{ background: `linear-gradient(to right, #3B82F6, #8B5CF6, #EC4899)` }} />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all z-10"
              >
                <X size={16} />
              </button>

              <div className="p-8 text-center">
                {/* Big emoji */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-7xl mb-4"
                >
                  {emoji}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="font-display font-bold text-2xl text-white mb-1"
                >
                  {title}
                </motion.h2>

                {/* Result label */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <span
                    className="text-sm font-semibold px-4 py-1.5 rounded-full"
                    style={{ background: `${labelColor}20`, color: labelColor, border: `1px solid ${labelColor}40` }}
                  >
                    {label}
                  </span>
                </motion.div>

                {/* Score */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.55, type: 'spring', stiffness: 200 }}
                  className="mt-6 mb-6"
                >
                  <div
                    className="text-8xl font-display font-black"
                    style={{ color: labelColor }}
                  >
                    {score}
                    <span className="text-3xl text-slate-500 font-bold">/100</span>
                  </div>
                </motion.div>

                {/* Rewards row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  <div className="rounded-2xl p-4" style={{ background: '#3B82F615', border: '1px solid #3B82F630' }}>
                    <Zap size={20} className="text-blue-400 mx-auto mb-1" />
                    <p className="font-display font-bold text-xl text-white">+{xpEarned}</p>
                    <p className="text-xs text-slate-500">XP Earned</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: '#F59E0B15', border: '1px solid #F59E0B30' }}>
                    <span className="text-xl block mb-1">🪙</span>
                    <p className="font-display font-bold text-xl text-white">+{coinsEarned}</p>
                    <p className="text-xs text-slate-500">Career Coins</p>
                  </div>
                </motion.div>

                {/* Level-Up Banner */}
                <AnimatePresence>
                  {leveledUp && newLevel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                      className="mb-6 rounded-2xl p-5 relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #8B5CF620, #3B82F620)', border: '1px solid #8B5CF650' }}
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, #8B5CF630, transparent 70%)' }} />

                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                        className="text-4xl mb-2"
                      >
                        🎊
                      </motion.div>
                      <p className="text-yellow-400 font-bold text-lg mb-1">LEVEL UP!</p>
                      <div className="flex items-center justify-center gap-3">
                        {oldLevel && (
                          <span className="text-slate-400 text-sm">
                            {oldLevel.icon} Lv.{oldLevel.level} {oldLevel.title}
                          </span>
                        )}
                        <TrendingUp size={16} className="text-purple-400" />
                        <span className="text-white font-bold text-sm">
                          {newLevel.icon} Lv.{newLevel.level} {newLevel.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">You've unlocked a new career rank! 🚀</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score Feedback Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="text-slate-400 text-sm mb-6"
                >
                  {isGreat
                    ? 'Outstanding performance! Your placement score has been updated. 🌟'
                    : isGood
                    ? 'Solid effort! Complete more tests to boost your placement score further.'
                    : 'Don\'t give up! Review the questions and try again to improve.'}
                </motion.p>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  onClick={onClose}
                  className="btn-primary w-full py-3 text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
                >
                  {isGreat ? 'Claim Rewards & Continue 🚀' : 'Continue Learning 📚'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
