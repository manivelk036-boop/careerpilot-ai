import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { careerPaths } from '../data/careers';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle2, Lock, ChevronDown, ChevronUp, PlayCircle, BookOpen, Code, Layers, Trophy, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const topicToIdMap = {
  'Variables & Data Types': 'java-variables',
  'Control Flow & Loops': 'java-loops',
  'Control Flow': 'java-loops',
  'Loops': 'java-loops',
  'Arrays & Strings': 'java-arrays',
  'Arrays': 'java-arrays',
  'OOP Concepts': 'java-oop-basics',
  'Classes & Objects': 'java-oop-basics',
  'Advanced Java': 'java-collections',
  'Collections Framework': 'java-collections',
  'SQL Basics': 'database-basics',
  
  // Python
  'Python Variables & Lists': 'python-variables',
  'Python Syntax': 'python-variables',
  'Control Flow & Comprehensions': 'python-loops',
  'Python Loops': 'python-loops',
  'Python Object-Oriented Programming': 'python-oop',
  'OOP in Python': 'python-oop',
  
  // UI/UX
  'Design Fundamentals': 'uiux-intro',
  'Introduction to Design Thinking': 'uiux-intro',
  'Typography & Color Theory': 'uiux-typography',
  'UI Design Tools': 'uiux-figma',
  'Figma & Auto Layout': 'uiux-figma',
  
  // Web basics
  'Web Fundamentals & HTML': 'web-basics',
  'HTML & CSS': 'web-basics',
  'SQL & Database Basics': 'database-basics',
  'Database': 'database-basics',
};

const getTopicId = (careerId, topic) => 
  topicToIdMap[topic] || `${careerId}-${topic.toLowerCase().replace(/\s+/g, '-')}`;

const getTopicUnlockStatus = (careerId, flatTopics, idx, topicsCompleted, quizScores) => {
  if (idx === 0) return { unlocked: true, reason: '' };
  
  const prevTopic = flatTopics[idx - 1];
  const prevTopicId = getTopicId(careerId, prevTopic);
  
  const isCompleted = topicsCompleted.includes(prevTopicId);
  const quizScore = quizScores[prevTopicId] || 0;
  const isPassed = quizScore >= 70;
  
  if (!isCompleted) {
    return { unlocked: false, reason: `🔒 Complete "${prevTopic}" to unlock this topic.` };
  }
  if (!isPassed) {
    return { unlocked: false, reason: `🔒 Pass "${prevTopic}" Quiz with 70%+ to unlock this topic (Current: ${quizScore}%).` };
  }
  
  return getTopicUnlockStatus(careerId, flatTopics, idx - 1, topicsCompleted, quizScores);
};

export default function Roadmap() {
  const { careerGoal, roadmapProgress, completeTopic, topicsCompleted, quizScores } = useStudentStore();
  const [expandedMonth, setExpandedMonth] = useState(0);
  const career = careerPaths.find(c => c.id === careerGoal) || careerPaths[0];

  const standardRoadmap = career.roadmap;
  const customOrder = roadmapProgress?.customOrder || [];

  // Flat list of standard topics
  const allStandardTopics = standardRoadmap.flatMap(m => m.topics);

  // Group into weak (AI Focus) and others
  const weakTopics = allStandardTopics.filter(t => 
    customOrder.some(co => t.toLowerCase().includes(co.toLowerCase()))
  );
  const otherTopics = allStandardTopics.filter(t => !weakTopics.includes(t));

  // Re-build months: 4 topics per month
  const personalizedTopics = [...weakTopics, ...otherTopics];
  const personalizedRoadmap = [];
  const topicsPerMonth = 4;
  for (let i = 0; i < personalizedTopics.length; i += topicsPerMonth) {
    const monthNum = Math.floor(i / topicsPerMonth) + 1;
    personalizedRoadmap.push({
      month: monthNum,
      title: monthNum === 1 && weakTopics.length > 0 ? 'AI Priority Focus' : `Phase ${monthNum}`,
      topics: personalizedTopics.slice(i, i + topicsPerMonth)
    });
  }

  const totalTopics = personalizedTopics.length;
  const completedTopics = personalizedTopics.filter(t => topicsCompleted.includes(getTopicId(career.id, t))).length;
  const overallProgress = Math.round((completedTopics / totalTopics) * 100) || 0;

  const getMonthProgress = (monthIndex) => {
    const month = personalizedRoadmap[monthIndex];
    if (!month) return 0;
    const done = month.topics.filter(t =>
      topicsCompleted.includes(getTopicId(career.id, t))
    ).length;
    return Math.round((done / month.topics.length) * 100);
  };

  const toggleTopic = (topicName) => {
    const topicId = getTopicId(career.id, topicName);
    if (topicsCompleted.includes(topicId)) return;
    completeTopic(topicId);
    toast.success('Topic completed! +100 XP +20 🪙', { icon: '✅' });
  };

  return (
    <Layout title="My Roadmap">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{career.icon}</span>
                <div>
                  <p className="text-blue-400 text-xs font-medium">Your Personalized AI Career Path</p>
                  <h2 className="font-display font-bold text-2xl text-white">{career.title}</h2>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{career.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {career.duration}</span>
                <span className="flex items-center gap-1"><Layers size={12} /> {totalTopics} topics</span>
                <span className="flex items-center gap-1"><Trophy size={12} /> {career.avgSalary}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#3B82F6" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overallProgress / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-2xl text-white">{overallProgress}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Complete</p>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{completedTopics} topics completed</span>
              <span>{totalTopics - completedTopics} remaining</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Month-by-month roadmap */}
        <div className="space-y-3">
          {personalizedRoadmap.map((month, monthIndex) => {
            const monthProg = getMonthProgress(monthIndex);
            const isExpanded = expandedMonth === monthIndex;
            const isCompleted = monthProg === 100;
            
            // Check if month is locked (locked if first topic in month is locked)
            const firstTopicInMonth = month.topics[0];
            const firstTopicIdx = personalizedTopics.indexOf(firstTopicInMonth);
            const firstTopicStatus = getTopicUnlockStatus(career.id, personalizedTopics, firstTopicIdx, topicsCompleted, quizScores);
            const isLocked = !firstTopicStatus.unlocked;

            return (
              <motion.div
                key={monthIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: monthIndex * 0.05 }}
              >
                {/* Month Header */}
                <div
                  className={`glass p-4 cursor-pointer transition-all ${isLocked ? 'opacity-50' : ''}`}
                  style={{ border: isCompleted ? '1px solid rgba(16,185,129,0.3)' : isExpanded ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => !isLocked && setExpandedMonth(isExpanded ? -1 : monthIndex)}
                >
                  <div className="flex items-center gap-4">
                    {/* Month indicator */}
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold`}
                      style={{
                        background: isCompleted
                          ? 'linear-gradient(135deg, #10B981, #34D399)'
                          : isLocked
                          ? 'rgba(255,255,255,0.05)'
                          : 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                        boxShadow: isCompleted ? '0 0 15px rgba(16,185,129,0.3)' : undefined,
                      }}>
                      {isLocked ? <Lock size={16} className="text-slate-600" /> : isCompleted ? <CheckCircle2 size={20} className="text-white" /> : <><span className="text-slate-400">P</span><span className="text-white">{monthIndex + 1}</span></>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{month.title}</h3>
                        {isCompleted && <span className="text-xs px-2 py-0.5 rounded-full text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)' }}>✓ Complete</span>}
                        {isLocked && <span className="text-xs px-2 py-0.5 rounded-full text-slate-600" style={{ background: 'rgba(255,255,255,0.05)' }}>🔒 Locked</span>}
                        {month.title === 'AI Priority Focus' && <span className="text-xs px-2 py-0.5 rounded-full text-rose-400 bg-rose-500/10 font-bold">🔥 Weak Areas</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${monthProg}%`, background: isCompleted ? '#10B981' : undefined }} />
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">{month.topics.length} topics</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isExpanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Topics */}
                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-2 space-y-2 pb-2">
                        {month.topics.map((topic, topicIndex) => {
                          const topicId = getTopicId(career.id, topic);
                          const isDone = topicsCompleted.includes(topicId);
                          const flatIdx = personalizedTopics.indexOf(topic);
                          const unlockStatus = getTopicUnlockStatus(career.id, personalizedTopics, flatIdx, topicsCompleted, quizScores);
                          const topicIsLocked = !unlockStatus.unlocked;

                          const quizScore = quizScores[topicId] || 0;
                          const quizPassed = quizScore >= 70;

                          return (
                            <motion.div
                              key={topicIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: topicIndex * 0.04 }}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${topicIsLocked ? 'opacity-50' : ''}`}
                              style={{
                                background: isDone ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                                border: isDone ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              <button
                                onClick={() => !topicIsLocked && toggleTopic(topic)}
                                disabled={topicIsLocked}
                                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                                style={{
                                  background: isDone ? '#10B981' : 'transparent',
                                  border: isDone ? 'none' : '2px solid rgba(255,255,255,0.2)',
                                }}
                              >
                                {isDone && <CheckCircle2 size={14} className="text-white" />}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm block ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                  {topic}
                                </span>
                                {topicIsLocked && (
                                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <AlertCircle size={10} /> {unlockStatus.reason}
                                  </span>
                                )}
                                {!topicIsLocked && isDone && !quizPassed && (
                                  <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                                    ⚠️ Take Topic Quiz to unlock next topic (Need 70%+, Current: {quizScore}%)
                                  </span>
                                )}
                                {!topicIsLocked && isDone && quizPassed && (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                    ✓ Quiz Passed ({quizScore}%)
                                  </span>
                                )}
                              </div>

                              {!topicIsLocked && (
                                <div className="flex items-center gap-2">
                                  {!isDone && (
                                    <Link to="/learning" className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300">
                                      <PlayCircle size={12} /> Learn
                                    </Link>
                                  )}
                                  {isDone && !quizPassed && (
                                    <Link to="/quiz" className="btn-primary px-3 py-1 text-xs flex items-center gap-1">
                                      <BookOpen size={12} /> Quiz
                                    </Link>
                                  )}
                                </div>
                              )}

                              {isDone && quizPassed && <span className="text-xs text-emerald-400 font-medium">+100 XP</span>}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Company targets */}
        <div className="glass p-6">
          <h3 className="font-display font-semibold text-white mb-4">🎯 Target Companies</h3>
          <div className="flex flex-wrap gap-2">
            {career.companies.map(c => (
              <span key={c} className="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
