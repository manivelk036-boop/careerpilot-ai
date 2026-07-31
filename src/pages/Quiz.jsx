import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { quizData, quizListByGoal } from '../data/quizData';
import { generateQuiz, getCompanyMockTest, submitQuiz as apiSubmitQuiz } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, Trophy, Zap, Building2, BookOpen, Layers, RefreshCw, Lock, Sparkles, Filter, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import CelebrationModal from '../components/CelebrationModal';
import { getLevelInfo } from '../data/students';

// Helper to shuffle arrays
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TOPICS = [
  'All Topics',
  'Core Java',
  'OOP',
  'Exceptions',
  'Collections',
  'Concurrency',
  'JVM',
  'Modern Java',
  'Spring Boot'
];

const SUBTOPICS_MAP = {
  'Core Java': ['All Subtopics', 'Java Basics', 'Variables', 'Data Types', 'Operators', 'Strings', 'Arrays'],
  'OOP': ['All Subtopics', 'Abstraction', 'Encapsulation', 'Polymorphism', 'Inheritance', 'Interfaces'],
  'Exceptions': ['All Subtopics', 'Exception Hierarchy', 'Unchecked Exceptions', 'Try-Catch-Finally', 'Custom Exceptions'],
  'Collections': ['All Subtopics', 'Collection Hierarchy', 'List', 'Set', 'Map', 'Queue', 'Generics', 'Sorting'],
  'Concurrency': ['All Subtopics', 'Threads', 'Synchronized & Volatile', 'Atomic Operations', 'Thread Pools', 'Locks & Semaphores'],
  'JVM': ['All Subtopics', 'Metaspace', 'Heap', 'Garbage Collection', 'JVM Options'],
  'Modern Java': ['All Subtopics', 'Functional Interfaces', 'Streams', 'Optional', 'Records', 'Sealed Classes', 'Virtual Threads'],
  'Spring Boot': ['All Subtopics', 'Spring Core', 'REST API', 'Dependency Injection']
};

const COMPANY_TESTS = [
  { id: 'zoho', name: 'Zoho Mock Test', questions: 15, duration: '20 mins', difficulty: 'Medium', color: '#3B82F6', icon: '🏢', tag: 'OOP & Core Logic' },
  { id: 'tcs', name: 'TCS NQT Technical Test', questions: 15, duration: '20 mins', difficulty: 'Easy', color: '#10B981', icon: '💻', tag: 'Java Basics & Fundamentals' },
  { id: 'amazon', name: 'Amazon SDE Assessment', questions: 20, duration: '30 mins', difficulty: 'Hard', color: '#F59E0B', icon: '🚀', tag: 'Collections & Concurrency' },
  { id: 'infosys', name: 'Infosys Tech Exam', questions: 10, duration: '15 mins', difficulty: 'Easy', color: '#8B5CF6', icon: '⚡', tag: 'Exceptions & Control Flow' },
  { id: 'wipro', name: 'Wipro NLTH Test', questions: 15, duration: '20 mins', difficulty: 'Medium', color: '#EC4899', icon: '🎯', tag: 'OOP & Modern Java' },
  { id: 'freshworks', name: 'Freshworks Code Assessment', questions: 10, duration: '15 mins', difficulty: 'Medium', color: '#06B6D4', icon: '🛠️', tag: 'Spring & REST APIs' }
];

export default function Quiz() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator', 'company', 'standard'
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedSubtopic, setSelectedSubtopic] = useState('All Subtopics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answersMap, setAnswersMap] = useState({}); // { qId: optionIndex (1-4) }
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [evalResult, setEvalResult] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const { saveQuizScore, quizScores, careerGoal, addXP, addCoins } = useStudentStore();
  const timerRef = useRef(null);

  let goalKey = 'default';
  if (careerGoal === 'java-developer') goalKey = 'java-developer';
  else if (careerGoal === 'python-developer' || careerGoal === 'data-analyst' || careerGoal === 'ai-engineer') goalKey = 'python-developer';
  else if (careerGoal === 'uiux-designer') goalKey = 'uiux-designer';
  const standardQuizList = quizListByGoal[goalKey] || quizListByGoal['default'];

  useEffect(() => {
    if (!activeQuiz || showResult) return;
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
    return () => clearInterval(timerRef.current);
  }, [activeQuiz, qIndex, showResult]);

  // Start Topic-wise or Company Quiz from API
  const handleGenerateQuiz = async (topic, subtopic, diff, count, titleOverride = null) => {
    setLoading(true);
    try {
      const params = {
        topic: topic !== 'All Topics' ? topic : null,
        subtopic: subtopic !== 'All Subtopics' ? subtopic : null,
        difficulty: diff !== 'All' ? diff : null,
        count: count || 10
      };

      const res = await generateQuiz(params);
      const questions = res.data || [];

      if (questions.length === 0) {
        toast.error('No questions found for the selected criteria. Try another filter!');
        setLoading(false);
        return;
      }

      const formattedQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        topic: q.topic || 'Java',
        subtopic: q.subtopic || 'General',
        difficulty: q.difficulty || 'Medium'
      }));

      setActiveQuiz({
        id: 'dynamic-' + Date.now(),
        title: titleOverride || `${topic !== 'All Topics' ? topic : 'Java'} Assessment (${count} Qs)`,
        questions: formattedQuestions,
        topic: topic !== 'All Topics' ? topic : 'Java Masterclass'
      });

      setQIndex(0);
      setAnswersMap({});
      setSelected(null);
      setShowResult(false);
      setShowExplanation(false);
      setEvalResult(null);
      setTimeLeft(count * 60);
    } catch (err) {
      toast.error('Failed to generate quiz. Loading offline set...');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCompanyTest = async (company) => {
    setLoading(true);
    try {
      const res = await getCompanyMockTest(company.name.split(' ')[0], company.questions);
      const questions = res.data || [];

      if (questions.length === 0) {
        toast.error(`No questions tagged for ${company.name} yet.`);
        setLoading(false);
        return;
      }

      const formattedQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        topic: q.topic || 'Company Prep',
        subtopic: q.subtopic || company.name,
        difficulty: q.difficulty || company.difficulty
      }));

      setActiveQuiz({
        id: 'company-' + company.id,
        title: company.name,
        questions: formattedQuestions,
        topic: company.name
      });

      setQIndex(0);
      setAnswersMap({});
      setSelected(null);
      setShowResult(false);
      setShowExplanation(false);
      setEvalResult(null);
      setTimeLeft(company.questions * 75);
    } catch (err) {
      toast.error(`Failed to load ${company.name}`);
    } finally {
      setLoading(false);
    }
  };

  const startStandardQuiz = (quiz) => {
    const rawData = quizData[quiz.id];
    if (!rawData) return;

    const formattedQuestions = shuffleArray(rawData.questions)
      .slice(0, Math.min(5, rawData.questions.length))
      .map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct: q.correct + 1, // convert 0-3 to 1-4
        explanation: q.explanation,
        topic: quiz.topic,
        difficulty: quiz.difficulty
      }));

    setActiveQuiz({
      id: quiz.id,
      title: quiz.title,
      questions: formattedQuestions,
      topic: quiz.topic,
      isStandard: true
    });

    setQIndex(0);
    setAnswersMap({});
    setSelected(null);
    setShowResult(false);
    setShowExplanation(false);
    setEvalResult(null);
    setTimeLeft(formattedQuestions.length * 60);
  };

  const handleSelectOption = (optionIndex1Based) => {
    if (selected !== null) return;
    const currentQ = activeQuiz.questions[qIndex];
    setSelected(optionIndex1Based);
    setAnswersMap(prev => ({ ...prev, [currentQ.id]: optionIndex1Based }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowExplanation(false);

    if (qIndex + 1 < activeQuiz.questions.length) {
      setQIndex(i => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    clearInterval(timerRef.current);
    setLoading(true);

    try {
      const payload = {
        answers: answersMap,
        topic: activeQuiz.topic
      };

      const res = await apiSubmitQuiz(payload);
      const evalData = res.data;

      setEvalResult(evalData);
      setShowResult(true);

      const passed = evalData.passed;
      const xpEarned = evalData.xpEarned || (passed ? 100 : 30);
      const coinsEarned = evalData.coinsEarned || (passed ? 50 : 15);

      const currentXP = useStudentStore.getState().xp;
      const oldLevel = getLevelInfo(currentXP);
      saveQuizScore(activeQuiz.id, evalData.percentage, xpEarned, coinsEarned);
      const newXP = useStudentStore.getState().xp;
      const newLevel = getLevelInfo(newXP);
      const leveledUp = newLevel.level > oldLevel.level;

      setCelebration({
        score: evalData.percentage,
        xpEarned,
        coinsEarned,
        leveledUp,
        oldLevel,
        newLevel,
        passed
      });
    } catch (err) {
      // Local fallback calculation if backend submit fails
      let correct = 0;
      const feedback = activeQuiz.questions.map(q => {
        const userChoice = answersMap[q.id];
        const isRight = userChoice === (q.correct || 1);
        if (isRight) correct++;
        return {
          questionId: q.id,
          question: q.question,
          givenAnswer: userChoice,
          correctAnswer: q.correct || 1,
          isCorrect: isRight,
          explanation: q.explanation || 'Review core syntax and documentation.',
          topic: q.topic,
          subtopic: q.subtopic,
          difficulty: q.difficulty
        };
      });

      const total = activeQuiz.questions.length;
      const percent = Math.round((correct / total) * 100);
      const passed = percent >= 70;

      setEvalResult({
        score: correct,
        total,
        percentage: percent,
        passed,
        xpEarned: passed ? 100 : 30,
        coinsEarned: passed ? 50 : 15,
        feedback,
        recommendation: passed
          ? `🏆 Score: ${percent}%. Next topic progression unlocked! (+100 XP, +50 Coins)`
          : `📚 Score: ${percent}%. Unlocks require 70%+ score. Retake quiz to master this topic!`
      });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── RENDER 1: RESULT SCREEN ────────────────────────────────────────────────
  if (showResult && evalResult) {
    const passed = evalResult.passed;
    const band = evalResult.percentage >= 70
      ? { label: 'Unlocked! 🔓', color: '#10B981', icon: '🏆', bg: 'rgba(16,185,129,0.1)' }
      : evalResult.percentage >= 40
      ? { label: 'Keep Practice ⚡', color: '#F59E0B', icon: '🟡', bg: 'rgba(245,158,11,0.1)' }
      : { label: 'Revision Needed 📚', color: '#EF4444', icon: '🔴', bg: 'rgba(239,68,68,0.1)' };

    return (
      <Layout title="Assessment Results">
        {celebration && (
          <CelebrationModal
            show={!!celebration}
            onClose={() => setCelebration(null)}
            score={celebration.score}
            xpEarned={celebration.xpEarned}
            coinsEarned={celebration.coinsEarned}
            leveledUp={celebration.leveledUp}
            oldLevel={celebration.oldLevel}
            newLevel={celebration.newLevel}
            title={`${activeQuiz.title} Complete! 🎉`}
            type="quiz"
          />
        )}
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 text-center relative overflow-hidden">
            <div className="text-6xl mb-3">{band.icon}</div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">{activeQuiz.title}</h2>
            <p className="text-xs text-slate-400 mb-6">Topic Mastery & Progression Assessment</p>

            <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl mb-6" style={{ background: band.bg, border: `1px solid ${band.color}30` }}>
              <div className="text-6xl font-display font-extrabold" style={{ color: band.color }}>
                {evalResult.percentage}<span className="text-2xl text-slate-400">%</span>
              </div>
              <span className="mt-2 text-xs font-semibold px-4 py-1 rounded-full text-white" style={{ background: band.color }}>
                {band.label}
              </span>
            </div>

            {/* AI Recommendation Alert */}
            <div className="p-4 rounded-2xl text-left text-xs mb-6" style={{ background: passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <p className="font-bold flex items-center gap-1.5 mb-1" style={{ color: passed ? '#10B981' : '#EF4444' }}>
                <Sparkles size={14} /> AI Recommendation & Feedback
              </p>
              <p className="text-slate-300 leading-relaxed">{evalResult.recommendation}</p>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-4 rounded-xl glass border border-white/5">
                <p className="text-xl font-bold text-emerald-400">✅ {evalResult.score}/{evalResult.total}</p>
                <p className="text-[11px] text-slate-500 mt-1">Correct Answers</p>
              </div>
              <div className="p-4 rounded-xl glass border border-white/5">
                <p className="text-xl font-bold text-blue-400">⚡ +{evalResult.xpEarned || 100} XP</p>
                <p className="text-[11px] text-slate-500 mt-1">XP Earned</p>
              </div>
              <div className="p-4 rounded-xl glass border border-white/5">
                <p className="text-xl font-bold text-amber-400">🪙 +{evalResult.coinsEarned || 50}</p>
                <p className="text-[11px] text-slate-500 mt-1">Career Coins</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setActiveQuiz(null); setShowResult(false); }} className="btn-secondary flex-1 py-3 text-xs">
                Back to Assessment Hub
              </button>
              <button onClick={() => handleGenerateQuiz(selectedTopic, selectedSubtopic, selectedDifficulty, questionCount)} className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-1">
                <RefreshCw size={14} /> Retake / Next Assessment
              </button>
            </div>
          </motion.div>

          {/* Detailed Answers Review */}
          {evalResult.feedback && evalResult.feedback.length > 0 && (
            <div className="glass p-6 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-blue-400" /> Question Breakdown & Explanations
              </h3>
              <div className="space-y-3">
                {evalResult.feedback.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl text-xs space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: item.isCorrect ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-white">Q{idx + 1}. {item.question}</span>
                      {item.isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Correct</span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1"><XCircle size={14} /> Wrong</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      {item.option1 && (
                        <div className={`p-2 rounded ${item.correctAnswer === 1 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : item.givenAnswer === 1 ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-slate-400'}`}>
                          A) {item.option1}
                        </div>
                      )}
                      {item.option2 && (
                        <div className={`p-2 rounded ${item.correctAnswer === 2 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : item.givenAnswer === 2 ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-slate-400'}`}>
                          B) {item.option2}
                        </div>
                      )}
                      {item.option3 && (
                        <div className={`p-2 rounded ${item.correctAnswer === 3 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : item.givenAnswer === 3 ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-slate-400'}`}>
                          C) {item.option3}
                        </div>
                      )}
                      {item.option4 && (
                        <div className={`p-2 rounded ${item.correctAnswer === 4 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : item.givenAnswer === 4 ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-slate-400'}`}>
                          D) {item.option4}
                        </div>
                      )}
                    </div>

                    {item.explanation && (
                      <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 mt-2">
                        💡 <strong>Explanation:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // ── RENDER 2: ACTIVE QUIZ RUNNER ───────────────────────────────────────────
  if (activeQuiz) {
    const q = activeQuiz.questions[qIndex];
    const progress = ((qIndex + 1) / activeQuiz.questions.length) * 100;
    return (
      <Layout title={activeQuiz.title}>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  {q.topic || 'Java'}
                </span>
                <span className="text-xs text-slate-400">{activeQuiz.title}</span>
              </div>
              <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl ${timeLeft < 60 ? 'text-red-400 bg-red-500/10' : 'text-slate-300 bg-white/5'}`}>
                <Clock size={14} /> {formatTime(timeLeft)}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Question {qIndex + 1} of {activeQuiz.questions.length}</span>
              <span>{Math.round(progress)}% Completed</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass p-6 space-y-6">
              <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">
                {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const optionNum = i + 1;
                  const isSelected = selected === optionNum;
                  let cls = 'quiz-option transition-all';
                  if (isSelected) cls += ' selected bg-blue-600/30 border-blue-500 text-white';

                  return (
                    <motion.button
                      key={i}
                      whileHover={selected === null ? { x: 4 } : {}}
                      className={cls}
                      onClick={() => handleSelectOption(optionNum)}
                    >
                      <span className="font-bold text-slate-400 mr-2 font-mono">{['A','B','C','D'][i]}.</span>
                      <span className="text-slate-200">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {selected !== null && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleNext}
                  className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-4"
                >
                  {qIndex + 1 < activeQuiz.questions.length ? (
                    <><span>Next Question</span><ArrowRight size={16} /></>
                  ) : (
                    <><span>Submit & Unlock Results</span><Trophy size={16} /></>
                  )}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Layout>
    );
  }

  // ── RENDER 3: ASSESSMENT HUB PAGE ──────────────────────────────────────────
  const subtopicOptions = SUBTOPICS_MAP[selectedTopic] || ['All Subtopics'];

  return (
    <Layout title="CareerPilot Assessment Hub">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
              <Award className="text-blue-400" /> Topic & Company Assessments
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Dynamic MCQs, metadata tagging, company mock tests & progression unlocks (≥70%).
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs w-fit">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${activeTab === 'generator' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🧩 Topic Generator
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${activeTab === 'company' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🏢 Company Mocks
            </button>
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${activeTab === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🎯 Goal Quizzes
            </button>
          </div>
        </div>

        {/* TAB 1: TOPIC-WISE DYNAMIC GENERATOR */}
        {activeTab === 'generator' && (
          <div className="glass p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Filter className="text-blue-400" size={18} />
              <h3 className="text-white font-bold text-base">Generate Customized Assessment</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Select Topic</label>
                <select
                  value={selectedTopic}
                  onChange={e => { setSelectedTopic(e.target.value); setSelectedSubtopic('All Subtopics'); }}
                  className="input-field bg-[#090F1E] text-white py-2.5"
                >
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Select Subtopic</label>
                <select
                  value={selectedSubtopic}
                  onChange={e => setSelectedSubtopic(e.target.value)}
                  className="input-field bg-[#090F1E] text-white py-2.5"
                >
                  {subtopicOptions.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="input-field bg-[#090F1E] text-white py-2.5"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Number of Questions</label>
                <div className="flex gap-2">
                  {[10, 15, 20].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setQuestionCount(c)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        questionCount === c ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                onClick={() => handleGenerateQuiz(selectedTopic, selectedSubtopic, selectedDifficulty, questionCount)}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} /> Generate {questionCount} Random {selectedTopic !== 'All Topics' ? selectedTopic : 'Java'} MCQs
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANY-SPECIFIC MOCK TESTS */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">Practice company-tagged technical MCQs used by top recruiters:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMPANY_TESTS.map(company => (
                <motion.div
                  key={company.id}
                  whileHover={{ y: -3 }}
                  className="glass-hover p-5 cursor-pointer flex flex-col justify-between"
                  onClick={() => handleStartCompanyTest(company)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-3xl">{company.icon}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-slate-300" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {company.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{company.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">{company.tag}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{company.questions} Qs · {company.duration}</span>
                    <button className="btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1">
                      Start Test <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GOAL-BASED STANDARD ASSESSMENTS */}
        {activeTab === 'standard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standardQuizList.map(quiz => (
              <motion.div
                key={quiz.id}
                whileHover={{ y: -3 }}
                className="glass-hover p-5 cursor-pointer"
                onClick={() => startStandardQuiz(quiz)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{quiz.icon}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20">
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{quiz.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{quiz.topic} · {quiz.questions} Qs</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 flex items-center gap-1"><Zap size={11} /> +{quiz.xp} XP</span>
                  <button className="btn-primary px-3.5 py-1.5 text-xs">Start</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
