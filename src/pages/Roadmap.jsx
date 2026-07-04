import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { careerPaths } from '../data/careers';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircle2, Lock, ChevronDown, ChevronUp, PlayCircle,
  BookOpen, Layers, Trophy, Clock, AlertCircle, ArrowRight,
  XCircle, Sparkles, RefreshCw, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CelebrationModal from '../components/CelebrationModal';
import { getLevelInfo } from '../data/students';

/* ──────────────────────────────────────────────────────────────
   Per-topic question bank — 5 questions per topic category.
   Keys = lowercase partial match of topic name.
   ────────────────────────────────────────────────────────────── */
const topicQuestions = {
  'variables': [
    { q: 'Which data type stores whole numbers in Java?', opts: ['float', 'int', 'char', 'boolean'], ans: 1, exp: '"int" stores whole (integer) numbers. "float" stores decimals.' },
    { q: 'What is the default value of an int variable in Java?', opts: ['null', '1', '0', '-1'], ans: 2, exp: 'int defaults to 0 in Java.' },
    { q: 'Which of these is a valid Java variable name?', opts: ['2name', 'my-var', '_myVar', 'class'], ans: 2, exp: 'Variable names can start with _ or a letter, not digits or hyphens. "class" is a reserved keyword.' },
    { q: 'What is a "String" in Java?', opts: ['A primitive type', 'A class', 'An interface', 'A keyword'], ans: 1, exp: 'String is a class in Java, not a primitive. It represents a sequence of characters.' },
    { q: 'Which keyword is used to declare a constant in Java?', opts: ['static', 'const', 'final', 'fixed'], ans: 2, exp: '"final" makes a variable a constant — its value cannot be changed after assignment.' },
  ],
  'control flow': [
    { q: 'Which loop runs at least once even if the condition is false?', opts: ['for', 'while', 'do-while', 'foreach'], ans: 2, exp: '"do-while" executes the body first, then checks the condition.' },
    { q: 'What does "break" do inside a loop?', opts: ['Pauses execution', 'Exits the loop immediately', 'Skips to next iteration', 'Restarts the loop'], ans: 1, exp: '"break" exits the loop immediately and continues after the loop block.' },
    { q: 'Which statement skips the current iteration and goes to the next?', opts: ['break', 'exit', 'continue', 'return'], ans: 2, exp: '"continue" skips the rest of the current iteration and jumps to the next one.' },
    { q: 'What is the output of "for(int i=0; i<3; i++) { System.out.print(i); }"?', opts: ['123', '012', '0123', '1234'], ans: 1, exp: 'i starts at 0, runs while i<3. Prints 0, 1, 2.' },
    { q: 'Which is NOT a valid loop in Java?', opts: ['for', 'while', 'repeat-until', 'do-while'], ans: 2, exp: 'Java has for, while, and do-while. "repeat-until" is from Pascal.' },
  ],
  'loops': [
    { q: 'How many times does this loop run: "for(int i=1; i<=5; i++)"?', opts: ['4', '5', '6', '0'], ans: 1, exp: 'i goes 1,2,3,4,5 — exactly 5 iterations.' },
    { q: 'What is an infinite loop?', opts: ['A loop that runs 0 times', 'A loop with no body', 'A loop whose condition never becomes false', 'A loop inside another loop'], ans: 2, exp: 'An infinite loop never terminates because its condition is always true.' },
    { q: 'Which keyword is used in enhanced for-loop in Java?', opts: ['in', 'of', 'for', ':'], ans: 3, exp: 'Enhanced for-loop syntax: "for(Type item : collection)"' },
    { q: 'What does "while(true)" create?', opts: ['Syntax error', 'A loop that runs once', 'An infinite loop', 'A conditional block'], ans: 2, exp: '"while(true)" creates an infinite loop. Use break to exit it.' },
    { q: 'Nested loops mean:', opts: ['Two loops of the same type', 'A loop inside another loop', 'A loop with two conditions', 'A loop calling a method'], ans: 1, exp: 'Nested loops are loops inside other loops — used for 2D structures like matrices.' },
  ],
  'arrays': [
    { q: 'What is the index of the first element in a Java array?', opts: ['1', '-1', '0', 'undefined'], ans: 2, exp: 'Arrays in Java are 0-indexed. The first element is at index 0.' },
    { q: 'What does "arr.length" return?', opts: ['Last index', 'Number of elements', 'Memory size', 'Type of array'], ans: 1, exp: '"arr.length" returns the total number of elements in the array.' },
    { q: 'Which exception occurs when you access an index beyond array size?', opts: ['NullPointerException', 'ClassCastException', 'ArrayIndexOutOfBoundsException', 'IllegalArgumentException'], ans: 2, exp: 'Accessing arr[5] on a 5-element array throws ArrayIndexOutOfBoundsException.' },
    { q: 'How do you declare an int array of size 5 in Java?', opts: ['int arr[5]', 'int[] arr = new int[5]', 'array int arr(5)', 'int arr = int[5]'], ans: 1, exp: 'The correct Java syntax is: int[] arr = new int[5];' },
    { q: 'What is a 2D array?', opts: ['An array of strings', 'An array with two elements', 'An array of arrays', 'A circular array'], ans: 2, exp: 'A 2D array is an array where each element is itself an array — like a table of rows and columns.' },
  ],
  'functions': [
    { q: 'What is a method in Java?', opts: ['A variable', 'A block of code that performs a task', 'A class definition', 'A data type'], ans: 1, exp: 'A method is a reusable block of code defined in a class that performs a specific task.' },
    { q: 'What does "void" mean in a method declaration?', opts: ['The method is empty', 'The method returns no value', 'The method is private', 'The method is abstract'], ans: 1, exp: '"void" means the method does not return any value.' },
    { q: 'What is method overloading?', opts: ['Calling a method twice', 'Two methods with same name but different parameters', 'A method with no body', 'Overriding a parent method'], ans: 1, exp: 'Overloading = same method name, different parameter types or counts.' },
    { q: 'What are parameters?', opts: ['Return values', 'Variables passed to a method', 'Local variables only', 'Class attributes'], ans: 1, exp: 'Parameters are the inputs defined in the method signature that the caller passes in.' },
    { q: 'What is recursion?', opts: ['A loop that never ends', 'A method calling itself', 'Two methods calling each other', 'A method with no return'], ans: 1, exp: 'Recursion is when a method calls itself. It must have a base case to stop.' },
  ],
  'oop': [
    { q: 'What is inheritance in OOP?', opts: ['Hiding data', 'One class acquiring properties of another', 'Creating multiple objects', 'Overloading methods'], ans: 1, exp: 'Inheritance lets a child class reuse fields and methods from a parent class.' },
    { q: 'Which OOP concept hides internal data?', opts: ['Polymorphism', 'Inheritance', 'Encapsulation', 'Abstraction'], ans: 2, exp: 'Encapsulation hides internal state using private fields and public getters/setters.' },
    { q: 'What does "extends" do in Java?', opts: ['Implements an interface', 'Creates inheritance between classes', 'Imports a library', 'Defines a constant'], ans: 1, exp: '"extends" creates a parent-child (inheritance) relationship between two classes.' },
    { q: 'Polymorphism means:', opts: ['One class has many fields', 'Same method behaves differently based on object type', 'Multiple classes in one file', 'A class inheriting multiple parents'], ans: 1, exp: 'Polymorphism = one interface, many implementations (e.g. method overriding).' },
    { q: 'What is an abstract class?', opts: ['A class with only static methods', 'A class that cannot be instantiated directly', 'A final class', 'A class with no methods'], ans: 1, exp: 'Abstract classes cannot be instantiated — they must be subclassed, and may contain abstract methods.' },
  ],
  'collections': [
    { q: 'Which Java collection maintains insertion order and allows duplicates?', opts: ['HashSet', 'HashMap', 'ArrayList', 'TreeSet'], ans: 2, exp: 'ArrayList is ordered and allows duplicate values.' },
    { q: 'What does HashMap store?', opts: ['Only values', 'Only keys', 'Key-value pairs', 'Ordered sequences'], ans: 2, exp: 'HashMap stores data as key-value pairs. Keys are unique.' },
    { q: 'Which collection disallows duplicates?', opts: ['ArrayList', 'LinkedList', 'HashSet', 'Stack'], ans: 2, exp: 'HashSet automatically rejects duplicate values.' },
    { q: 'What is the time complexity of ArrayList.get()?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], ans: 2, exp: 'ArrayList.get() is O(1) because arrays support direct index access.' },
    { q: 'Which interface does ArrayList implement?', opts: ['Map', 'Set', 'List', 'Queue'], ans: 2, exp: 'ArrayList implements the List interface.' },
  ],
  'sql': [
    { q: 'Which SQL command retrieves data?', opts: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], ans: 2, exp: 'SELECT is used to query and retrieve data from a database.' },
    { q: 'What does WHERE clause do?', opts: ['Sorts results', 'Filters rows based on a condition', 'Groups rows', 'Joins tables'], ans: 1, exp: 'WHERE filters rows that satisfy a condition, e.g., WHERE age > 18.' },
    { q: 'Which SQL join returns all rows from both tables?', opts: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], ans: 3, exp: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.' },
    { q: 'What does GROUP BY do?', opts: ['Filters rows', 'Sorts the result', 'Groups rows with same value for aggregation', 'Joins tables'], ans: 2, exp: 'GROUP BY groups rows sharing the same value so aggregate functions (COUNT, SUM) can be applied.' },
    { q: 'Which is used to count rows?', opts: ['SUM()', 'MAX()', 'AVG()', 'COUNT(*)'], ans: 3, exp: 'COUNT(*) counts the total number of rows in a result set.' },
  ],
  'python': [
    { q: 'How do you print "Hello" in Python?', opts: ['echo "Hello"', 'printf("Hello")', 'print("Hello")', 'console.log("Hello")'], ans: 2, exp: 'Python uses print() to output text to the console.' },
    { q: 'Which of these is a Python list?', opts: ['(1,2,3)', '{1,2,3}', '[1,2,3]', '<1,2,3>'], ans: 2, exp: 'Lists use square brackets [] in Python. Tuples use (), sets use {}.' },
    { q: 'How do you define a function in Python?', opts: ['function foo():', 'def foo():', 'fun foo():', 'void foo():'], ans: 1, exp: 'Python uses "def" keyword to define functions.' },
    { q: 'What does len([1,2,3]) return?', opts: ['2', '3', '0', '4'], ans: 1, exp: 'len() returns the number of elements. [1,2,3] has 3 elements.' },
    { q: 'Which keyword creates a class in Python?', opts: ['def', 'struct', 'class', 'object'], ans: 2, exp: '"class" keyword defines a class in Python.' },
  ],
  'design': [
    { q: 'What does UX stand for?', opts: ['User Experience', 'User Extension', 'User Execution', 'Universal Experience'], ans: 0, exp: 'UX = User Experience — how users feel and interact with a product.' },
    { q: 'Which tool is most commonly used for UI design?', opts: ['Photoshop', 'Figma', 'Excel', 'VS Code'], ans: 1, exp: 'Figma is the industry-standard collaborative design tool for UI/UX.' },
    { q: 'What is a wireframe?', opts: ['A color palette', 'A low-fidelity layout sketch', 'A design system', 'A prototype'], ans: 1, exp: 'Wireframes are basic, low-detail sketches showing the structure and layout of a page.' },
    { q: 'Color theory primary colors (light/screen) are:', opts: ['Red, Yellow, Blue', 'Red, Green, Blue', 'Cyan, Magenta, Yellow', 'Orange, Purple, Green'], ans: 1, exp: 'For screens (additive color), the primaries are Red, Green, and Blue (RGB).' },
    { q: 'What is visual hierarchy?', opts: ['A list of designers', 'Organizing elements to guide the user\'s eye', 'Color contrast ratio', 'The number of UI components'], ans: 1, exp: 'Visual hierarchy arranges elements by importance using size, color, and placement.' },
  ],
  'default': [
    { q: 'What is a variable in programming?', opts: ['A fixed value', 'A named storage location for data', 'A function', 'A loop'], ans: 1, exp: 'A variable is a named memory location that stores a value which can change during program execution.' },
    { q: 'What is an algorithm?', opts: ['A programming language', 'A step-by-step problem-solving procedure', 'A database', 'A computer chip'], ans: 1, exp: 'An algorithm is a sequence of well-defined steps to solve a problem.' },
    { q: 'What does debugging mean?', opts: ['Writing code', 'Finding and fixing errors', 'Running a program', 'Designing a UI'], ans: 1, exp: 'Debugging is the process of identifying and resolving bugs (errors) in code.' },
    { q: 'What is a function?', opts: ['A data type', 'A reusable block of code', 'A database table', 'An operating system'], ans: 1, exp: 'A function is a reusable block of code that performs a specific task.' },
    { q: 'What does "compile" mean?', opts: ['Run the program', 'Save a file', 'Translate code to machine language', 'Delete errors'], ans: 2, exp: 'Compiling translates human-readable source code into machine-executable code.' },
  ],
};

/** Find the best matching question set for a topic name */
const getQuestionsForTopic = (topicName) => {
  const lower = topicName.toLowerCase();
  const keys = Object.keys(topicQuestions);
  // Try each key as a substring match
  const match = keys.find(k => k !== 'default' && lower.includes(k));
  return topicQuestions[match] || topicQuestions['default'];
};

/** Stable unique ID for each topic by position */
const makeTopicId = (careerId, flatIdx) => `${careerId}__t${flatIdx}`;

/* ──────────────────────────────────────────────────────────────
   Unlock check — only needs the PREVIOUS topic to be done+passed
   ────────────────────────────────────────────────────────────── */
const getUnlockInfo = (careerId, flatTopics, idx, topicsCompleted, quizScores) => {
  if (idx === 0) return { ok: true, reason: '' };
  const prevId = makeTopicId(careerId, idx - 1);
  const prevName = flatTopics[idx - 1];
  const learned = topicsCompleted.includes(prevId);
  const score = quizScores[prevId] || 0;
  if (!learned) return { ok: false, reason: `Study & complete "${prevName}" first` };
  if (score < 70) return { ok: false, reason: `Pass "${prevName}" quiz with ≥70% (you got ${score}%)` };
  return { ok: true, reason: '' };
};

/* ──────────────────────────────────────────────────────────────
   Inline Quiz Modal
   ────────────────────────────────────────────────────────────── */
function InlineQuiz({ topicName, topicId, questions, onClose }) {
  const { saveQuizScore } = useStudentStore();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExp, setShowExp] = useState(false);
  const [result, setResult] = useState(null); // { score, passed }
  const [celebration, setCelebration] = useState(null);

  const q = questions[qIdx];

  const pick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);
  };

  const next = () => {
    const isCorrect = selected === q.ans;
    const newAns = [...answers, isCorrect];
    setAnswers(newAns);
    setSelected(null);
    setShowExp(false);

    if (qIdx + 1 < questions.length) {
      setQIdx(qIdx + 1);
    } else {
      finish(newAns);
    }
  };

  const finish = (allAnswers) => {
    const correct = allAnswers.filter(Boolean).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;
    const xpEarned = passed ? 75 : 15;
    const coinsEarned = passed ? 30 : 5;

    const oldLevel = getLevelInfo(useStudentStore.getState().xp);
    saveQuizScore(topicId, score, xpEarned, coinsEarned);
    const newLevel = getLevelInfo(useStudentStore.getState().xp);

    setResult({ score, passed });
    setCelebration({ score, xpEarned, coinsEarned, leveledUp: newLevel.level > oldLevel.level, oldLevel, newLevel });

    if (passed) {
      toast.success(`✅ Quiz passed (${score}%)! Next topic unlocked!`, { duration: 3500 });
    } else {
      toast.error(`❌ ${score}% — Need 70% to unlock next topic. Try again!`, { duration: 3500 });
    }
  };

  const retry = () => {
    setQIdx(0); setSelected(null); setAnswers([]); setShowExp(false); setResult(null); setCelebration(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>

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
          title={`${topicName} Quiz 🎉`}
          type="quiz"
        />
      )}

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-lg">

        {/* Header */}
        <div className="glass p-4 mb-3 flex items-center justify-between rounded-xl">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-0.5">📝 Topic Quiz</p>
            <h3 className="font-display font-bold text-white text-lg">{topicName}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10">✕</button>
        </div>

        {/* Result Screen */}
        {result ? (
          <div className="glass p-8 text-center rounded-xl">
            <div className="text-6xl mb-4">{result.passed ? '🏆' : '📚'}</div>
            <div className={`text-6xl font-display font-bold mb-3 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.score}<span className="text-2xl text-slate-500">/100</span>
            </div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${result.passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
              {result.passed ? '✅ Passed! Next topic is now unlocked.' : `❌ Need 70% to unlock next — try again`}
            </div>
            <p className="text-xs text-slate-500 mb-6">
              {result.passed
                ? 'Excellent work! Click "Back to Roadmap" to continue your journey.'
                : 'Review the topic and try again. You need at least 70% to progress.'}
            </p>
            <div className="flex gap-3">
              {!result.passed && (
                <button onClick={retry} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5">
                  <RefreshCw size={14} /> Retry Quiz
                </button>
              )}
              <button onClick={onClose} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
                <CheckCircle2 size={14} /> Back to Roadmap
              </button>
            </div>
          </div>
        ) : (
          // Question Screen
          <div className="glass p-6 rounded-xl space-y-5">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Question {qIdx + 1} of {questions.length}</span>
                <span className="text-amber-400 font-medium">Need 70% to unlock next topic</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}
                  animate={{ width: `${((qIdx) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div key={qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-white font-medium mb-5 leading-relaxed text-base">{q.q}</p>
                <div className="space-y-2.5">
                  {q.opts.map((opt, i) => {
                    let bg = 'rgba(255,255,255,0.04)';
                    let border = '1px solid rgba(255,255,255,0.1)';
                    let textClass = 'text-slate-300';
                    if (selected !== null) {
                      if (i === q.ans) { bg = 'rgba(16,185,129,0.15)'; border = '1px solid rgba(16,185,129,0.5)'; textClass = 'text-emerald-300 font-semibold'; }
                      else if (i === selected) { bg = 'rgba(239,68,68,0.12)'; border = '1px solid rgba(239,68,68,0.4)'; textClass = 'text-red-400'; }
                    }
                    return (
                      <motion.button key={i} whileHover={selected === null ? { x: 5 } : {}}
                        onClick={() => pick(i)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${textClass}`}
                        style={{ background: bg, border }}>
                        <span className="font-bold text-slate-500 w-5 flex-shrink-0">{['A','B','C','D'][i]}.</span>
                        <span className="flex-1">{opt}</span>
                        {selected !== null && i === q.ans && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                        {selected !== null && i === selected && i !== q.ans && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExp && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <p className="text-blue-400 font-semibold text-xs mb-1">💡 Explanation</p>
                    <p className="text-slate-300 text-sm">{q.exp}</p>
                  </motion.div>
                )}

                {selected !== null && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={next}
                    className="btn-primary mt-5 flex items-center gap-2">
                    {qIdx + 1 < questions.length
                      ? <><span>Next Question</span><ArrowRight size={16} /></>
                      : <><span>View Result</span><Trophy size={16} /></>}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Roadmap Page
   ────────────────────────────────────────────────────────────── */
export default function Roadmap() {
  const { careerGoal, roadmapProgress, completeTopic, topicsCompleted, quizScores } = useStudentStore();
  const [expandedMonth, setExpandedMonth] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null); // { topicName, topicId, questions }

  const career = careerPaths.find(c => c.id === careerGoal) || careerPaths[0];
  const customOrder = roadmapProgress?.customOrder || [];

  // Flat ordered topic list (weak topics first if baseline set them)
  const allTopics = career.roadmap.flatMap(m => m.topics);
  const weak = allTopics.filter(t => customOrder.some(co => t.toLowerCase().includes(co.toLowerCase())));
  const others = allTopics.filter(t => !weak.includes(t));
  const flatTopics = [...weak, ...others];

  // Rebuild into phases of 4 topics each
  const phases = [];
  for (let i = 0; i < flatTopics.length; i += 4) {
    const phaseNum = Math.floor(i / 4) + 1;
    phases.push({
      title: phaseNum === 1 && weak.length > 0 ? '🔥 AI Priority Focus' : `Phase ${phaseNum}`,
      topics: flatTopics.slice(i, i + 4),
    });
  }

  // Progress counters
  const totalTopics = flatTopics.length;
  const doneCount = flatTopics.filter((_, idx) => {
    const id = makeTopicId(career.id, idx);
    return topicsCompleted.includes(id) && (quizScores[id] || 0) >= 70;
  }).length;
  const pct = Math.round((doneCount / totalTopics) * 100) || 0;

  const phaseProgress = (phaseIdx) => {
    const p = phases[phaseIdx];
    const start = phaseIdx * 4;
    const done = p.topics.filter((_, i) => {
      const id = makeTopicId(career.id, start + i);
      return topicsCompleted.includes(id) && (quizScores[id] || 0) >= 70;
    }).length;
    return Math.round((done / p.topics.length) * 100);
  };

  const handleMarkDone = (topicName, flatIdx) => {
    const id = makeTopicId(career.id, flatIdx);
    if (topicsCompleted.includes(id)) { toast('Already marked done!'); return; }
    completeTopic(id);
    toast.success(`"${topicName}" completed! +100 XP. Now take the quiz to unlock the next topic.`, { icon: '✅' });
  };

  const openQuiz = (topicName, flatIdx) => {
    const id = makeTopicId(career.id, flatIdx);
    const questions = getQuestionsForTopic(topicName);
    setActiveQuiz({ topicName, topicId: id, questions });
  };

  return (
    <Layout title="My Roadmap">
      {/* Inline Quiz Overlay */}
      <AnimatePresence>
        {activeQuiz && (
          <InlineQuiz
            topicName={activeQuiz.topicName}
            topicId={activeQuiz.topicId}
            questions={activeQuiz.questions}
            onClose={() => setActiveQuiz(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Header Card ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{career.icon}</span>
                <div>
                  <p className="text-blue-400 text-xs font-medium">Your AI Career Roadmap</p>
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

            {/* Ring */}
            <div className="text-center flex-shrink-0">
              <div className="relative w-24 h-24 mx-auto">
                <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <motion.circle cx="50" cy="50" r="42" fill="none"
                    stroke="#3B82F6" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-white">{pct}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{doneCount}/{totalTopics} done</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="progress-bar">
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5 }} />
            </div>
          </div>
        </motion.div>

        {/* ── How it works ── */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Sparkles size={14} className="text-blue-400 flex-shrink-0" />
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex items-center gap-1"><PlayCircle size={11} className="text-blue-400" /><span className="text-blue-300 font-semibold">Learn</span></span>
            <span>→</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-400" /><span className="text-emerald-300 font-semibold">Mark Done</span></span>
            <span>→</span>
            <span className="flex items-center gap-1"><BookOpen size={11} className="text-purple-400" /><span className="text-purple-300 font-semibold">Take Quiz (≥70%)</span></span>
            <span>→</span>
            <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" /><span className="text-amber-300 font-semibold">Next Topic Unlocks</span></span>
          </div>
        </div>

        {/* ── Phases ── */}
        <div className="space-y-3">
          {phases.map((phase, phaseIdx) => {
            const phPct = phaseProgress(phaseIdx);
            const isExpanded = expandedMonth === phaseIdx;
            const isComplete = phPct === 100;

            // Phase locked if its first topic is locked
            const firstFlatIdx = phaseIdx * 4;
            const firstLock = getUnlockInfo(career.id, flatTopics, firstFlatIdx, topicsCompleted, quizScores);
            const phaseLocked = !firstLock.ok;

            return (
              <motion.div key={phaseIdx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: phaseIdx * 0.06 }}>

                {/* Phase Header */}
                <div
                  className={`glass p-4 cursor-pointer transition-all ${phaseLocked ? 'opacity-50' : 'hover:border-blue-500/30'}`}
                  style={{
                    border: isComplete ? '1px solid rgba(16,185,129,0.35)' : isExpanded ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onClick={() => !phaseLocked && setExpandedMonth(isExpanded ? -1 : phaseIdx)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{
                        background: isComplete ? 'linear-gradient(135deg,#10B981,#34D399)' : phaseLocked ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))',
                        boxShadow: isComplete ? '0 0 16px rgba(16,185,129,0.3)' : undefined,
                      }}>
                      {phaseLocked ? <Lock size={18} className="text-slate-600" />
                        : isComplete ? <CheckCircle2 size={22} className="text-white" />
                          : <span className="text-white font-display">{phaseIdx + 1}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{phase.title}</h3>
                        {isComplete && <span className="text-xs px-2 py-0.5 rounded-full text-emerald-400" style={{ background: 'rgba(16,185,129,0.1)' }}>✓ Complete</span>}
                        {phaseLocked && <span className="text-xs px-2 py-0.5 rounded-full text-slate-600" style={{ background: 'rgba(255,255,255,0.05)' }}>🔒 Locked</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 progress-bar" style={{ height: 4 }}>
                          <motion.div className="progress-fill" animate={{ width: `${phPct}%` }} style={{ background: isComplete ? '#10B981' : undefined }} />
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0">{phase.topics.length} topics</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isExpanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Topic List */}
                <AnimatePresence>
                  {isExpanded && !phaseLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-2 space-y-2 pb-2">
                        {phase.topics.map((topicName, tIdx) => {
                          const flatIdx = phaseIdx * 4 + tIdx;
                          const topicId = makeTopicId(career.id, flatIdx);
                          const learned = topicsCompleted.includes(topicId);
                          const quizScore = quizScores[topicId] || 0;
                          const passed = quizScore >= 70;

                          const lock = getUnlockInfo(career.id, flatTopics, flatIdx, topicsCompleted, quizScores);
                          const locked = !lock.ok;

                          // Visual state
                          const statusColor = learned && passed ? 'rgba(16,185,129,0.08)' : locked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)';
                          const statusBorder = learned && passed ? '1px solid rgba(16,185,129,0.25)' : locked ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.09)';

                          return (
                            <motion.div
                              key={tIdx}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: tIdx * 0.04 }}
                              className={`p-4 rounded-xl transition-all ${locked ? 'opacity-40' : ''}`}
                              style={{ background: statusColor, border: statusBorder }}
                            >
                              <div className="flex items-start gap-3">
                                {/* Step indicator */}
                                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                                  style={{
                                    background: learned && passed ? 'linear-gradient(135deg,#10B981,#34D399)'
                                      : locked ? 'rgba(255,255,255,0.05)'
                                        : learned ? 'rgba(245,158,11,0.2)'
                                          : 'rgba(59,130,246,0.2)',
                                    border: learned && passed ? 'none'
                                      : locked ? '2px solid rgba(255,255,255,0.08)'
                                        : learned ? '2px solid rgba(245,158,11,0.4)'
                                          : '2px solid rgba(59,130,246,0.3)',
                                  }}>
                                  {locked ? <Lock size={12} className="text-slate-600" />
                                    : learned && passed ? <CheckCircle2 size={14} className="text-white" />
                                      : learned ? <span className="text-amber-400 text-xs font-bold">!</span>
                                        : <span className="text-blue-400 text-xs font-bold">{flatIdx + 1}</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-sm ${learned && passed ? 'line-through text-slate-500' : locked ? 'text-slate-600' : 'text-slate-200'}`}>
                                    {topicName}
                                  </p>

                                  {/* Status messages */}
                                  {locked && (
                                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                                      <AlertCircle size={10} /> {lock.reason}
                                    </p>
                                  )}
                                  {!locked && !learned && (
                                    <p className="text-[11px] text-blue-400 mt-1">👉 Study this topic first, then mark it done</p>
                                  )}
                                  {!locked && learned && !passed && (
                                    <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                                      ⚠️ Take the quiz and score ≥70% to unlock next topic {quizScore > 0 ? `(Last: ${quizScore}%)` : ''}
                                    </p>
                                  )}
                                  {!locked && learned && passed && (
                                    <p className="text-[11px] text-emerald-400 mt-1">
                                      ✓ Completed & quiz passed ({quizScore}%) — Next topic unlocked!
                                    </p>
                                  )}

                                  {/* Action buttons */}
                                  {!locked && (
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                      {/* Learn button (always visible when not locked) */}
                                      <Link to="/learning"
                                        className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                                        <PlayCircle size={12} /> Learn
                                      </Link>

                                      {/* Mark Done (only if not yet done) */}
                                      {!learned && (
                                        <button onClick={() => handleMarkDone(topicName, flatIdx)}
                                          className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                          <CheckCircle2 size={12} /> Mark Done
                                        </button>
                                      )}

                                      {/* Quiz button — if done but not passed */}
                                      {learned && !passed && (
                                        <button onClick={() => openQuiz(topicName, flatIdx)}
                                          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 animate-pulse">
                                          <BookOpen size={12} /> Take Quiz →
                                        </button>
                                      )}

                                      {/* Retake quiz if passed */}
                                      {learned && passed && (
                                        <button onClick={() => openQuiz(topicName, flatIdx)}
                                          className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                                          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                          <RefreshCw size={11} /> Retake
                                        </button>
                                      )}

                                      {/* XP reward */}
                                      {learned && passed && (
                                        <span className="text-xs text-emerald-400 font-semibold ml-auto">+100 XP ✓</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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

        {/* Target Companies */}
        <div className="glass p-5">
          <h3 className="font-display font-semibold text-white mb-3">🎯 Target Companies</h3>
          <div className="flex flex-wrap gap-2">
            {career.companies.map(c => (
              <span key={c} className="px-3 py-1.5 rounded-xl text-sm text-slate-300"
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
