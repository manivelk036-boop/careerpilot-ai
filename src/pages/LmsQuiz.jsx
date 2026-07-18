import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuiz, submitQuiz } from '../services/api';
import { useStudentStore } from '../store/useStudentStore';
import Layout from '../components/Layout';
import { Brain, Trophy, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LmsQuiz() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { id: studentId, addXP, addCoins } = useStudentStore();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Quiz states
  const [answers, setAnswers] = useState({}); // {questionId: selectedOption}
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setSubmitted(false);
      setResult(null);
      setAnswers({});
      setCurrent(0);
      const res = await getQuiz(moduleId);
      setQuestions(res.data || []);
    } catch (err) {
      setError('Could not load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qId, optionIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitQuiz({
        moduleId: Number(moduleId),
        courseId: Number(courseId),
        answers
      });
      setResult(res.data);
      setSubmitted(true);
      
      // Reward XP/Coins
      if (res.data.xpEarned) addXP(res.data.xpEarned);
      addCoins(10);
      toast.success(`Quiz completed! Score: ${res.data.percentage}%`);
    } catch (err) {
      toast.error('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error || !questions.length) {
    return (
      <Layout title="Quiz">
        <div className="glass p-8 text-center rounded-2xl max-w-xl mx-auto">
          <p className="text-slate-400 mb-4">{error || 'No quiz questions available for this module.'}</p>
          <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-secondary">
            ← Back to Course
          </button>
        </div>
      </Layout>
    );
  }

  if (submitted && result) {
    return (
      <Layout title="Quiz Results">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 text-center rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="font-display font-bold text-2xl text-white">Quiz Completed!</h2>
            <div className="text-5xl font-bold text-blue-400 mt-3 mb-2">
              {result.percentage}%
            </div>
            <p className="text-sm text-slate-400">
              You scored {result.score} out of {result.total} correct.
            </p>

            {/* AI Recommendation Box */}
            {result.recommendation && (
              <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-left space-y-2">
                <p className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Brain size={14} /> AI Recommendation
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  "{result.recommendation}"
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button onClick={fetchQuiz} className="btn-secondary flex-1">
                <RefreshCw size={14} className="inline mr-1" /> Retry Quiz
              </button>
              <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-primary flex-1">
                Continue Course
              </button>
            </div>
          </motion.div>

          {/* Feedback Review */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base">Question Review</h3>
            {result.feedback?.map((f, i) => (
              <div key={i} className="glass p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {f.isCorrect ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{f.question}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                  {questions[i] && [1,2,3,4].map(idx => {
                    const optText = questions[i][`option${idx}`];
                    const isGiven = f.givenAnswer === idx;
                    const isCorrect = f.correctAnswer === idx;
                    let style = 'bg-white/5 text-slate-400 border-white/5';
                    if (isCorrect) style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    else if (isGiven && !isCorrect) style = 'bg-red-500/10 text-red-400 border-red-500/30';

                    return (
                      <div key={idx} className={`p-2.5 rounded-lg border text-xs ${style}`}>
                        {optText}
                      </div>
                    );
                  })}
                </div>

                {f.explanation && (
                  <div className="pl-7 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400">Explanation:</span> {f.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const q = questions[current];
  const progressPct = ((current + 1) / questions.length) * 100;
  const isSelected = answers[q.id] !== undefined;

  return (
    <Layout title={`Quiz — Question ${current + 1}`}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Quit Quiz
        </button>

        {/* Progress header */}
        <div className="glass p-4 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progressPct)}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question Panel */}
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
            {[1, 2, 3, 4].map(idx => {
              const optText = q[`option${idx}`];
              const isChosen = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                    isChosen
                      ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <span className="inline-block w-6 text-slate-500">{['A', 'B', 'C', 'D'][idx - 1]}.</span>
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
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary text-sm px-6 py-2"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrent(c => c + 1)}
                disabled={!isSelected}
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
