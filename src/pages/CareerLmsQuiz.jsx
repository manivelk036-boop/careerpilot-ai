import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCareerLmsQuizzes } from '../services/api';
import { useStudentStore } from '../store/useStudentStore';
import Layout from '../components/Layout';
import {
  Brain, ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// CareerQuiz uses optionA/B/C/D and correctAnswer is "A","B","C","D"
const LETTERS = ['A', 'B', 'C', 'D'];
const optKey = (letter) => `option${letter}`; // e.g. "A" → "optionA"

export default function CareerLmsQuiz() {
  const { goalId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { addXP, addCoins } = useStudentStore();

  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [answers,   setAnswers]   = useState({}); // { questionId: "A"|"B"|"C"|"D" }
  const [current,   setCurrent]   = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);

  const backUrl = `/learn/${goalId}`;

  useEffect(() => { fetchQuiz(); }, [goalId, moduleId, lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setSubmitted(false);
      setResult(null);
      setAnswers({});
      setCurrent(0);
      const res = await getCareerLmsQuizzes(goalId, moduleId, lessonId);
      setQuestions(res.data || []);
    } catch {
      setError('Could not load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId, letter) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    let score = 0;
    const feedback = questions.map(q => {
      const given   = answers[q.id];                    // "A"|"B"|"C"|"D"
      const correct = q.correctAnswer?.toUpperCase();   // "A"|"B"|"C"|"D"
      const isCorrect = given === correct;
      if (isCorrect) score++;
      return {
        question:      q.question,
        givenAnswer:   given,
        correctAnswer: correct,
        isCorrect,
        explanation:   q.explanation || null,
        options: {
          A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD
        },
      };
    });

    const percentage = Math.round((score / questions.length) * 100);
    setResult({ score, total: questions.length, percentage, feedback });
    setSubmitted(true);

    if (percentage >= 70) {
      addXP(100);
      addCoins(30);
      toast.success(`🎉 Great job! ${percentage}% — +100 XP +30 🪙`);
    } else {
      toast(`Score: ${percentage}%. Keep practicing! 💪`);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <Layout title="Loading Quiz...">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glass p-6 animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-1/4" />
            <div className="h-10 bg-white/5 rounded w-3/4" />
            <div className="space-y-2 pt-4">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl w-full" />)}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ── No Questions ── */
  if (error || !questions.length) {
    return (
      <Layout title="Quiz">
        <div className="glass p-8 text-center rounded-2xl max-w-xl mx-auto">
          <Brain size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">{error || 'No quiz questions available for this lesson.'}</p>
          <button onClick={() => navigate(backUrl)} className="btn-secondary">
            ← Back to Course
          </button>
        </div>
      </Layout>
    );
  }

  /* ── Results ── */
  if (submitted && result) {
    return (
      <Layout title="Quiz Results">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 text-center rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="text-6xl mb-4">{result.percentage >= 70 ? '🏆' : '📖'}</div>
            <h2 className="font-display font-bold text-2xl text-white">Quiz Completed!</h2>
            <div className={`text-5xl font-bold mt-3 mb-2 ${result.percentage >= 70 ? 'text-blue-400' : 'text-amber-400'}`}>
              {result.percentage}%
            </div>
            <p className="text-sm text-slate-400">
              You scored {result.score} out of {result.total} correct.
            </p>
            <div className="flex gap-4 mt-8">
              <button onClick={fetchQuiz} className="btn-secondary flex-1">
                <RefreshCw size={14} className="inline mr-1" /> Retry Quiz
              </button>
              <button onClick={() => navigate(backUrl)} className="btn-primary flex-1">
                Continue Learning
              </button>
            </div>
          </motion.div>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base">Question Review</h3>
            {result.feedback?.map((f, i) => (
              <div key={i} className="glass p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {f.isCorrect
                      ? <CheckCircle2 size={18} className="text-emerald-400" />
                      : <XCircle size={18} className="text-red-400" />
                    }
                  </div>
                  <p className="text-white text-sm font-semibold">{f.question}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                  {LETTERS.map(letter => {
                    const optText  = f.options[letter];
                    if (!optText) return null;
                    const isGiven   = f.givenAnswer   === letter;
                    const isCorrect = f.correctAnswer === letter;
                    let style = 'bg-white/5 text-slate-400 border-white/5';
                    if (isCorrect)            style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    else if (isGiven)         style = 'bg-red-500/10 text-red-400 border-red-500/30';
                    return (
                      <div key={letter} className={`p-2.5 rounded-lg border text-xs ${style}`}>
                        <span className="font-bold mr-1">{letter}.</span>{optText}
                      </div>
                    );
                  })}
                </div>
                {f.explanation && (
                  <p className="pl-7 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400">Explanation:</span> {f.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  /* ── Question View ── */
  const q = questions[current];
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <Layout title={`Quiz — Question ${current + 1}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate(backUrl)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Quit Quiz
        </button>

        {/* Progress bar */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progressPct)}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 rounded-2xl space-y-6"
        >
          <h3 className="text-white font-bold text-base leading-relaxed whitespace-pre-line">
            {q.question}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {LETTERS.map(letter => {
              const optText  = q[optKey(letter)];
              if (!optText) return null;
              const isChosen = answers[q.id] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelect(q.id, letter)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                    isChosen
                      ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="inline-block w-6 text-slate-500">{letter}.</span>
                  {optText}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-white/5">
            <button
              onClick={() => setCurrent(c => c - 1)}
              disabled={current === 0}
              className="btn-secondary text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {current === questions.length - 1 ? (
              <button onClick={handleSubmit} className="btn-primary text-sm px-6 py-2">
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrent(c => c + 1)}
                disabled={answers[q.id] === undefined}
                className="btn-primary text-sm px-6 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next Question <ArrowRight size={14} className="inline ml-1" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
