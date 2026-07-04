import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { quizData, quizListByGoal } from '../data/quizData';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, Trophy, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import CelebrationModal from '../components/CelebrationModal';
import { getLevelInfo } from '../data/students';

function QuizCard({ quiz, onStart }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-hover p-5 cursor-pointer" onClick={() => onStart(quiz)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{quiz.icon}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          quiz.difficulty === 'Easy' ? 'text-emerald-400' : quiz.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-red-400'
        }`} style={{ background: quiz.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' : quiz.difficulty === 'Intermediate' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}>
          {quiz.difficulty}
        </span>
      </div>
      <h3 className="font-semibold text-white mb-1">{quiz.title}</h3>
      <p className="text-xs text-slate-500 mb-4">{quiz.topic} · {quiz.questions} questions</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-blue-400 flex items-center gap-1"><Zap size={11} /> +{quiz.xp} XP</span>
          <span className="text-amber-400">🪙 +{quiz.coins}</span>
        </div>
        <button className="btn-primary px-4 py-1.5 text-xs">Start Quiz</button>
      </div>
    </motion.div>
  );
}

export default function Quiz() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [celebration, setCelebration] = useState(null); // { score, xp, coins, leveledUp, oldLevel, newLevel }
  const { saveQuizScore, quizScores, careerGoal, xp } = useStudentStore();
  const timerRef = useRef(null);

  let goalKey = 'default';
  if (careerGoal === 'java-developer') {
    goalKey = 'java-developer';
  } else if (careerGoal === 'python-developer' || careerGoal === 'data-analyst' || careerGoal === 'ai-engineer') {
    goalKey = 'python-developer';
  } else if (careerGoal === 'uiux-designer') {
    goalKey = 'uiux-designer';
  }
  const quizList = quizListByGoal[goalKey] || quizListByGoal['default'];

  useEffect(() => {
    if (!activeQuiz || showResult) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleFinish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeQuiz, qIndex, showResult]);

  const startQuiz = (quiz) => {
    const data = quizData[quiz.id];
    if (!data) return;
    setActiveQuiz({ ...quiz, data });
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setShowExplanation(false);
    setTimeLeft(data.timeLimit || 600);
  };

  const handleAnswer = (optionIdx) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const q = activeQuiz.data.questions[qIndex];
    const isCorrect = selected === q.correct;
    const newAnswers = [...answers, { questionId: q.id, selected, correct: q.correct, isCorrect }];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);

    if (qIndex + 1 < activeQuiz.data.questions.length) {
      setQIndex(i => i + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (ans = answers) => {
    clearInterval(timerRef.current);
    const correct = ans.filter(a => a.isCorrect).length;
    const total = activeQuiz.data.questions.length;
    const score = Math.round((correct / total) * 100);
    setFinalScore(score);
    setShowResult(true);
    const xpEarned = score >= 70 ? activeQuiz.data.xp : Math.round(activeQuiz.data.xp * 0.3);
    const coinsEarned = score >= 70 ? activeQuiz.data.coins : Math.round(activeQuiz.data.coins * 0.3);

    // Detect level-up
    const currentXP = useStudentStore.getState().xp;
    const oldLevel = getLevelInfo(currentXP);
    saveQuizScore(activeQuiz.id, score, xpEarned, coinsEarned);
    const newXP = useStudentStore.getState().xp;
    const newLevel = getLevelInfo(newXP);
    const leveledUp = newLevel.level > oldLevel.level;

    setCelebration({ score, xpEarned, coinsEarned, leveledUp, oldLevel, newLevel });
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (showResult && activeQuiz) {
    const correct = answers.filter(a => a.isCorrect).length;
    const band = finalScore >= 71 ? { label: 'Advanced', color: '#10B981', icon: '🏆' } : finalScore >= 41 ? { label: 'Intermediate', color: '#F59E0B', icon: '⚡' } : { label: 'Beginner', color: '#EF4444', icon: '📚' };
    return (
      <Layout title="Quiz Result">
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
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 text-center">
            <div className="text-7xl mb-4">{band.icon}</div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">{activeQuiz.title}</h2>
            <div className="text-7xl font-display font-bold mb-2" style={{ color: band.color }}>{finalScore}<span className="text-3xl text-slate-500">/100</span></div>
            <span className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: `${band.color}15`, color: band.color }}>{band.label}</span>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Correct', value: correct, color: '#10B981', icon: '✅' },
                { label: 'Wrong', value: activeQuiz.data.questions.length - correct, color: '#EF4444', icon: '❌' },
                { label: 'XP Earned', value: `+${finalScore >= 70 ? activeQuiz.data.xp : Math.round(activeQuiz.data.xp * 0.3)}`, color: '#3B82F6', icon: '⚡' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.icon} {s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => startQuiz(activeQuiz)} className="btn-secondary flex-1">Retry Quiz</button>
              <button onClick={() => { setActiveQuiz(null); setShowResult(false); }} className="btn-primary flex-1">Back to Quizzes</button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.data.questions[qIndex];
    const progress = ((qIndex) / activeQuiz.data.questions.length) * 100;
    return (
      <Layout title={activeQuiz.title}>
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">{activeQuiz.title}</span>
              <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-xl ${
                timeLeft < 60 ? 'text-red-400' : 'text-slate-300'
              }`} style={{ background: timeLeft < 60 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)' }}>
                <Clock size={14} /> {formatTime(timeLeft)}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Question {qIndex + 1} of {activeQuiz.data.questions.length}</p>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass p-6">
              <p className="text-white font-medium mb-6 leading-relaxed whitespace-pre-line">{q.question}</p>
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  let cls = 'quiz-option';
                  if (selected !== null) {
                    if (i === q.correct) cls += ' correct';
                    else if (i === selected && i !== q.correct) cls += ' wrong';
                  } else if (selected === i) cls += ' selected';
                  return (
                    <motion.button key={i} whileHover={selected === null ? { x: 4 } : {}} className={cls} onClick={() => handleAnswer(i)}>
                      <span className="font-semibold text-slate-500 mr-2">{['A','B','C','D'][i]}.</span>{opt}
                      {selected !== null && i === q.correct && <CheckCircle2 size={16} className="inline ml-2 text-emerald-400" />}
                      {selected !== null && i === selected && i !== q.correct && <XCircle size={16} className="inline ml-2 text-red-400" />}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {showExplanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <p className="text-blue-400 font-medium mb-1">💡 Explanation</p>
                    <p className="text-slate-300">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {selected !== null && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={handleNext}
                  className="btn-primary mt-4 flex items-center gap-2">
                  {qIndex + 1 < activeQuiz.data.questions.length ? <><span>Next Question</span><ArrowRight size={16} /></> : <><span>View Results</span><Trophy size={16} /></>}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Assessments">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Topic Assessments</h2>
          <p className="text-slate-500 text-sm">Test your knowledge and earn XP & Career Coins</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizList.map(q => (
            <QuizCard key={q.id} quiz={q} onStart={startQuiz} />
          ))}
        </div>
        {Object.keys(quizScores).length > 0 && (
          <div className="glass p-6">
            <h3 className="font-display font-semibold text-white mb-4">📊 Your Quiz History</h3>
            <div className="space-y-3">
              {Object.entries(quizScores).map(([id, score]) => {
                const quiz = quizList.find(q => q.id === id);
                return quiz ? (
                  <div key={id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <span>{quiz.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{quiz.title}</p>
                        <p className="text-xs text-slate-500">{quiz.topic}</p>
                      </div>
                    </div>
                    <span className="font-bold" style={{ color: score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444' }}>{score}/100</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
