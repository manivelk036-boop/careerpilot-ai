import Layout from '../components/Layout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Video, Code, FileText, CheckCircle2, PlayCircle, Eye, ExternalLink, Sparkles, Award } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';
import { contentByGoal, getContentForGoal } from '../data/learningData';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'practice', label: 'Practice', icon: Code },
  { id: 'assignments', label: 'Assignments', icon: FileText },
];

export default function Learning() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [revealedHints, setRevealedHints] = useState({});
  const [assignmentSubmitted, setAssignmentSubmitted] = useState({});
  
  const { topicsCompleted, completeTopic, careerGoal, addXP, addCoins } = useStudentStore();

  const topics = contentByGoal[careerGoal] || contentByGoal['java-developer'];

  const handleComplete = (topicId) => {
    completeTopic(topicId);
    toast.success('Topic completed! +100 XP +20 🪙. Go to Roadmap to take the baseline quiz!', { icon: '🎉' });
  };

  const toggleHint = (index) => {
    setRevealedHints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const submitAssignment = (topicId) => {
    if (assignmentSubmitted[topicId]) {
      toast('Assignment already submitted for this topic!', { icon: '📝' });
      return;
    }
    setAssignmentSubmitted(prev => ({ ...prev, [topicId]: true }));
    addXP(75);
    addCoins(20);
    toast.success('Assignment submitted successfully! +75 XP +20 🪙', { icon: '🚀' });
  };

  if (selectedTopic) {
    const t = topics.find(t => t.id === selectedTopic);
    const isDone = topicsCompleted.includes(t.id);
    const isSubmitted = assignmentSubmitted[t.id];

    return (
      <Layout title={t.title}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <button onClick={() => { setSelectedTopic(null); setRevealedHints({}); }} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            ← Back to Topics
          </button>

          {/* Topic Header */}
          <div className="glass p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full text-blue-300 bg-blue-500/10 font-semibold uppercase tracking-wider">
                    {careerGoal.replace('-', ' ')}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10 font-semibold">
                    {t.duration}
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl text-white mb-1">{t.title}</h2>
                <p className="text-slate-400 text-sm">Study the notes, watch the video, and complete the practice sets.</p>
              </div>
              <div className="flex-shrink-0">
                {isDone ? (
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold text-sm px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 size={16} /> Completed!
                  </span>
                ) : (
                  <button onClick={() => handleComplete(t.id)} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                    <CheckCircle2 size={16} /> Mark Topic Done
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all"
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white' } : { color: '#64748B' }}>
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass p-6">
              
              {/* NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-4 prose prose-invert max-w-none">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 whitespace-pre-wrap text-slate-300 font-sans leading-relaxed text-sm">
                    {t.notes}
                  </div>
                </div>
              )}

              {/* VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-4 text-center">
                  <h3 className="font-semibold text-white text-left mb-2">🎬 Video Tutorial</h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      width="100%"
                      height="100%"
                      src={t.videoUrl}
                      title={t.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Watch the full video to master the basic principles of {t.title}.</p>
                </div>
              )}

              {/* PRACTICE */}
              {activeTab === 'practice' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-2">🧩 Hands-on Coding Practice</h3>
                  <div className="space-y-3">
                    {t.practiceQuestions.map((q, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-400 font-bold text-sm">Q{idx + 1}.</span>
                          <p className="text-slate-300 text-sm font-medium">{q.q}</p>
                        </div>
                        
                        <button
                          onClick={() => toggleHint(idx)}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <Eye size={12} /> {revealedHints[idx] ? 'Hide Solution/Hint' : 'Show Solution/Hint'}
                        </button>
                        
                        {revealedHints[idx] && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-emerald-400">
                            {q.hint}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-white mb-2">📝 Topic Assignment</h3>
                  <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-3">
                    <p className="text-slate-300 text-sm font-medium leading-relaxed">{t.assignment}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <label className="text-xs font-semibold text-slate-400 block">Submit your code or description:</label>
                    <textarea
                      placeholder="Paste your solution or program code here..."
                      rows={6}
                      disabled={isSubmitted}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-slate-300 font-mono focus:border-blue-500 outline-none resize-none"
                    />
                    
                    <button
                      onClick={() => submitAssignment(t.id)}
                      disabled={isSubmitted}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        isSubmitted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'btn-primary'
                      }`}
                    >
                      {isSubmitted ? (
                        <><CheckCircle2 size={16} /> Assignment Submitted Successfully!</>
                      ) : (
                        <><FileText size={16} /> Submit Assignment (+75 XP)</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Learning Hub">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Learning Paths</h2>
            <p className="text-slate-500 text-sm mt-1">Select a topic below to start mastering skills.</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {topicsCompleted.filter(tc => topics.some(t => t.id === tc)).length}/{topics.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic, i) => {
            const isDone = topicsCompleted.includes(topic.id);
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="glass p-5 cursor-pointer hover:border-blue-500/30 transition-all flex items-center justify-between"
                onClick={() => setSelectedTopic(topic.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{topic.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{topic.duration}</p>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : (
                  <PlayCircle size={20} className="text-blue-400" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
