import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../store/useStudentStore';
import { baselineAssessmentsByGoal } from '../data/baselineData';
import { careerPaths } from '../data/careers';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Zap, Target, BookOpen, Brain, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BaselineAssessment() {
  const { careerGoal, completeBaselineAssessment } = useStudentStore();
  const navigate = useNavigate();

  const careerId = careerGoal || 'default';
  const assessment = baselineAssessmentsByGoal[careerId] || baselineAssessmentsByGoal['default'];
  const career = careerPaths.find(c => c.id === careerId) || careerPaths[0];

  const [step, setStep] = useState('welcome'); // welcome -> test -> analysis
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [calculatedResults, setCalculatedResults] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 'test') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleFinish();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const handleStart = () => {
    setStep('test');
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setTimeLeft(900);
  };

  const handleOptionSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const q = assessment.questions[qIndex];
    const isCorrect = selected === q.correct;
    const newAnswers = [...answers, { 
      questionId: q.id, 
      category: q.category, 
      subtopic: q.subtopic,
      selected, 
      correct: q.correct, 
      isCorrect 
    }];
    setAnswers(newAnswers);
    setSelected(null);

    if (qIndex + 1 < assessment.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (finalAnswers = answers) => {
    clearInterval(timerRef.current);
    
    // Calculate category-specific scores
    const technical = finalAnswers.filter(a => a.category === 'technical');
    const problemSolving = finalAnswers.filter(a => a.category === 'problemSolving');
    const communication = finalAnswers.filter(a => a.category === 'communication');

    const techScore = technical.length > 0 ? Math.round((technical.filter(a => a.isCorrect).length / technical.length) * 100) : 0;
    const psScore = problemSolving.length > 0 ? Math.round((problemSolving.filter(a => a.isCorrect).length / problemSolving.length) * 100) : 0;
    const commScore = communication.length > 0 ? Math.round((communication.filter(a => a.isCorrect).length / communication.length) * 100) : 0;

    const overallScore = Math.round((techScore + psScore + commScore) / 3);

    // Identify weak and strong subtopics
    const weakTopics = [];
    const strongTopics = [];
    finalAnswers.forEach(a => {
      if (a.category === 'technical') {
        if (!a.isCorrect) {
          weakTopics.push(a.subtopic);
        } else {
          strongTopics.push(a.subtopic);
        }
      }
    });

    const level = overallScore >= 80 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner';

    const results = {
      technical: techScore,
      problemSolving: psScore,
      communication: commScore,
      overall: overallScore,
      weakTopics,
      strongTopics,
      level
    };

    setCalculatedResults(results);
    setStep('analysis');
  };

  const handleClaimRewards = () => {
    if (!calculatedResults) return;
    completeBaselineAssessment(
      {
        technical: calculatedResults.technical,
        problemSolving: calculatedResults.problemSolving,
        communication: calculatedResults.communication
      },
      calculatedResults.weakTopics
    );
    toast.success('Baseline assessment completed! +100 XP +50 Coins 🪙');
    navigate('/dashboard');
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen py-12 px-4 relative flex items-center justify-center" style={{ background: '#050912' }}>
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(120px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {/* WELCOME STEP */}
          {step === 'welcome' && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-8 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-glow-blue" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                <Sparkles size={32} className="text-white animate-pulse" />
              </div>

              <div className="space-y-2">
                <h1 className="font-display font-bold text-3xl text-white">AI Career Baseline Assessment</h1>
                <p className="text-blue-400 font-semibold text-lg">{career.title} Path Selected</p>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                  Let's personalize your learning roadmap! Complete this quick 9-question baseline assessment. This helps us customize your study sequence and highlight focus topics.
                </p>
              </div>

              {/* Focus points grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-left mt-6">
                {[
                  { icon: Target, label: 'Technical Skills', desc: '5 questions testing core programming/concepts' },
                  { icon: Brain, label: 'Problem Solving', desc: '2 questions testing logical reasoning' },
                  { icon: BookOpen, label: 'Communication', desc: '2 questions testing situational work writing' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/3">
                    <item.icon className="text-blue-400 mb-2" size={20} />
                    <h3 className="font-semibold text-white text-sm">{item.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button onClick={handleStart} className="btn-primary px-10 py-4 text-base flex items-center justify-center gap-2 mx-auto">
                  <span>Start Assessment</span> <ArrowRight size={18} />
                </button>
                <p className="text-xs text-slate-600 mt-3">⏳ Time limit: 15 minutes · Non-pass/fail assessment</p>
              </div>
            </motion.div>
          )}

          {/* ACTIVE TEST STEP */}
          {step === 'test' && (
            <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {/* Quiz status bar */}
              <div className="glass p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Baseline Assessment</span>
                  <span className="text-sm font-semibold text-white">Question {qIndex + 1} of {assessment.questions.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div className="bg-blue-500 h-full" animate={{ width: `${((qIndex) / assessment.questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg flex items-center gap-1.5"><Clock size={12} /> {formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Question card */}
              <div className="glass p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase" style={{ 
                    background: assessment.questions[qIndex].category === 'technical' ? 'rgba(59,130,246,0.1)' : assessment.questions[qIndex].category === 'problemSolving' ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)',
                    color: assessment.questions[qIndex].category === 'technical' ? '#3B82F6' : assessment.questions[qIndex].category === 'problemSolving' ? '#8B5CF6' : '#10B981'
                  }}>
                    {assessment.questions[qIndex].category === 'technical' ? `Tech: ${assessment.questions[qIndex].subtopic}` : assessment.questions[qIndex].category === 'problemSolving' ? 'Problem Solving' : 'Communication'}
                  </span>
                </div>

                <p className="text-white font-medium text-lg leading-relaxed whitespace-pre-line">{assessment.questions[qIndex].question}</p>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {assessment.questions[qIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className="w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between"
                      style={{
                        background: selected === idx ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
                        borderColor: selected === idx ? '#3B82F6' : 'rgba(255,255,255,0.05)',
                        color: selected === idx ? '#white' : '#cbd5e1'
                      }}
                    >
                      <span className="text-sm"><span className="font-semibold text-slate-500 mr-2">{['A','B','C','D'][idx]}.</span>{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  {selected !== null && (
                    <button onClick={handleNext} className="btn-primary px-6 py-2.5 flex items-center gap-2">
                      <span>{qIndex + 1 < assessment.questions.length ? 'Next Question' : 'Finish Assessment'}</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI ANALYSIS STEP */}
          {step === 'analysis' && calculatedResults && (
            <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Award size={24} className="text-emerald-400 animate-bounce" />
                </div>
                <h1 className="font-display font-bold text-2xl text-white">AI Skill Analysis & Diagnosis</h1>
                <p className="text-slate-500 text-sm">Based on your baseline response vectors</p>
              </div>

              {/* Breakdown metrics card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { label: 'Technical Score', value: calculatedResults.technical, color: '#3B82F6', icon: Sparkles },
                  { label: 'Problem Solving', value: calculatedResults.problemSolving, color: '#8B5CF6', icon: Brain },
                  { label: 'Communication', value: calculatedResults.communication, color: '#10B981', icon: BookOpen }
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl text-center space-y-2 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex justify-center">
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium uppercase">{stat.label}</p>
                    <p className="text-3xl font-display font-bold" style={{ color: stat.color }}>{stat.value}%</p>
                  </div>
                ))}
              </div>

              {/* Overall Profile Score Card */}
              <div className="p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Initial Placement Readiness</h3>
                  <p className="text-xs text-slate-400 mt-1">Starting readiness metrics seeded from baseline assessment.</p>
                  
                  {/* Diagnosis summary */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-slate-300">
                      💡 **Diagnosis**: You have demonstrated strong competency in **{calculatedResults.strongTopics.join(', ') || 'Core Basics'}**.
                    </p>
                    {calculatedResults.weakTopics.length > 0 && (
                      <p className="text-sm text-slate-300">
                        🔥 **Focus Areas**: We have prioritized **{calculatedResults.weakTopics.join(', ')}** in your roadmap to help you master them first.
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-center md:border-l md:border-white/10 md:pl-8 flex-shrink-0">
                  <p className="text-3xl font-display font-bold text-white">{calculatedResults.overall}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Readiness Score</p>
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/10 text-blue-300 mt-2">Level: {calculatedResults.level}</span>
                </div>
              </div>

              {/* Personalized Roadmap Preview */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white text-sm">🗺️ AI-Personalized Roadmap Priority</h3>
                <div className="space-y-2">
                  {/* First topic is highlighted */}
                  {calculatedResults.weakTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">🔥</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{topic}</p>
                          <p className="text-xs text-rose-400/80">AI Focus - Scheduled for Month 1</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-bold uppercase tracking-wider">High Priority</span>
                    </div>
                  ))}

                  {/* Strong topics marked as fast track */}
                  {calculatedResults.strongTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">✓</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{topic}</p>
                          <p className="text-xs text-emerald-400/80">Fast Track - Basics Cleared</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">Passed</span>
                    </div>
                  ))}

                  {/* Standard roadmap placeholders */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 text-slate-400 text-xs font-bold flex items-center justify-center">🔐</span>
                      <div>
                        <p className="text-sm font-medium text-slate-300">Advanced Career Roadmapping</p>
                        <p className="text-xs text-slate-500">Locked - Unlocks after passing focus quizzes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button onClick={handleClaimRewards} className="btn-primary w-full md:w-auto px-12 py-4 text-base flex items-center justify-center gap-2">
                  <span>Claim Rewards & Generate Roadmap</span> <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
