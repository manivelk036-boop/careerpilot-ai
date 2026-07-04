import { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Landmark, TrendingUp, Briefcase, Award } from 'lucide-react';

const salaryDataByRole = {
  se: {
    title: 'Software Engineer',
    base: 600000,
    growth: [
      { year: 'Entry', salary: 6.5 },
      { year: '2 Years', salary: 9.2 },
      { year: '5 Years', salary: 16.5 },
      { year: '8 Years', salary: 28.0 },
      { year: '10+ Years', salary: 42.0 },
    ],
    skillsFactor: { React: 0.1, 'Spring Boot': 0.12, SQL: 0.05, Java: 0.08, AI: 0.25 }
  },
  da: {
    title: 'Data Analyst',
    base: 500000,
    growth: [
      { year: 'Entry', salary: 5.2 },
      { year: '2 Years', salary: 7.8 },
      { year: '5 Years', salary: 13.0 },
      { year: '8 Years', salary: 21.0 },
      { year: '10+ Years', salary: 32.0 },
    ],
    skillsFactor: { React: 0.02, 'Spring Boot': 0.05, SQL: 0.15, Java: 0.05, AI: 0.20 }
  },
  pm: {
    title: 'Product Manager',
    base: 700000,
    growth: [
      { year: 'Entry', salary: 7.5 },
      { year: '2 Years', salary: 11.0 },
      { year: '5 Years', salary: 19.5 },
      { year: '8 Years', salary: 32.0 },
      { year: '10+ Years', salary: 50.0 },
    ],
    skillsFactor: { React: 0.05, 'Spring Boot': 0.05, SQL: 0.08, Java: 0.02, AI: 0.22 }
  }
};

export default function Salary() {
  const [role, setRole] = useState('se');
  const [experience, setExperience] = useState(0);
  const [skillsSelected, setSkillsSelected] = useState(['Java', 'SQL']);

  const roleInfo = salaryDataByRole[role];

  // Calculate salary estimation
  const baseSalary = roleInfo.base;
  const experienceMultiplier = 1 + experience * 0.15;
  const skillsMultiplier = 1 + skillsSelected.reduce((sum, skill) => sum + (roleInfo.skillsFactor[skill] || 0), 0);
  
  const estimatedAnnual = Math.round(baseSalary * experienceMultiplier * skillsMultiplier);
  const estimatedLPA = (estimatedAnnual / 100000).toFixed(1);

  // Growth projection data mapped for chart
  const chartData = roleInfo.growth.map(pt => {
    let multiplier = 1;
    if (pt.year === 'Entry') multiplier = 1;
    else if (pt.year === '2 Years') multiplier = 1.25;
    else if (pt.year === '5 Years') multiplier = 1.75;
    else if (pt.year === '8 Years') multiplier = 2.5;
    else multiplier = 3.5;
    
    const salaryVal = parseFloat((pt.salary * skillsMultiplier).toFixed(1));
    return { name: pt.year, Salary: salaryVal };
  });

  const toggleSkill = (skill) => {
    if (skillsSelected.includes(skill)) {
      setSkillsSelected(skillsSelected.filter(s => s !== skill));
    } else {
      setSkillsSelected([...skillsSelected, skill]);
    }
  };

  return (
    <Layout title="Salary Predictor">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Salary Growth Predictor</h2>
          <p className="text-slate-500 text-sm">Estimate starting package ranges and map career growth timelines based on core domain skills.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-1 glass p-6 space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Target Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
              >
                <option value="se">Software Engineer</option>
                <option value="da">Data Analyst</option>
                <option value="pm">Product Manager</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Experience: {experience} {experience === 1 ? 'Year' : 'Years'}
              </label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={experience} 
                onChange={(e) => setExperience(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-white/5 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Fresher</span>
                <span>5 Yrs</span>
                <span>10+ Yrs</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Boost Skills</label>
              <div className="flex flex-col gap-2">
                {Object.keys(roleInfo.skillsFactor).map(skill => {
                  const active = skillsSelected.includes(skill);
                  const boost = Math.round(roleInfo.skillsFactor[skill] * 100);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        active 
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{skill}</span>
                      <span className={active ? 'text-blue-400 font-bold' : 'text-slate-500'}>+{boost}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Outputs / Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Starter Package</p>
                <div className="flex items-baseline gap-2">
                  <Landmark size={24} className="text-emerald-400" />
                  <span className="text-4xl font-display font-bold text-white">₹{estimatedLPA}</span>
                  <span className="text-lg font-bold text-slate-500">LPA</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                <TrendingUp size={22} className="text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Career Acceleration</p>
                  <p className="text-[10px] text-slate-500">Adding AI and database stacks boosts starting salaries by up to 40%.</p>
                </div>
              </div>
            </div>

            {/* Growth Graph */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white text-sm mb-4">Estimated Career Growth Path (LPA)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#3B82F6', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="Salary" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSalary)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
