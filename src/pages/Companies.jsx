import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStudentStore } from '../store/useStudentStore';
import { companies } from '../data/companies';
import { careerPaths } from '../data/careers';
import { Building2, TrendingUp, CheckCircle2, AlertCircle, ExternalLink, Filter } from 'lucide-react';

function getMatchScore(student, company) {
  let score = 70;
  if (student.cgpa >= company.minCGPA) score += 10;
  if (student.placementScore >= company.minPlacementScore) score += 10;
  if (company.domains.includes(student.careerGoal)) score += 5;
  const skillMatch = student.skills.filter(s => company.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))).length;
  score += skillMatch * 2;
  return Math.min(99, Math.max(40, score));
}

const typeColors = {
  Service: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  Product: { bg: 'rgba(139,92,246,0.1)', text: '#8B5CF6', border: 'rgba(139,92,246,0.3)' },
  FAANG: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  Startup: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', border: 'rgba(16,185,129,0.3)' },
  Consulting: { bg: 'rgba(236,72,153,0.1)', text: '#EC4899', border: 'rgba(236,72,153,0.3)' },
};

export default function Companies() {
  const student = useStudentStore();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match');

  const types = ['All', 'Service', 'Product', 'FAANG', 'Startup', 'Consulting'];

  const companiesWithMatch = companies.map(c => ({
    ...c,
    matchScore: getMatchScore(student, c),
  }));

  const filtered = companiesWithMatch
    .filter(c => filter === 'All' || c.type === filter)
    .sort((a, b) => sortBy === 'match' ? b.matchScore - a.matchScore : b.package.localeCompare(a.package));

  const eligible = filtered.filter(c => c.matchScore >= 70).length;

  return (
    <Layout title="Company Match">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Companies Analyzed', value: companies.length, icon: '🏢', color: '#3B82F6' },
            { label: 'Eligible Companies', value: eligible, icon: '✅', color: '#10B981' },
            { label: 'Your Score', value: `${student.placementScore}/100`, icon: '🎯', color: '#8B5CF6' },
            { label: 'CGPA', value: student.cgpa, icon: '🎓', color: '#F59E0B' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.icon}</span>
                <span className="font-display font-bold text-xl text-white">{s.value}</span>
              </div>
              <p className="text-xs text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="glass p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-400">Filter:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${filter === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={filter === t ? { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' } : { background: 'rgba(255,255,255,0.05)' }}>
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-slate-300 outline-none"
            >
              <option value="match" style={{ background: '#0A0F1E' }}>Match %</option>
              <option value="package" style={{ background: '#0A0F1E' }}>Package</option>
            </select>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((company, i) => {
            const typeStyle = typeColors[company.type] || typeColors.Service;
            const isEligible = company.matchScore >= 70;
            const gapSkills = company.skills.filter(s => !student.skills.some(ss => ss.toLowerCase().includes(s.toLowerCase())));

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="company-card"
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${company.color}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        {company.logo}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white">{company.name}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}` }}>
                          {company.type}
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right">
                      <div className="font-display font-bold text-xl" style={{ color: isEligible ? '#10B981' : '#F59E0B' }}>
                        {company.matchScore}%
                      </div>
                      <p className="text-xs text-slate-500">Match</p>
                    </div>
                  </div>

                  {/* Match bar */}
                  <div className="mb-4">
                    <div className="progress-bar mb-1" style={{ height: 6 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${company.matchScore}%` }}
                        transition={{ duration: 1, delay: i * 0.04 }}
                        className="h-full rounded-full"
                        style={{ background: isEligible ? '#10B981' : '#F59E0B', boxShadow: isEligible ? '0 0 8px rgba(16,185,129,0.4)' : undefined }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isEligible
                        ? <><CheckCircle2 size={12} className="text-emerald-400" /><span className="text-xs text-emerald-400">You're eligible!</span></>
                        : <><AlertCircle size={12} className="text-amber-400" /><span className="text-xs text-amber-400">Improve score to qualify</span></>
                      }
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Package</span>
                      <span className="text-white font-medium">{company.package}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Min CGPA</span>
                      <span className={`font-medium ${student.cgpa >= company.minCGPA ? 'text-emerald-400' : 'text-red-400'}`}>{company.minCGPA}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Difficulty</span>
                      <span className="text-slate-300">{company.difficulty}</span>
                    </div>
                  </div>

                  {/* Rounds */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Interview Rounds</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.rounds.map((r, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {i + 1}. {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gap */}
                  {gapSkills.length > 0 && (
                    <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <p className="text-xs text-red-400 font-medium mb-1">Skills to Learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {gapSkills.map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded text-red-300" style={{ background: 'rgba(239,68,68,0.1)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${isEligible ? 'btn-primary' : 'btn-secondary'}`}>
                    {isEligible ? <><ExternalLink size={14} /> Apply Now</> : <><TrendingUp size={14} /> Improve Score</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
