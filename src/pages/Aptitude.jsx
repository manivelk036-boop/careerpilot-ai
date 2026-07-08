import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, Trophy, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import CelebrationModal from '../components/CelebrationModal';
import { getLevelInfo } from '../data/students';

// Question Bank
const aptitudeQuestionBank = {
  quant: [
    { id: 1, question: 'A train 150m long is running at 60 km/h. In how much time will it pass a pole?', options: ['9 seconds', '9.5 seconds', '10 seconds', '8 seconds'], correct: 0, explanation: 'Speed = 60 km/h = 60 * (5/18) = 50/3 m/s. Time = Distance / Speed = 150 / (50/3) = 9 seconds.' },
    { id: 2, question: 'If 20% of a number is 80, what is 25% of that number?', options: ['90', '95', '100', '105'], correct: 2, explanation: 'Let the number be x. 0.20 * x = 80 => x = 400. 25% of 400 = 100.' },
    { id: 3, question: 'A shopkeeper marks his goods 30% above cost price and gives 10% discount. What is the net profit %?', options: ['17%', '18%', '19%', '20%'], correct: 0, explanation: 'Let CP = 100. Marked Price = 130. Discount = 10% of 130 = 13. Selling Price = 130 - 13 = 117. Profit = 17%.' },
    { id: 4, question: 'Simple interest on a sum at 5% per annum for 3 years is ₹3600. Find the principal sum.', options: ['₹20,000', '₹22,000', '₹24,000', '₹18,000'], correct: 2, explanation: 'SI = (P * R * T) / 100 => 3600 = (P * 5 * 3) / 100 => P = (3600 * 100) / 15 = ₹24,000.' },
    { id: 5, question: 'The ratio of two numbers is 3:5. If each is increased by 10, the ratio becomes 5:7. Find the numbers.', options: ['15 and 25', '12 and 20', '18 and 30', '21 and 35'], correct: 0, explanation: 'Let numbers be 3x and 5x. (3x + 10) / (5x + 10) = 5/7 => 21x + 70 = 25x + 50 => 4x = 20 => x = 5. Numbers are 15 and 25.' },
    { id: 6, question: 'If 15 men can complete a project in 6 days, how many days will it take 10 men to do it?', options: ['8 days', '9 days', '10 days', '12 days'], correct: 1, explanation: 'M1 * D1 = M2 * D2 => 15 * 6 = 10 * D2 => 90 = 10 * D2 => D2 = 9 days.' },
    { id: 7, question: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?', options: ['12.5%', '10%', '15%', '8%'], correct: 0, explanation: 'SI = P. P = (P * R * 8)/100 => R = 100/8 = 12.5%.' },
    { id: 8, question: 'The average of 5 consecutive numbers is 20. Find the largest of these numbers.', options: ['20', '21', '22', '24'], correct: 2, explanation: 'Let the numbers be x-2, x-1, x, x+1, x+2. Sum/5 = x = 20. Largest is 20 + 2 = 22.' },
    { id: 9, question: 'What is the probability of getting an even number when a fair die is rolled?', options: ['1/3', '1/2', '2/3', '1/6'], correct: 1, explanation: 'Even numbers are 2, 4, 6 (3 outcomes). Total outcomes = 6. Probability = 3/6 = 1/2.' },
    { id: 10, question: 'Find the price of an article sold for ₹480 at a loss of 20%.', options: ['₹600', '₹550', '₹580', '₹620'], correct: 0, explanation: 'SP = 80% of CP => 480 = 0.8 * CP => CP = 480 / 0.8 = ₹600.' }
  ],
  logical: [
    { id: 1, question: 'In a family, there are six members A, B, C, D, E and F. A and B are a married couple, A being the male member. D is the only son of C, who is the brother of A. E is the sister of D. How is E related to C?', options: ['Sister', 'Daughter', 'Cousin', 'Mother'], correct: 1, explanation: 'D is the son of C and E is the sister of D. Thus, E is the daughter of C.' },
    { id: 2, question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?", options: ['His own', "His son's", "His father's", "His nephew's"], correct: 1, explanation: "Since the speaker has no brother or sister, 'my father's son' is himself. So, the man in the photograph's father is the speaker himself. Thus, it is his son's photograph." },
    { id: 3, question: 'If in a certain code language, MONKEY is coded as XDJMNL, how is TIGER coded in that code?', options: ['QDFHS', 'SDFHS', 'UJHFS', 'SHFDQ'], correct: 0, explanation: 'Each letter is shifted 1 position backward in reverse order. Y-1=X, E-1=D, K-1=J, N-1=M, O-1=N, M-1=L. Applying this to TIGER: R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S. So, QDFHS.' },
    { id: 4, question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?', options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'], correct: 1, explanation: 'This is a geometric progression where each term is half of the previous term. (1/4) * (1/2) = 1/8.' },
    { id: 5, question: 'Find the odd one out: Geometry, Algebra, Calculus, Thermodynamics', options: ['Geometry', 'Algebra', 'Calculus', 'Thermodynamics'], correct: 3, explanation: 'Geometry, Algebra, and Calculus are branches of pure mathematics, while Thermodynamics is a branch of physics.' },
    { id: 6, question: 'If A is to the South of B and C is to the East of B, in what direction is A with respect to C?', options: ['South-East', 'South-West', 'North-East', 'North-West'], correct: 1, explanation: 'B is north of A, and C is east of B. A is south-west of C.' },
    { id: 7, question: 'Find the missing term in the sequence: 4, 9, 16, 25, ?, 49', options: ['30', '36', '35', '42'], correct: 1, explanation: 'These are squares of consecutive integers: 2², 3², 4², 5², 6² (36), 7².' },
    { id: 8, question: 'Identify the odd one out from the options:', options: ['Elephant', 'Lion', 'Tiger', 'Leopard'], correct: 0, explanation: 'Elephant is a herbivore, while Lion, Tiger, and Leopard are carnivores.' },
    { id: 9, question: 'If Light is coded as Dark, and White is coded as Black, what is Up coded as?', options: ['Right', 'Down', 'Left', 'High'], correct: 1, explanation: 'This coding uses antonyms. The antonym of Up is Down.' },
    { id: 10, question: 'In a code, computer is written as rfuivqnp. How is medicine written?', options: ['eojejgfs', 'djfkejsa', 'eojejtuf', 'eojejfsd'], correct: 0, explanation: 'Reverse the word and shift each letter by +1 position. medicine -> enicidem -> eojejgfs.' }
  ],
  verbal: [
    { id: 1, question: 'Choose the word that is most nearly synonymous with: IMPETUOUS', options: ['Calm', 'Rash', 'Diligent', 'Slow'], correct: 1, explanation: 'Impetuous means acting or done quickly and without thought or care; rash.' },
    { id: 2, question: 'Choose the word that is most nearly antonymous with: CAPRICIOUS', options: ['Fickle', 'Stable', 'Weak', 'Wild'], correct: 1, explanation: 'Capricious means given to sudden and unaccountable changes of mood or behavior. Stable is the opposite.' },
    { id: 3, question: 'Fill in the blank: The manager was _______ with the progress of the project.', options: ['satisfies', 'satisfying', 'satisfied', 'satisfy'], correct: 2, explanation: 'The past participle "satisfied" fits the passive construction "was satisfied with".' },
    { id: 4, question: 'Find the correctly spelled word:', options: ['Accomodation', 'Accommodation', 'Acomodation', 'Acommodation'], correct: 1, explanation: 'Accommodation is spelled with double "c" and double "m".' },
    { id: 5, question: 'Choose the correct meaning of the idiom: "To burn the midnight oil"', options: ['To waste time', 'To work late into the night', 'To cook late', 'To light up a lamp'], correct: 1, explanation: '"To burn the midnight oil" means to read, study, or work late into the night.' },
    { id: 6, question: 'Choose the word synonym for: PLACID', options: ['Agitated', 'Calm', 'Noisy', 'Friendly'], correct: 1, explanation: 'Placid means calm and peaceful.' },
    { id: 7, question: 'Choose the correct word: "The climate of this city is very _______."', options: ['salubrious', 'healthy', 'healthful', 'good'], correct: 0, explanation: '"Salubrious" is the most formal and correct word to describe climate/air that is health-giving.' },
    { id: 8, question: 'Antonym of: OBSCURE', options: ['Clear', 'Dark', 'Vague', 'Dull'], correct: 0, explanation: 'Obscure means unclear or hard to understand. The antonym is Clear.' },
    { id: 9, question: 'Fill in the blank: "Neither the teacher nor the students _______ present."', options: ['was', 'were', 'is', 'has'], correct: 1, explanation: 'When a subject is joined by "neither... nor", the verb agrees with the closer subject ("students" which is plural, so "were").' },
    { id: 10, question: 'Correct meaning of: "A blessing in disguise"', options: ['A good thing that seemed bad at first', 'A magic trick', 'A hidden trap', 'A secret message'], correct: 0, explanation: '"A blessing in disguise" refers to a misfortune that eventually results in a good outcome.' }
  ]
};

const categories = [
  { id: 'quant', title: 'Quantitative Aptitude', icon: '🔢', questions: 5, duration: '10 mins', color: 'from-blue-500 to-cyan-500' },
  { id: 'logical', title: 'Logical Reasoning', icon: '🧩', questions: 5, duration: '10 mins', color: 'from-purple-500 to-violet-600' },
  { id: 'verbal', title: 'Verbal Ability', icon: '📝', questions: 5, duration: '8 mins', color: 'from-green-500 to-emerald-600' },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleOptions(question) {
  const correctOption = question.options[question.correct];
  const shuffledOpts = shuffleArray(question.options);
  const newCorrectIdx = shuffledOpts.indexOf(correctOption);
  return {
    ...question,
    options: shuffledOpts,
    correct: newCorrectIdx
  };
}

export default function Aptitude() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [celebration, setCelebration] = useState(null);
  const timerRef = useRef(null);

  const { aptitudeScores, updateProfile, addXP, addCoins } = useStudentStore();

  useEffect(() => {
    if (!activeCategory || showResult) return;
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
  }, [activeCategory, qIndex, showResult]);

  const startTest = (catId) => {
    const limit = catId === 'verbal' ? 480 : 600; // 8 mins or 10 mins
    
    // Pick 5 random questions from the bank and shuffle their options
    const rawList = aptitudeQuestionBank[catId];
    const randomized = shuffleArray(rawList)
      .slice(0, 5)
      .map(shuffleOptions);

    setActiveQuestions(randomized);
    setActiveCategory(catId);
    setQIndex(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setShowExplanation(false);
    setTimeLeft(limit);
  };

  const handleAnswer = (optionIdx) => {
    if (selected !== null) return;
    setSelected(optionIdx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const q = activeQuestions[qIndex];
    const isCorrect = selected === q.correct;
    const newAnswers = [...answers, { questionId: q.id, selected, correct: q.correct, isCorrect }];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExplanation(false);

    if (qIndex + 1 < activeQuestions.length) {
      setQIndex(i => i + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (ans = answers) => {
    clearInterval(timerRef.current);
    const correct = ans.filter(a => a.isCorrect).length;
    const total = activeQuestions.length;
    const score = Math.round((correct / total) * 100);
    setFinalScore(score);
    setShowResult(true);

    const updatedAptitude = { ...aptitudeScores, [activeCategory]: score };
    updateProfile({ aptitudeScores: updatedAptitude });

    const avgAptitude = Math.round(Object.values(updatedAptitude).reduce((a, b) => a + b, 0) / 3);
    const store = useStudentStore.getState();
    const newBreakdown = { ...store.placementBreakdown, aptitude: avgAptitude };
    store.updatePlacementScore(newBreakdown);

    const xpEarned = score >= 60 ? 75 : 25;
    const coinsEarned = score >= 60 ? 50 : 15;
    const currentXP = useStudentStore.getState().xp;
    const oldLevel = getLevelInfo(currentXP);
    addXP(xpEarned);
    addCoins(coinsEarned);
    const newXP = useStudentStore.getState().xp;
    const newLevel = getLevelInfo(newXP);
    const leveledUp = newLevel.level > oldLevel.level;

    setCelebration({ score, xpEarned, coinsEarned, leveledUp, oldLevel, newLevel });
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (showResult && activeCategory) {
    const correct = answers.filter(a => a.isCorrect).length;
    const cat = categories.find(c => c.id === activeCategory);
    return (
      <Layout title={`${cat.title} Result`}>
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
            title={`${cat.title} Complete! 🎉`}
            type="aptitude"
          />
        )}
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 text-center">
            <div className="text-6xl mb-4">{finalScore >= 60 ? '🏆' : finalScore >= 40 ? '⚡' : '📚'}</div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">{cat.title}</h2>
            <div className="text-7xl font-display font-bold mb-4 text-blue-400">{finalScore}<span className="text-3xl text-slate-500">/100</span></div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-2xl font-bold text-emerald-400">✅ {correct}</p>
                <p className="text-xs text-slate-500 mt-1">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-2xl font-bold text-red-400">❌ {activeQuestions.length - correct}</p>
                <p className="text-xs text-slate-500 mt-1">Wrong</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-2xl font-bold text-blue-400">⚡ +{finalScore >= 60 ? 75 : 25}</p>
                <p className="text-xs text-slate-500 mt-1">XP Earned</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => startTest(activeCategory)} className="btn-secondary flex-1">Retry Test</button>
              <button onClick={() => { setActiveCategory(null); setShowResult(false); }} className="btn-primary flex-1">Back to Sections</button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (activeCategory) {
    const q = activeQuestions[qIndex];
    const progress = (qIndex / activeQuestions.length) * 100;
    const cat = categories.find(c => c.id === activeCategory);
    return (
      <Layout title={cat.title}>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">{cat.title}</span>
              <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-xl ${
                timeLeft < 60 ? 'text-red-400' : 'text-slate-300'
              }`} style={{ background: timeLeft < 60 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)' }}>
                <Clock size={14} /> {formatTime(timeLeft)}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Question {qIndex + 1} of {activeQuestions.length}</p>
          </div>

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
                  {qIndex + 1 < activeQuestions.length ? <><span>Next Question</span><ArrowRight size={16} /></> : <><span>View Results</span><Trophy size={16} /></>}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Aptitude Preparation">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Aptitude Training</h2>
          <p className="text-slate-500 text-sm">Practice aptitude assessments covering major categories required in placement rounds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => {
            const currentScore = aptitudeScores[c.id] || 0;
            return (
              <motion.div whileHover={{ y: -3 }} key={c.id} className="glass p-6 flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{c.questions} questions · {c.duration}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-500 font-medium">Current Status</span>
                    <span className="text-sm font-bold text-emerald-400">{currentScore ? `${currentScore}% Score` : 'Not Attempted'}</span>
                  </div>
                  <button onClick={() => startTest(c.id)} className="btn-primary w-full py-2 flex items-center justify-center gap-2 text-xs">
                    <Target size={14} /> Start Test
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
