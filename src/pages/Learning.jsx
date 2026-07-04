import Layout from '../components/Layout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, Code, FileText, Layers, CheckCircle2, Lock, ExternalLink, PlayCircle, AlertCircle } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import { learningDataByGoal } from '../data/learningData';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'practice', label: 'Practice', icon: Code },
  { id: 'assignments', label: 'Assignments', icon: FileText },
];

const getTopicLockState = (topicsList, idx, completedList, scoresMap) => {
  if (idx === 0) return { locked: false, reason: '' };
  
  const prevTopic = topicsList[idx - 1];
  const prevCompleted = completedList.includes(prevTopic.id);
  const prevQuizScore = scoresMap[prevTopic.id] || 0;
  const prevPassed = prevQuizScore >= 70;
  
  if (!prevCompleted) {
    return { locked: true, reason: `🔒 Complete previous topic "${prevTopic.title}" first.` };
  }
  if (!prevPassed) {
    return { locked: true, reason: `🔒 Pass "${prevTopic.title}" Quiz with 70%+ (Current: ${prevQuizScore}%).` };
  }
  
  return getTopicLockState(topicsList, idx - 1, completedList, scoresMap);
};

export default function Learning() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const { topicsCompleted, completeTopic, careerGoal, roadmapProgress, quizScores } = useStudentStore();

  let goalKey = 'default';
  if (careerGoal === 'java-developer') {
    goalKey = 'java-developer';
  } else if (careerGoal === 'python-developer' || careerGoal === 'data-analyst' || careerGoal === 'ai-engineer') {
    goalKey = 'python-developer';
  } else if (careerGoal === 'uiux-designer') {
    goalKey = 'uiux-designer';
  }
  
  const standardTopics = learningDataByGoal[goalKey] || learningDataByGoal['default'];
  const customOrder = roadmapProgress?.customOrder || [];

  // Sort: topics whose title or ID is in customOrder should go first (weak topics)
  const weakTopics = standardTopics.filter(t => 
    customOrder.some(co => t.title.toLowerCase().includes(co.toLowerCase()) || t.id.toLowerCase().includes(co.toLowerCase()))
  );
  const otherTopics = standardTopics.filter(t => !weakTopics.includes(t));
  const topics = [...weakTopics, ...otherTopics];

  const handleComplete = (topicId) => {
    completeTopic(topicId);
    toast.success('Topic completed! +100 XP +20 🪙. Take the quiz to unlock the next topic!', { icon: '🎉' });
  };

  const handleTopicClick = (topic, idx) => {
    const lockState = getTopicLockState(topics, idx, topicsCompleted, quizScores);
    if (lockState.locked) {
      toast.error(lockState.reason);
      return;
    }
    setSelectedTopic(topic.id);
  };

  if (selectedTopic) {
    const t = topics.find(t => t.id === selectedTopic);
    const isDone = topicsCompleted.includes(t.id);
    return (
      <Layout title={t.title}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <button onClick={() => setSelectedTopic(null)} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">← Back to Topics</button>

          {/* Topic Header */}
          <div className="glass p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full text-blue-300" style={{ background: 'rgba(59,130,246,0.1)' }}>{t.module}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ t.difficulty === 'Beginner' ? 'text-emerald-400' : 'text-amber-400' }`} style={{ background: t.difficulty === 'Beginner' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }}>{t.difficulty}</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-1">{t.title}</h2>
                <p className="text-slate-500 text-sm">{t.duration} · +{t.xp} XP</p>
              </div>
              {!isDone ? (
                <button onClick={() => handleComplete(t.id)} className="btn-primary flex items-center gap-2">
                  <CheckCircle2 size={16} /> Mark Complete
                </button>
              ) : (
                <span className="flex items-center gap-2 text-emerald-400 font-medium text-sm px-4 py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <CheckCircle2 size={16} /> Completed!
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white' } : { color: '#64748B' }}>
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-white mb-4">📖 Study Notes</h3>
                {t.notes.map((note, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans">{note}</pre>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'videos' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-4">🎬 Video Tutorials</h3>
                {t.videos.map((v, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                      <PlayCircle size={24} className="text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{v.title}</p>
                      <p className="text-xs text-slate-500">{v.channel} · {v.duration}</p>
                    </div>
                    <ExternalLink size={14} className="text-slate-600" />
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'practice' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-4">🧩 Practice Questions</h3>
                {t.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <span className="text-purple-400 font-bold text-sm flex-shrink-0">Q{i+1}.</span>
                    <p className="text-slate-300 text-sm">{q}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'assignments' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white mb-4">📝 Assignments</h3>
                {t.assignments.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <span className="text-emerald-400 font-bold text-sm flex-shrink-0">{i+1}.</span>
                    <p className="text-slate-300 text-sm">{a}</p>
                  </div>
                ))}
                <button className="btn-primary flex items-center gap-2 mt-2"><FileText size={16} /> Submit Assignment (+75 XP)</button>
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Learning">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Learning Topics</h2>
            <p className="text-slate-500 text-sm mt-1">Master each topic to unlock the next level</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
              {topicsCompleted.filter(tc => topics.some(t => t.id === tc)).length}/{topics.length} Completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic, i) => {
            const isDone = topicsCompleted.includes(topic.id);
            const lockState = getTopicLockState(topics, i, topicsCompleted, quizScores);
            const isLocked = lockState.locked;
            
            const quizScore = quizScores[topic.id] || 0;
            const quizPassed = quizScore >= 70;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={!isLocked ? { y: -3 } : {}}
                className={`glass p-5 transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ 
                  border: isDone && quizPassed ? '1px solid rgba(16,185,129,0.3)' : isLocked ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(255,255,255,0.08)' 
                }}
                onClick={() => handleTopicClick(topic, i)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">{topic.module}</p>
                      {customOrder.some(co => topic.title.toLowerCase().includes(co.toLowerCase()) || topic.id.toLowerCase().includes(co.toLowerCase())) && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 font-bold uppercase tracking-wider scale-95">Focus</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white mt-1">{topic.title}</h3>
                  </div>
                  {isLocked ? (
                    <Lock size={18} className="text-slate-600 flex-shrink-0" />
                  ) : isDone ? (
                    <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <BookOpen size={20} className="text-slate-600 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${ topic.difficulty === 'Beginner' ? 'text-emerald-400' : 'text-amber-400' }`} style={{ background: topic.difficulty === 'Beginner' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }}>{topic.difficulty}</span>
                  <span className="text-slate-500">{topic.duration}</span>
                  <span className="text-blue-400">+{topic.xp} XP</span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1"><BookOpen size={11} /> Notes</span>
                    <span className="flex items-center gap-1"><Video size={11} /> Videos</span>
                    <span className="flex items-center gap-1"><Code size={11} /> Practice</span>
                  </div>
                  {isLocked && (
                    <span className="text-[10px] text-rose-400 flex items-center gap-1">
                      <AlertCircle size={10} /> Locked
                    </span>
                  )}
                  {!isLocked && isDone && !quizPassed && (
                    <span className="text-[10px] text-amber-400 font-semibold">
                      ⚠️ Quiz Pending ({quizScore}%)
                    </span>
                  )}
                  {!isLocked && isDone && quizPassed && (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      ✓ Quiz Passed ({quizScore}%)
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
