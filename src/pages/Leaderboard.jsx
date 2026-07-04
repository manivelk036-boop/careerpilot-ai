import { useState } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { leaderboardData } from '../data/students';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Award } from 'lucide-react';

export default function Leaderboard() {
  const [tab, setTab] = useState('global');
  const { name, xp, coins, streak, college } = useStudentStore();

  // Create full list by injecting current user
  const currentUserRank = 6; // Mock rank for the user
  const currentUserObj = {
    rank: currentUserRank,
    name: name || 'You',
    college: college || 'Anna University',
    xp: xp,
    coins: coins,
    streak: streak,
    score: 82,
    career: 'Student',
    avatar: '🎯',
    level: Math.floor(xp / 5000) + 1
  };

  // Construct final leaderboard list
  let completeList = [...leaderboardData];
  
  // Replace rank 8 or insert current user if not already present
  const userIndex = completeList.findIndex(s => s.name === currentUserObj.name || s.name === 'You');
  if (userIndex !== -1) {
    completeList[userIndex] = currentUserObj;
  } else {
    // Inject at rank 8 for demo
    completeList.splice(7, 0, currentUserObj);
    // Re-adjust ranks
    completeList = completeList.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // Filter for college tab
  const displayList = tab === 'global' 
    ? completeList 
    : completeList.filter(s => s.college.toLowerCase().includes('anna') || s.name === currentUserObj.name);

  // Top 3 for podium
  const top1 = completeList[0];
  const top2 = completeList[1];
  const top3 = completeList[2];

  return (
    <Layout title="Leaderboard">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">Global Standings</h2>
            <p className="text-slate-500 text-sm">Compete with students globally and climb ranks by earning placement points.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
            <button 
              onClick={() => setTab('global')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === 'global' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Rank
            </button>
            <button 
              onClick={() => setTab('college')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === 'college' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              My College
            </button>
          </div>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-3 gap-4 items-end justify-center pt-8 max-w-2xl mx-auto text-center">
          {/* 2nd Place */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
            <span className="text-4xl mb-1">{top2.avatar}</span>
            <p className="text-xs font-bold text-white truncate max-w-[80px] md:max-w-none">{top2.name}</p>
            <p className="text-[10px] text-blue-400 font-medium">{top2.xp.toLocaleString()} XP</p>
            <div className="w-full h-24 mt-2 rounded-t-xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-center items-center">
              <span className="text-2xl font-black text-slate-400">2</span>
              <span className="text-[10px] text-slate-500 font-bold">SILVER</span>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center z-10">
            <Trophy className="text-yellow-400 w-6 h-6 mb-1 animate-bounce" />
            <span className="text-5xl mb-1">{top1.avatar}</span>
            <p className="text-sm font-black text-white truncate max-w-[100px] md:max-w-none">{top1.name}</p>
            <p className="text-xs text-amber-400 font-bold">{top1.xp.toLocaleString()} XP</p>
            <div className="w-full h-32 mt-2 rounded-t-xl bg-amber-500/10 border-t-2 border-x border-amber-500/30 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              <span className="text-4xl font-black text-amber-400">1</span>
              <span className="text-[10px] text-amber-500 font-bold">GOLD</span>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
            <span className="text-4xl mb-1">{top3.avatar}</span>
            <p className="text-xs font-bold text-white truncate max-w-[80px] md:max-w-none">{top3.name}</p>
            <p className="text-[10px] text-purple-400 font-medium">{top3.xp.toLocaleString()} XP</p>
            <div className="w-full h-20 mt-2 rounded-t-xl bg-orange-950/20 border border-orange-900/30 flex flex-col justify-center items-center">
              <span className="text-xl font-black text-orange-400">3</span>
              <span className="text-[10px] text-orange-500 font-bold">BRONZE</span>
            </div>
          </motion.div>
        </div>

        {/* List View */}
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-4 px-6 text-center">Rank</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">College</th>
                  <th className="py-4 px-6 text-center">Streak</th>
                  <th className="py-4 px-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayList.map((student) => {
                  const isSelf = student.name === name || student.name === 'You';
                  return (
                    <tr 
                      key={student.rank} 
                      className={`text-xs transition-colors ${
                        isSelf 
                        ? 'bg-blue-600/10 border-y border-blue-500/20' 
                        : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-4 px-6 text-center font-bold text-slate-400">
                        {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                      </td>
                      <td className="py-4 px-6 font-semibold text-white flex items-center gap-2">
                        <span className="text-lg">{student.avatar}</span>
                        <div>
                          <p>{student.name} {isSelf && <span className="text-[10px] text-blue-400 ml-1.5 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded-full border border-blue-500/20">YOU</span>}</p>
                          <p className="text-[9px] text-slate-500 font-normal">{student.career} · Lvl {student.level}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{student.college}</td>
                      <td className="py-4 px-6 text-center text-amber-500 font-bold flex items-center justify-center gap-1">
                        <Flame size={12} className="text-orange-500" /> {student.streak}d
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-white">
                        <span className="text-blue-400 mr-1"><Zap size={11} className="inline mb-0.5" /></span>
                        {student.xp.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
