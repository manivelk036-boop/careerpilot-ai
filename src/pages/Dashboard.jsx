import Layout from '../components/Layout';
import { useState } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { ProgressRing, StatCard, XPBar, Badge } from '../components/UIComponents';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { careerPaths } from '../data/careers';
import { badges as allBadges } from '../data/badges';
import { getLevelInfo, levels } from '../data/students';
import { Flame, Zap, Trophy, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const weeklyProgress = [
  { day: 'Mon', xp: 450, topics: 2 },
  { day: 'Tue', xp: 320, topics: 1 },
  { day: 'Wed', xp: 0, topics: 0 },
  { day: 'Thu', xp: 580, topics: 3 },
  { day: 'Fri', xp: 420, topics: 2 },
  { day: 'Sat', xp: 720, topics: 4 },
  { day: 'Sun', xp: 250, topics: 1 },
];

const tasksByGoal = {
  'java-developer': [
    { title: 'Complete Java OOP Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Watch Spring Boot Intro Video', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Submit Mini Project: Library System', xp: 200, type: 'project', urgent: false, to: '/learning' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
  'python-developer': [
    { title: 'Complete Python Functions Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Watch Python OOP Tutorial', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Submit Mini Project: To-Do App', xp: 200, type: 'project', urgent: false, to: '/learning' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
  'data-analyst': [
    { title: 'Complete SQL Basics Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Watch Pandas Crash Course', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Submit Dashboard Project', xp: 200, type: 'project', urgent: false, to: '/learning' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
  'ai-engineer': [
    { title: 'Complete ML Concepts Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Watch Neural Networks Video', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Submit Sentiment Analysis Project', xp: 200, type: 'project', urgent: false, to: '/learning' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
  'uiux-designer': [
    { title: 'Complete Design Principles Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Watch Figma Basics Tutorial', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Submit Mobile App Wireframe', xp: 200, type: 'project', urgent: false, to: '/learning' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
  'default': [
    { title: 'Complete Your First Quiz', xp: 50, type: 'quiz', urgent: true, to: '/quiz' },
    { title: 'Start Today\'s Learning Topic', xp: 15, type: 'video', urgent: false, to: '/learning' },
    { title: 'Take a Mock Interview', xp: 150, type: 'project', urgent: false, to: '/interview' },
    { title: 'Daily Aptitude Practice', xp: 30, type: 'aptitude', urgent: false, to: '/aptitude' },
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [
    completedTasks, setCompletedTasks
  ] = useState([]);
  const [
    checkedInToday, setCheckedInToday
  ] = useState(() => {
    const lastCheck = localStorage.getItem('careerpilot_last_checkin');
    return lastCheck === new Date().toDateString();
  });

  const {
    name, xp, coins, streak, placementScore, placementBreakdown,
    topicsCompleted, badges, careerGoal, getCurrentLevel, getNextLevel, getXPProgress,
    incrementStreak, addXP, addCoins,
  } = useStudentStore();

  const level = getCurrentLevel();
  const nextLevel = getNextLevel();
  const xpProgress = getXPProgress();
  const career = careerPaths.find(c => c.id === careerGoal);

  const radarData = [
    { subject: 'Technical', A: placementBreakdown.technical, fullMark: 100 },
    { subject: 'Communication', A: placementBreakdown.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: placementBreakdown.problemSolving, fullMark: 100 },
    { subject: 'Interview', A: placementBreakdown.interviewReadiness, fullMark: 100 },
    { subject: 'Projects', A: placementBreakdown.projects, fullMark: 100 },
    { subject: 'Aptitude', A: placementBreakdown.aptitude, fullMark: 100 },
  ];

  const recentBadges = allBadges.filter(b => badges.includes(b.id)).slice(0, 4);

  const upcomingTasks = (tasksByGoal[careerGoal] || tasksByGoal['default']).filter(
    (_, i) => !completedTasks.includes(i)
  );

  const handleCheckInToday = () => {
    if (checkedInToday) {
      toast('Already checked in today! Come back tomorrow 🔥', { icon: '✅' });
      return;
    }
    incrementStreak();
    addXP(25);
    addCoins(10);
    setCheckedInToday(true);
    localStorage.setItem('careerpilot_last_checkin', new Date().toDateString());
    toast.success(`Day ${streak + 1} streak! +25 XP +10 🪙`, { icon: '🔥' });
  };

  const handleTaskClick = (task) => {
    navigate(task.to);
  };

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(40px)' }} />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">👋 Good morning</p>
              <h2 className="font-display font-bold text-2xl text-white">{name}!</h2>
              <p className="text-slate-400 text-sm mt-1">
                {career ? `${career.icon} ${career.title} Path` : 'Start your journey today'}
                {' · '}
                <span className="text-amber-400">🔥 {streak} day streak</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* Placement Score Ring */}
              <div className="text-center">
                <ProgressRing value={placementScore} size={100} color="#3B82F6" sublabel="/100" />
                <p className="text-xs text-slate-400 mt-1">Placement Score</p>
              </div>
              {/* Level */}
              <div className="text-center">
                <div className="text-5xl mb-1 animate-float">{level.icon}</div>
                <p className="text-xs font-bold text-white">{level.title}</p>
                <p className="text-xs text-slate-500">Level {level.level}</p>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          {nextLevel && (
            <div className="mt-4 relative z-10">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span className="text-slate-300">{level.icon} {level.title}</span>
                <span>{nextLevel.icon} {nextLevel.title}</span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{xp.toLocaleString()} / {nextLevel.minXP.toLocaleString()} XP</p>
            </div>
          )}
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Zap size={18} className="text-blue-400" />, label: 'Total XP', value: xp.toLocaleString(), subtitle: `Level ${level.level}`, color: '#3B82F6' },
            { icon: <span className="text-lg">🪙</span>, label: 'Career Coins', value: coins.toLocaleString(), subtitle: 'Earned from tasks', color: '#F59E0B' },
            { icon: <Flame size={18} className="text-orange-400" />, label: 'Current Streak', value: `${streak} days`, subtitle: 'Keep it going!', color: '#F97316' },
            { icon: <BookOpen size={18} className="text-emerald-400" />, label: 'Topics Done', value: topicsCompleted.length, subtitle: 'Keep learning', color: '#10B981' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weekly Activity Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-white">Weekly XP Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your learning consistency this week</p>
              </div>
              <span className="text-xs font-medium text-emerald-400 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)' }}>
                +2,740 XP this week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Line type="monotone" dataKey="xp" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6, fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Streak Tracker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Study Streak</h3>
            <div className="text-center mb-4">
              <span className="text-6xl animate-pulse-slow">🔥</span>
              <p className="font-display font-bold text-4xl text-white mt-2">{streak}</p>
              <p className="text-slate-500 text-sm">Day Streak</p>
            </div>
            {/* Streak grid — today is always cell 0 (leftmost) */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {Array.from({ length: 28 }, (_, i) => {
                const isToday = i === 0;
                const isActive = i > 0 && i <= Math.min(streak, 27);
                return (
                  <div key={i} className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background: isToday
                        ? checkedInToday
                          ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                          : 'rgba(245,158,11,0.2)'
                        : isActive ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.05)',
                      boxShadow: isToday && checkedInToday ? '0 0 8px rgba(245,158,11,0.5)' : undefined,
                      border: isToday ? '1px solid rgba(245,158,11,0.5)' : 'none',
                    }}>
                    {isToday && <span className="text-xs">{checkedInToday ? '🔥' : '+'}</span>}
                  </div>
                );
              })}
            </div>
            {/* Check in button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckInToday}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 flex items-center justify-center gap-2 transition-all ${
                checkedInToday
                  ? 'text-emerald-400 cursor-default'
                  : 'btn-primary'
              }`}
              style={checkedInToday ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              {checkedInToday ? <><CheckCircle2 size={16} /> Checked In Today!</> : <><Flame size={16} /> Check In Today (+25 XP)</>}
            </motion.button>
            <div className="space-y-2">
              {[{ milestone: '7 days', reward: '+100 Coins', reached: streak >= 7 }, { milestone: '30 days', reward: '+500 XP', reached: streak >= 30 }, { milestone: '100 days', reward: '💎 Legend Badge', reached: streak >= 100 }].map(m => (
                <div key={m.milestone} className="flex items-center justify-between text-xs">
                  <span className={m.reached ? 'text-emerald-400' : 'text-slate-600'}>
                    {m.reached ? '✓' : '○'} {m.milestone}
                  </span>
                  <span className={m.reached ? 'text-emerald-400' : 'text-slate-600'}>{m.reward}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Placement Score Radar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Placement Score</h3>
              <Link to="/placement-score" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Details <ArrowRight size={12} />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="font-display font-bold text-3xl gradient-text">{placementScore}/100</span>
              <p className="text-xs text-slate-500">Overall Placement Score</p>
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Today's Tasks</h3>
              <span className="text-xs font-medium text-blue-400 px-2 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)' }}>
                {upcomingTasks.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-sm font-semibold text-emerald-400">All tasks done for today!</p>
                  <p className="text-xs text-slate-500">Come back tomorrow for new tasks.</p>
                </div>
              ) : upcomingTasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-white/5 active:scale-98"
                  style={{ background: 'rgba(255,255,255,0.04)', border: task.urgent ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                    style={{ background: task.type === 'quiz' ? 'rgba(139,92,246,0.2)' : task.type === 'project' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)' }}>
                    {task.type === 'quiz' ? '🧩' : task.type === 'project' ? '🚀' : task.type === 'video' ? '🎬' : '🔢'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{task.title}</p>
                    {task.urgent && <p className="text-xs text-red-400">⚡ Priority</p>}
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex-shrink-0">+{task.xp}XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Recent Badges</h3>
              <Link to="/profile" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentBadges.length > 0 ? recentBadges.map(badge => (
                <Badge key={badge.id} icon={badge.icon} title={badge.title} rarity={badge.rarity} size="sm" />
              )) : (
                <div className="col-span-2 text-center py-6">
                  <p className="text-slate-600 text-sm">Complete tasks to earn badges!</p>
                </div>
              )}
            </div>
            {recentBadges.length > 0 && (
              <div className="mt-3 p-3 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p className="text-xs text-amber-400 font-medium">🏆 {badges.length} badges earned</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass p-6">
          <h3 className="font-display font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/roadmap', icon: '🗺️', label: 'View Roadmap', color: 'from-blue-500 to-blue-700' },
              { to: '/quiz', icon: '🧩', label: 'Take Quiz', color: 'from-purple-500 to-purple-700' },
              { to: '/interview', icon: '🎤', label: 'Mock Interview', color: 'from-emerald-500 to-emerald-700' },
              { to: '/resume', icon: '📄', label: 'Analyze Resume', color: 'from-orange-500 to-orange-700' },
            ].map(action => (
              <Link key={action.to} to={action.to}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-3xl">{action.icon}</span>
                  <span className="text-xs font-medium text-slate-300 text-center">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
