import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Target, ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const scoreColor = (s) => s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';

const improvementTips = {
  technical: ['Complete more coding topics', 'Build 2+ projects', 'Solve DSA problems daily'],
  communication: ['Practice mock interviews', 'Record yourself speaking', 'Join English speaking club'],
  problemSolving: ['Solve 1 LeetCode daily', 'Practice aptitude tests', 'Try competitive coding'],
  interviewReadiness: ['Complete 5 mock interviews', 'Study company-specific questions', 'Record and review answers'],
  projects: ['Add 2 more projects to GitHub', 'Deploy a project online', 'Add project documentation'],
  aptitude: ['Practice 20 quant problems/day', 'Work on time management', 'Study reasoning patterns'],
  certifications: ['Earn a relevant certification', 'Add to LinkedIn profile'],
  internship: ['Apply for internships', 'Work on freelance projects', 'Contribute to open source'],
};

export default function PlacementScore() {
  const { placementScore, placementBreakdown, updatePlacementScore } = useStudentStore();

  const radarData = [
    { subject: 'Technical', A: placementBreakdown.technical },
    { subject: 'Communication', A: placementBreakdown.communication },
    { subject: 'Problem Solving', A: placementBreakdown.problemSolving },
    { subject: 'Interview', A: placementBreakdown.interviewReadiness },
    { subject: 'Projects', A: placementBreakdown.projects },
    { subject: 'Aptitude', A: placementBreakdown.aptitude },
    { subject: 'Certs', A: placementBreakdown.certifications },
    { subject: 'Internship', A: placementBreakdown.internship },
  ];

  const barData = Object.entries(placementBreakdown).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    score: value,
    fill: scoreColor(value),
  }));

  const weakAreas = Object.entries(placementBreakdown)
    .filter(([, v]) => v < 70)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3);

  const strengthAreas = Object.entries(placementBreakdown)
    .filter(([, v]) => v >= 70)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const scoreLevel = placementScore >= 85 ? { label: 'Excellent', color: '#10B981', icon: '🏆' }
    : placementScore >= 70 ? { label: 'Good', color: '#3B82F6', icon: '🎯' }
    : placementScore >= 55 ? { label: 'Average', color: '#F59E0B', icon: '⚡' }
    : { label: 'Needs Work', color: '#EF4444', icon: '📚' };

  return (
    <Layout title="Placement Score">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Score Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-8"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.25)' }}>
          <div className="absolute right-8 top-8 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(40px)' }} />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Big Score Ring */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 140 140" className="rotate-[-90deg]">
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                <motion.circle
                  cx="70" cy="70" r="58" fill="none"
                  stroke={scoreColor(placementScore)} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - placementScore / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  style={{ filter: `drop-shadow(0 0 8px ${scoreColor(placementScore)}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-bold text-white">{placementScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{scoreLevel.icon}</span>
                <div>
                  <h2 className="font-display font-bold text-3xl text-white">Placement Score</h2>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${scoreLevel.color}20`, color: scoreLevel.color }}>
                    {scoreLevel.label}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Based on 8 key dimensions. Improve weak areas to unlock more company matches.
              </p>

              {/* Score bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Current: {placementScore}/100</span>
                  <span>Target: 85+</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${placementScore}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${scoreColor(placementScore)}, ${scoreColor(Math.min(100, placementScore + 20))})` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">0</span>
                  {[25, 50, 75, 100].map(m => (
                    <span key={m} className={`${placementScore >= m ? 'text-blue-400' : 'text-slate-700'}`}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Skills Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}/100`, 'Score']}
                />
                <Bar dataKey="score" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Weak & Strong Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Areas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">⚠️ Areas to Improve</h3>
            <div className="space-y-4">
              {weakAreas.map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm font-bold" style={{ color: scoreColor(value) }}>{value}/100</span>
                  </div>
                  <div className="progress-bar mb-2">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: scoreColor(value), transition: 'width 1s' }} />
                  </div>
                  <div className="space-y-1">
                    {(improvementTips[key] || []).slice(0, 2).map((tip, i) => (
                      <p key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="text-red-400">→</span> {tip}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strong Areas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">✅ Your Strengths</h3>
            <div className="space-y-4">
              {strengthAreas.map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm font-bold text-emerald-400">{value}/100</span>
                  </div>
                  <div className="progress-bar">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: '#10B981', transition: 'width 1s', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-xl mt-4" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-emerald-400 text-sm font-medium">💪 Keep maintaining your strengths!</p>
                <p className="text-slate-500 text-xs mt-1">Review these topics monthly to stay sharp.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Career Twin */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-display font-semibold text-white">AI Career Twin – Growth Predictions</h3>
              <p className="text-xs text-slate-500">See how completing specific actions will boost your score</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { action: 'Complete Spring Boot module', boost: '+12 pts', newScore: Math.min(100, placementScore + 12), icon: '☕' },
              { action: 'Do 5 Mock Interviews', boost: '+8 pts', newScore: Math.min(100, placementScore + 8), icon: '🎤' },
              { action: 'Add Internship', boost: '+15 pts', newScore: Math.min(100, placementScore + 15), icon: '🏢' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-emerald-400 font-bold text-lg">{item.boost}</span>
                </div>
                <p className="text-xs font-medium text-slate-300 mb-1">{item.action}</p>
                <p className="text-xs text-slate-500">New score: <span className="text-white font-semibold">{item.newScore}/100</span></p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-3">
          <Link to="/interview" className="btn-primary flex items-center gap-2"><span>🎤</span> Take Mock Interview</Link>
          <Link to="/aptitude" className="btn-secondary flex items-center gap-2"><span>🔢</span> Practice Aptitude</Link>
          <Link to="/companies" className="btn-secondary flex items-center gap-2"><span>🏢</span> View Company Matches</Link>
        </motion.div>
      </div>
    </Layout>
  );
}
