import { motion } from 'framer-motion';

export function ProgressRing({ value = 0, size = 120, strokeWidth = 10, color = '#3B82F6', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Colored ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-white" style={{ fontSize: size * 0.18 }}>{value}</span>
          {sublabel && <span className="text-slate-500" style={{ fontSize: size * 0.1 }}>{sublabel}</span>}
        </div>
      </div>
      {label && <p className="mt-2 text-xs font-medium text-slate-400">{label}</p>}
    </div>
  );
}

export function XPBar({ current, max, className = '' }) {
  const percent = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{current.toLocaleString()} XP</span>
        <span>{max.toLocaleString()} XP</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill xp-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-right text-emerald-400">{percent}% to next level</p>
    </div>
  );
}

export function StatCard({ icon, label, value, subtitle, color = '#3B82F6', className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`stat-card ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
        <span className="text-2xl font-display font-bold text-white">{value}</span>
      </div>
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

export function GlassCard({ children, className = '', hover = false, onClick }) {
  return (
    <div
      className={`${hover ? 'glass-hover' : 'glass'} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {children}
    </div>
  );
}

export function Badge({ icon, title, rarity = 'common', locked = false, size = 'md' }) {
  const sizes = { sm: 'p-3 gap-1.5', md: 'p-4 gap-2', lg: 'p-6 gap-3' };
  const iconSizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' };
  const textSizes = { sm: 'text-xs', md: 'text-xs', lg: 'text-sm' };

  const rarityStyles = {
    common: { border: 'rgba(148,163,184,0.2)', glow: 'rgba(148,163,184,0.1)' },
    rare: { border: 'rgba(59,130,246,0.3)', glow: 'rgba(59,130,246,0.15)' },
    epic: { border: 'rgba(139,92,246,0.3)', glow: 'rgba(139,92,246,0.15)' },
    legendary: { border: 'rgba(245,158,11,0.4)', glow: 'rgba(245,158,11,0.2)' },
  };

  const style = rarityStyles[rarity];

  return (
    <motion.div
      whileHover={!locked ? { y: -4, scale: 1.02 } : {}}
      className={`achievement-badge ${locked ? 'locked' : ''} ${sizes[size]}`}
      style={{ border: `1px solid ${style.border}`, background: style.glow }}
    >
      <span className={iconSizes[size]}>{icon}</span>
      <p className={`font-semibold text-center text-slate-200 leading-tight ${textSizes[size]}`}>{title}</p>
      {!locked && rarity !== 'common' && (
        <span className={`${textSizes[size]} font-medium capitalize`}
          style={{ color: style.border }}>
          {rarity}
        </span>
      )}
    </motion.div>
  );
}

export function XPPopup({ amount, visible }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.8 }}
      animate={{ opacity: 1, y: -40, scale: 1 }}
      exit={{ opacity: 0, y: -80 }}
      className="pointer-events-none text-emerald-400 font-bold text-lg"
    >
      +{amount} XP ⚡
    </motion.div>
  );
}

export function SkillChip({ skill, level = null }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-300"
      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
      {skill}
      {level && <span className="text-slate-500">· {level}</span>}
    </span>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display font-bold text-white text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
