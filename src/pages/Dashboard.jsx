import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { ProgressRing, StatCard, XPBar, Badge } from '../components/UIComponents';
import { BarChart, Bar, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { careerPaths } from '../data/careers';
import { badges as allBadges } from '../data/badges';
import { getLevelInfo, levels } from '../data/students';
import { Flame, Zap, Trophy, BookOpen, ArrowRight, CheckCircle2, Award, Calendar, Star, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to get default weekly XP history if not present
const getDefaultXPHistory = () => {
  return [
    { day: 'Mon', xp: 240 },
    { day: 'Tue', xp: 380 },
    { day: 'Wed', xp: 150 },
    { day: 'Thu', xp: 420 },
    { day: 'Fri', xp: 310 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 0 }
  ];
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  const {
    name, xp, coins, streak, placementScore, placementBreakdown,
    topicsCompleted, badges, careerGoal, getCurrentLevel, getNextLevel, getXPProgress,
    incrementStreak, addXP, addCoins, mockInterviewsDone
  } = useStudentStore();

  const level = getCurrentLevel();
  const nextLevel = getNextLevel();
  const xpProgress = getXPProgress();
  const career = careerPaths.find(c => c.id === careerGoal) || careerPaths[0];

  // 1. Weekly XP Activity state
  const [xpHistory, setXPHistory] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem('careerpilot_xp_history');
    if (saved) {
      setXPHistory(JSON.parse(saved));
    } else {
      const initial = getDefaultXPHistory();
      localStorage.setItem('careerpilot_xp_history', JSON.stringify(initial));
      setXPHistory(initial);
    }
  }, [xp]);

  // Helper to safely reward XP & update weekly chart
  const rewardXPAndCoins = (xpAmount, coinAmount, message) => {
    addXP(xpAmount);
    addCoins(coinAmount);
    
    // Update local history
    const saved = localStorage.getItem('careerpilot_xp_history');
    let history = saved ? JSON.parse(saved) : getDefaultXPHistory();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[new Date().getDay()];
    
    const dayObj = history.find(h => h.day === todayStr);
    if (dayObj) {
      dayObj.xp += xpAmount;
    } else {
      history.push({ day: todayStr, xp: xpAmount });
      if (history.length > 7) history.shift();
    }
    localStorage.setItem('careerpilot_xp_history', JSON.stringify(history));
    setXPHistory(history);
    
    toast.success(`${message} (+${xpAmount} XP, +${coinAmount} 🪙)`, { icon: '🎉' });
  };

  // 2. Today's Tasks based on roadmap & career goal
  const [completedTasks, setCompletedTasks] = useState([]);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  // Generate 5 dynamic daily tasks based on career goal and current progress
  const dailyTasks = [
    { id: 0, title: `Study next topic in ${career.title}`, xp: 40, type: 'video', to: '/learning' },
    { id: 1, title: `Pass topic baseline quiz`, xp: 50, type: 'quiz', to: '/roadmap' },
    { id: 2, title: `Solve a quantitative aptitude set`, xp: 30, type: 'aptitude', to: '/aptitude' },
    { id: 3, title: `Complete a Mock Interview session`, xp: 100, type: 'interview', to: '/interview' },
    { id: 4, title: `Analyze and optimize resume`, xp: 40, type: 'resume', to: '/resume' }
  ];

  useEffect(() => {
    const todayKey = `completed_tasks_${new Date().toDateString()}`;
    const saved = localStorage.getItem(todayKey);
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
    
    const claimedKey = `daily_bonus_claimed_${new Date().toDateString()}`;
    setBonusClaimed(localStorage.getItem(claimedKey) === 'true');
  }, []);

  const toggleTask = (taskId, taskXP) => {
    let newCompleted;
    if (completedTasks.includes(taskId)) {
      newCompleted = completedTasks.filter(id => id !== taskId);
    } else {
      newCompleted = [...completedTasks, taskId];
      // Reward individual task XP
      rewardXPAndCoins(taskXP, 5, `Completed Daily Task!`);
    }
    setCompletedTasks(newCompleted);
    const todayKey = `completed_tasks_${new Date().toDateString()}`;
    localStorage.setItem(todayKey, JSON.stringify(newCompleted));

    // Check for 5/5 completed bonus
    if (newCompleted.length === 5 && !bonusClaimed) {
      setBonusClaimed(true);
      const claimedKey = `daily_bonus_claimed_${new Date().toDateString()}`;
      localStorage.setItem(claimedKey, 'true');
      setTimeout(() => {
        rewardXPAndCoins(150, 50, `Completed all Daily Tasks! Daily Bonus unlocked!`);
      }, 1000);
    }
  };

  // 3. Weekly Leaderboard
  const leaderBoard = [
    { rank: 1, name: 'Rohan Sharma', xp: 14850, avatar: '👑' },
    { rank: 2, name: 'Priya Patel', xp: 13200, avatar: '🥈' },
    { rank: 3, name: 'You (' + name + ')', xp: xp, avatar: '🥉', isUser: true },
    { rank: 4, name: 'Amit Verma', xp: 11100, avatar: '⚡' },
    { rank: 5, name: 'Sneha Reddy', xp: 9800, avatar: '🎓' }
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  // 4. Weekly Challenges & Rewards
  const weeklyChallenges = [
    { id: 'chal-1', title: 'Aptitude Master', desc: 'Complete 3 Aptitude Tests', target: 3, current: Math.min(3, Math.floor(xp / 500)), xp: 150, coins: 50 },
    { id: 'chal-2', title: 'Interview Pro', desc: 'Perform 2 Mock Interviews', target: 2, current: Math.min(2, mockInterviewsDone), xp: 200, coins: 100 },
    { id: 'chal-3', title: 'Roadmap Explorer', desc: 'Complete 4 learning topics', target: 4, current: Math.min(4, topicsCompleted.length), xp: 250, coins: 120 }
  ];

  const claimChallenge = (challenge) => {
    const claimedKey = `weekly_claimed_${challenge.id}`;
    if (localStorage.getItem(claimedKey) === 'true') {
      toast('Challenge reward already claimed!', { icon: '✅' });
      return;
    }
    localStorage.setItem(claimedKey, 'true');
    rewardXPAndCoins(challenge.xp, challenge.coins, `Claimed "${challenge.title}" reward!`);
  };

  const isChallengeClaimed = (id) => localStorage.getItem(`weekly_claimed_${id}`) === 'true';

  // Total XP earned calculation
  const totalWeeklyXP = xpHistory.reduce((sum, item) => sum + item.xp, 0);

  const [checkedInToday, setCheckedInToday] = useState(() => {
    const lastCheck = localStorage.getItem('careerpilot_last_checkin');
    return lastCheck === new Date().toDateString();
  });

  const handleCheckInToday = () => {
    if (checkedInToday) {
      toast('Already checked in today! Come back tomorrow 🔥', { icon: '✅' });
      return;
    }
    incrementStreak();
    setCheckedInToday(true);
    localStorage.setItem('careerpilot_last_checkin', new Date().toDateString());
    rewardXPAndCoins(25, 10, `Day ${streak + 1} streak check-in!`);
  };

  const recentBadges = allBadges.filter(b => badges.includes(b.id)).slice(0, 4);

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
              <p className="text-blue-400 text-sm font-medium mb-1">Welcome back,</p>
              <h2 className="font-display font-bold text-2xl text-white">{name}!</h2>
              <p className="text-slate-400 text-sm mt-1">
                {career ? `${career.icon} ${career.title} Goal` : 'Start your journey today'}
                {' · '}
                <span className="text-amber-400">🔥 {streak} Day Streak</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <ProgressRing value={placementScore} size={100} color="#3B82F6" sublabel="/100" />
                <p className="text-xs text-slate-400 mt-1">Placement Score</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-1 animate-bounce-slow">{level.icon}</div>
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

        {/* Main Grid: Weekly XP Activity & Streak */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weekly XP Activity Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-white">Weekly XP Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your daily progress over the last 7 days</p>
              </div>
              <span className="text-xs font-medium text-emerald-400 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)' }}>
                +{totalWeeklyXP} XP earned this week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={xpHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Bar dataKey="xp" fill="url(#colorXP)" radius={[4, 4, 0, 0]}>
                  {xpHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.xp > 0 ? '#3B82F6' : 'rgba(255,255,255,0.05)'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Streak Tracker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Daily Check-In</h3>
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
          </motion.div>
        </div>

        {/* Dynamic Daily Tasks & Leaderboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Today's Tasks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-white">Today's Tasks</h3>
                <p className="text-xs text-slate-500 mt-0.5">Complete tasks to earn XP and Coins</p>
              </div>
              <span className="text-xs font-semibold text-blue-400 px-2 py-1 rounded-lg bg-blue-500/10">
                {completedTasks.length}/5 completed ({Math.round((completedTasks.length / 5) * 100)}%)
              </span>
            </div>

            <div className="space-y-3">
              {dailyTasks.map((task) => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{
                      background: isDone ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
                      border: isDone ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id, task.xp)}
                        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                          isDone ? 'bg-emerald-500' : 'border-2 border-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {isDone && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <div className="min-w-0">
                        <Link to={task.to} className={`text-xs font-medium block truncate hover:text-blue-400 transition-colors ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </Link>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{task.type}</span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold flex-shrink-0">+{task.xp} XP</span>
                  </div>
                );
              })}
            </div>

            {completedTasks.length === 5 && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 p-3 rounded-xl text-center bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-400 font-semibold">🎉 All tasks done! Bonus +150 XP +50 Coins earned!</p>
              </motion.div>
            )}
          </motion.div>

          {/* Weekly Leaderboard */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Weekly Leaderboard</h3>
              <span className="text-xs font-medium text-slate-500">Updates hourly</span>
            </div>
            <div className="space-y-3">
              {leaderBoard.map((u) => (
                <div key={u.name} className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{
                    background: u.isUser ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: u.isUser ? '1px solid rgba(59,130,246,0.2)' : 'none'
                  }}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-4">{u.rank}</span>
                    <span className="text-lg">{u.avatar}</span>
                    <span className={`text-xs font-semibold ${u.isUser ? 'text-blue-400' : 'text-slate-300'}`}>{u.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{u.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Challenges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Weekly Challenges</h3>
            <div className="space-y-4">
              {weeklyChallenges.map((c) => {
                const completed = c.current >= c.target;
                const claimed = isChallengeClaimed(c.id);
                return (
                  <div key={c.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white">{c.title}</h4>
                        <p className="text-[10px] text-slate-500">{c.desc}</p>
                      </div>
                      {completed ? (
                        <button
                          onClick={() => claimChallenge(c)}
                          disabled={claimed}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                            claimed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-emerald-500 hover:bg-emerald-600 text-white animate-bounce-slow'
                          }`}
                        >
                          {claimed ? 'Claimed ✓' : 'Claim'}
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500">{c.current}/{c.target}</span>
                      )}
                    </div>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-fill" style={{ width: `${(c.current / c.target) * 100}%`, backgroundColor: completed ? '#10B981' : undefined }} />
                    </div>
                    <div className="flex gap-2 text-[9px] text-slate-500">
                      <span>⚡ +{c.xp} XP</span>
                      <span>🪙 +{c.coins} Coins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Recent Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="lg:col-span-2 glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: '/roadmap', icon: '🗺️', label: 'View Roadmap' },
                { to: '/quiz', icon: '🧩', label: 'Take Quiz' },
                { to: '/interview', icon: '🎤', label: 'Mock Interview' },
                { to: '/resume', icon: '📄', label: 'Analyze Resume' },
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

          {/* Recent Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass p-6">
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
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
