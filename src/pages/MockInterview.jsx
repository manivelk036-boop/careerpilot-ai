import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Square, ChevronRight, Sparkles, Brain, Video as VideoIcon,
  Target, MessageSquare, Clock, RefreshCw, Trophy, Download, Play, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────
   Rich, role-specific question banks + dummy answer banks
   ───────────────────────────────────────────────────────────── */
const interviewRoles = [
  {
    id: 'se',
    title: 'Software Engineer',
    emoji: '💻',
    color: 'from-blue-500 to-cyan-500',
    description: 'System design, data structures, and coding concepts',
    questions: [
      'Explain the difference between a stack and a queue. Give a real-world use-case for each.',
      'What is time complexity? Compare the time complexity of bubble sort and merge sort.',
      'What is the difference between SQL and NoSQL databases? When would you choose each?',
      'Explain what a REST API is. What are the key HTTP methods and their uses?',
      'What is object-oriented programming? Explain the four main principles with examples.',
    ],
    dummyAnswers: [
      'A stack is a LIFO structure — last in, first out. A real-world example is the browser back button — each page visit is pushed and the back action pops it. A queue is FIFO — first in, first out. A real-world example is a print queue where jobs are processed in submission order.',
      'Time complexity measures how the runtime of an algorithm scales with input size. Bubble sort has O(n²) average complexity because it compares every element against every other. Merge sort has O(n log n) because it divides the list in half recursively, making it far more efficient on large datasets.',
      'SQL databases are relational with fixed schemas — great for transactional data like banking. NoSQL databases like MongoDB use flexible document models and scale horizontally, making them better for unstructured data like user content feeds or IoT streams.',
      'REST (Representational State Transfer) is an architectural style for building web services over HTTP. GET retrieves data, POST creates resources, PUT updates them, DELETE removes them. Status codes like 200 (Success), 404 (Not Found), and 500 (Server Error) communicate results clearly.',
      'OOP is a paradigm centered around objects. The four principles are: Encapsulation — hiding internal state behind methods; Inheritance — child classes inheriting parent behavior; Polymorphism — one interface, many forms; Abstraction — hiding implementation details behind interfaces.',
    ],
  },
  {
    id: 'da',
    title: 'Data Analyst',
    emoji: '📊',
    color: 'from-violet-500 to-purple-600',
    description: 'SQL, statistics, data visualization, and analytics',
    questions: [
      'Explain the difference between INNER JOIN and LEFT JOIN in SQL with an example.',
      'What is the difference between mean, median, and mode? When would you use each?',
      'How would you detect and handle outliers in a dataset?',
      'What is a pivot table and how is it used in data analysis?',
      'Explain the difference between correlation and causation. Give an example of each.',
    ],
    dummyAnswers: [
      'An INNER JOIN returns only rows where there is a match in both tables. A LEFT JOIN returns all rows from the left table and matching rows from the right — NULLs appear where there is no match. For example, joining customers and orders with LEFT JOIN shows all customers even those without orders.',
      'Mean is the average — useful when data is normally distributed. Median is the middle value — better for skewed data like salary distributions where outliers distort the mean. Mode is the most frequent value — useful for categorical data like finding the most popular product.',
      'I would first visualize the data with box plots or histograms to spot outliers visually. Then I would use the IQR method — flagging values outside 1.5 times the IQR from the quartiles. Depending on context, I would remove them, cap them (winsorization), or keep them if they represent real edge cases.',
      'A pivot table reorganizes data by grouping rows into categories and computing aggregate metrics like sums or counts across columns. For example, pivoting a sales table by region and product category quickly shows which combination drives the most revenue.',
      'Correlation means two variables move together — e.g., ice cream sales and drowning rates both rise in summer. Causation means one variable directly causes another — e.g., smoking causes lung cancer. Correlation does not imply causation; controlled experiments or causal inference methods are needed to establish causation.',
    ],
  },
  {
    id: 'pm',
    title: 'Product Manager',
    emoji: '🎯',
    color: 'from-emerald-500 to-teal-600',
    description: 'Strategy, prioritization, metrics, and leadership',
    questions: [
      'Walk me through how you would prioritize a backlog of 20 feature requests for a B2B SaaS product.',
      'You are the PM for Instagram Stories. How would you define and measure success for a new "Remix" feature?',
      'A key metric drops 20% overnight. Walk me through how you would diagnose the root cause.',
      'Explain Agile methodology. How does it differ from Waterfall and when would you use each?',
      'Design a product for elderly users to video call their grandchildren easily. Walk me through your process.',
    ],
    dummyAnswers: [
      'I would use a prioritization framework like RICE — scoring each feature on Reach, Impact, Confidence, and Effort. I would also run stakeholder interviews to understand business goals and user pain points. High-impact, low-effort features with strong user demand get shipped first. I would also consider strategic alignment with the product roadmap.',
      'Success for a Remix feature would be measured by adoption rate (% of Stories users who use Remix within 30 days), engagement lift (increase in time spent viewing Stories containing remixes), and viral coefficient (how many new users a Remix brings in). I would also track creator satisfaction through surveys and NPS.',
      'I would first check if it is a data pipeline issue — a logging or tracking bug causing a false drop. If the data is clean, I would segment the drop by platform, region, user cohort, and feature to isolate where it is happening. I would correlate with recent releases, infrastructure changes, or external events like competitor launches.',
      'Agile is iterative — teams deliver in short sprints, incorporate feedback, and adapt. Waterfall is linear — requirements are fixed upfront and delivered at the end. Agile is better for products with evolving requirements like consumer apps. Waterfall suits projects with strict compliance requirements like government software.',
      'I would start with user research — interviewing elderly users to understand their tech comfort level and pain points. Key insights: large touch targets, minimal steps, high contrast UI, and voice guidance. The MVP would be a one-button video call app pre-configured with family contacts. I would test prototypes with actual elderly users before building.',
    ],
  },
  {
    id: 'uiux',
    title: 'UI/UX Designer',
    emoji: '🎨',
    color: 'from-pink-500 to-rose-600',
    description: 'Design thinking, usability, prototyping, and research',
    questions: [
      'What is the difference between UX and UI design? How do they complement each other?',
      'Explain the design thinking process and its 5 stages.',
      'How do you conduct user research? Name 2 methods and when to use each.',
      'What is a usability heuristic? Describe 3 of Nielsen\'s 10 heuristics.',
      'Describe a time you received negative feedback on a design. How did you handle it?',
    ],
    dummyAnswers: [
      'UX (User Experience) focuses on the overall journey — how users feel as they achieve goals. It involves research, wireframing, and flow design. UI (User Interface) focuses on the visual layer — colors, typography, components, and spacing. They complement each other because great UX with poor UI looks unfinished, and beautiful UI with poor UX frustrates users.',
      'Design Thinking has 5 stages: Empathize — deeply understand user needs through research and observation. Define — synthesize findings into a clear problem statement. Ideate — generate many creative solutions without judgment. Prototype — build low-fidelity representations to test ideas quickly. Test — validate with real users and iterate based on feedback.',
      'Two key methods: User interviews are great for qualitative insight — ideal early in the process to uncover motivations and mental models. Usability testing is ideal for evaluating specific flows — you watch users complete tasks to spot friction points. I choose interviews when exploring problems and usability tests when validating solutions.',
      'Three heuristics: Visibility of system status — users should always know what is happening, e.g., loading spinners. Error prevention — design so users cannot make mistakes, e.g., disabling a submit button until a form is complete. Recognition over recall — show options rather than making users remember commands, e.g., dropdown menus over command lines.',
      'During a fintech app project, stakeholders disliked my minimal dashboard design — they wanted more data visible upfront. I went back to users, ran card sorting exercises, and discovered that experienced users did want more density. I iterated to a configurable dashboard where users could pin their key metrics. The final design satisfied both simplicity for new users and power for experienced ones.',
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Engineer',
    emoji: '☁️',
    color: 'from-sky-500 to-blue-600',
    description: 'AWS/GCP/Azure, DevOps, containers, and infrastructure',
    questions: [
      'Explain the difference between IaaS, PaaS, and SaaS. Give an example of each.',
      'What is containerization? Compare Docker and a virtual machine.',
      'Explain the concept of auto-scaling. When would you use horizontal vs vertical scaling?',
      'What is a CI/CD pipeline? Describe the stages from code commit to production.',
      'What is Kubernetes and what problem does it solve?',
    ],
    dummyAnswers: [
      'IaaS (Infrastructure as a Service) provides raw compute, storage, and networking — e.g., AWS EC2. PaaS (Platform as a Service) adds managed runtimes and middleware so developers can focus on code — e.g., Heroku. SaaS (Software as a Service) delivers a complete application over the internet — e.g., Google Docs. Each layer abstracts away more infrastructure complexity.',
      'Containerization packages an application with all its dependencies into a lightweight, portable unit. Docker containers share the host OS kernel, making them fast and resource-efficient. Virtual machines include a full OS per instance, using more resources but offering stronger isolation. Containers are ideal for microservices; VMs for workloads requiring full OS isolation.',
      'Auto-scaling automatically adjusts compute capacity based on demand. Horizontal scaling adds more instances — better for stateless web servers because it distributes load. Vertical scaling increases the size of a single instance — simpler but has hardware limits and causes downtime. Horizontal scaling is preferred in cloud architectures for resilience.',
      'A CI/CD pipeline automates software delivery. CI (Continuous Integration) stage: developer commits code, automated tests run, and the build is verified. CD (Continuous Deployment) stage: the artifact is deployed to staging, integration tests run, and after approval it is released to production. This enables faster, reliable releases with reduced manual effort.',
      'Kubernetes is an open-source container orchestration platform. It solves the problem of managing hundreds of containers at scale — handling deployment, self-healing (restarting failed containers), load balancing, service discovery, and rolling updates automatically. Without Kubernetes, managing microservice architectures at scale would require extensive manual scripting.',
    ],
  },
];

const scoreAnswer = (answer, role) => {
  const wordCount = answer.trim().split(/\s+/).length;
  let base = Math.min(90, 50 + wordCount * 0.8);
  const keywords = {
    se: ['complexity', 'oop', 'rest', 'sql', 'nosql', 'object', 'algorithm', 'http', 'api'],
    da: ['join', 'sql', 'outlier', 'correlation', 'pivot', 'mean', 'median', 'distribution'],
    pm: ['metric', 'user', 'feature', 'agile', 'sprint', 'impact', 'stakeholder', 'ux', 'kpi'],
    uiux: ['ux', 'ui', 'user', 'prototype', 'heuristic', 'research', 'wireframe', 'empathy'],
    cloud: ['docker', 'kubernetes', 'container', 'scaling', 'ci', 'cd', 'aws', 'iaas', 'paas'],
  };
  const kws = keywords[role] || [];
  const hits = kws.filter(k => answer.toLowerCase().includes(k)).length;
  base = Math.min(98, base + hits * 3);
  return Math.round(base);
};

const generateFeedback = (answer, score, role) => {
  if (score >= 85) return 'Excellent answer — strong structure, clear technical terminology, and good depth.';
  if (score >= 70) return 'Good answer. Covered the core concepts well. Could add a real-world example to strengthen it.';
  if (score >= 55) return 'Decent answer. Try to use more specific terminology and structure your response with a clear beginning, middle, and conclusion.';
  return 'Answer was too brief. Practice the STAR method: Situation, Task, Action, Result for behavioral questions.';
};

export default function MockInterview() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [responseText, setResponseText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Video recording states and refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);

  const { completeMockInterview, mockInterviewsDone, careerGoal } = useStudentStore();

  const suggestedRoleId = (() => {
    if (careerGoal === 'java-developer' || careerGoal === 'python-developer' || careerGoal === 'full-stack') return 'se';
    if (careerGoal === 'data-analyst' || careerGoal === 'ai-engineer') return 'da';
    if (careerGoal === 'uiux-designer') return 'uiux';
    if (careerGoal === 'cloud-engineer' || careerGoal === 'devops') return 'cloud';
    return null;
  })();

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(t => t + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStart = (roleId) => {
    setSelectedRole(roleId);
    setQIndex(0);
    setAnswers([]);
    setResponseText('');
    setIsRecording(false);
    setResult(null);
    setVideoBlobUrl(null);
    chunksRef.current = [];
  };

  // Start webcam and recording
  const startMediaRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
      };

      recorder.start(1000); // chunk every 1 sec
      setIsRecording(true);
      setResponseText('');
    } catch (err) {
      console.error('Webcam/Mic access error:', err);
      toast.error('Failed to access camera or microphone. Please check permissions.');
    }
  };

  // Stop recording and stream
  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopMediaRecording();
      // Inject dummy answer if empty
      if (!responseText.trim()) {
        const role = interviewRoles.find(r => r.id === selectedRole);
        setResponseText(role.dummyAnswers[qIndex] || 'I would approach this methodically.');
      }
    } else {
      startMediaRecording();
    }
  };

  const handleNext = () => {
    // Stop recording if active before moving to next
    if (isRecording) {
      stopMediaRecording();
    }

    const roleObj = interviewRoles.find(r => r.id === selectedRole);
    const newAnswers = [...answers, {
      question: roleObj.questions[qIndex],
      answer: responseText || 'No answer provided.',
    }];
    setAnswers(newAnswers);
    setResponseText('');

    if (qIndex + 1 < roleObj.questions.length) {
      setQIndex(qIndex + 1);
    } else {
      handleSubmit(newAnswers, roleObj);
    }
  };

  const handleSubmit = async (finalAns, roleObj) => {
    stopMediaRecording();
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));

    const feedback = finalAns.map((a, idx) => {
      const score = scoreAnswer(a.answer, selectedRole);
      return {
        q: a.question,
        answer: a.answer,
        score,
        review: generateFeedback(a.answer, score, selectedRole),
      };
    });

    const overallScore = Math.round(feedback.reduce((s, f) => s + f.score, 0) / feedback.length);
    setResult({ score: overallScore, feedback, roleTitle: roleObj.title });
    completeMockInterview();
    setAnalyzing(false);
    toast.success(`Interview complete! +150 XP +75 🪙`, { icon: '🎤' });
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatSecs = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  /* ──── Result Screen ──── */
  if (result) {
    const grade = result.score >= 85 ? { label: 'Excellent', color: '#10B981' }
      : result.score >= 70 ? { label: 'Good', color: '#3B82F6' }
        : result.score >= 55 ? { label: 'Average', color: '#F59E0B' }
          : { label: 'Needs Work', color: '#EF4444' };

    return (
      <Layout title="AI Interview Feedback">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 text-center space-y-6">
            <div className="text-5xl">🤖</div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white mb-1">AI Interview Report</h2>
              <p className="text-slate-500 text-sm">{result.roleTitle} Interview · {result.feedback.length} Questions</p>
            </div>
            
            <div className="text-7xl font-display font-bold" style={{ color: grade.color }}>
              {result.score}<span className="text-3xl text-slate-500">/100</span>
            </div>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${grade.color}20`, color: grade.color }}>
                {grade.label}
              </span>
            </div>

            {/* Video preview / download section */}
            {videoBlobUrl && (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><VideoIcon size={14} className="text-blue-400" /> Recorded Session</span>
                  <a href={videoBlobUrl} download={`mock-interview-${selectedRole}.webm`} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                    <Download size={12} /> Download WebM
                  </a>
                </div>
                <video src={videoBlobUrl} controls className="w-full rounded-lg border border-white/10 aspect-video bg-black" />
              </div>
            )}

            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {result.score >= 85
                ? 'Outstanding performance! Clear articulation, strong depth, and excellent keyword coverage.'
                : result.score >= 70
                  ? 'Good performance! Work on elaborating answers with more examples and domain-specific terms.'
                  : 'Keep practicing! Focus on structured responses using the STAR method and learning domain terminology.'}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-xl font-bold text-blue-400">{mockInterviewsDone}</p>
                <p className="text-xs text-slate-500 mt-1">Interviews</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xl font-bold text-amber-400">+150</p>
                <p className="text-xs text-slate-500 mt-1">XP Earned</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xl font-bold text-purple-400">+75</p>
                <p className="text-xs text-slate-500 mt-1">Coins</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">📋 Question-by-Question Breakdown</h3>
            {result.feedback.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="glass p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-medium text-white text-sm leading-relaxed">Q{idx + 1}: {item.q}</h4>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                    item.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                    item.score >= 70 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.score}/100
                  </span>
                </div>
                <p className="text-slate-400 text-xs italic px-3 py-2 rounded-xl border-l-2 border-slate-600" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  "{item.answer}"
                </p>
                <p className="text-xs text-slate-400 flex items-start gap-2">
                  <Sparkles size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><span className="font-medium text-blue-400">AI Feedback: </span>{item.review}</span>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleStart(selectedRole)} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2">
              <RefreshCw size={16} /> Retry Same Role
            </button>
            <button onClick={() => { setSelectedRole(null); setResult(null); }} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              <ChevronRight size={16} /> Try Another Role
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  /* ──── Interview Session Screen ──── */
  if (selectedRole) {
    const roleObj = interviewRoles.find(r => r.id === selectedRole);
    const question = roleObj.questions[qIndex];

    return (
      <Layout title={`Mock Interview — ${roleObj.title}`}>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between mb-1">
            <button onClick={() => { stopMediaRecording(); setSelectedRole(null); }} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              ← Exit Interview
            </button>
            <span className="text-xs text-slate-500">{qIndex + 1} / {roleObj.questions.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }}
              animate={{ width: `${((qIndex + 1) / roleObj.questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Video Preview Box (if active) */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/60 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: isRecording ? 'block' : 'none' }}
            />
            {!isRecording && (
              <div className="text-center p-6 space-y-2">
                <VideoIcon size={40} className="text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-400">Camera Preview Inactive</p>
                <p className="text-xs text-slate-500">Click the microphone to start audio/video recording.</p>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-full animate-pulse border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500" /> REC {formatSecs(recordTime)}
              </div>
            )}
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass p-8 border border-white/10"
            >
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                Question {qIndex + 1}
              </span>
              <h3 className="text-lg font-semibold text-white leading-relaxed">{question}</h3>
            </motion.div>
          </AnimatePresence>

          {/* Recording & Response controls */}
          {!analyzing ? (
            <div className="glass p-6 space-y-5">
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={toggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg transition-all ${
                    isRecording
                      ? 'bg-red-600 border-red-500 shadow-red-500/30'
                      : 'bg-blue-600 border-blue-500 shadow-blue-500/20 hover:bg-blue-500'
                  }`}
                >
                  {isRecording ? <Square size={24} className="text-white" /> : <Mic size={28} className="text-white" />}
                </motion.button>
              </div>

              {isRecording && (
                <div className="flex justify-center gap-1 items-end h-8">
                  {[...Array(14)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [6, Math.random() * 28 + 6, 6] }}
                      transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.3, delay: i * 0.04 }}
                      className="w-1.5 rounded-full bg-blue-500"
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 block">
                  {isRecording ? '🎙️ Recording session... speak your answer or type below' : '💬 Your Response'}
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Click the mic button to start recording, or type your answer here..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-slate-300 font-sans focus:border-blue-500 outline-none resize-none"
                  rows={5}
                />
              </div>

              {responseText.trim() && !isRecording && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <span>{qIndex + 1 < roleObj.questions.length ? 'Next Question' : '📊 Finish & Analyze'}</span>
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-12 text-center flex flex-col items-center border border-white/10"
            >
              <div className="relative mb-6">
                <Sparkles size={48} className="text-blue-400 animate-pulse" />
              </div>
              <h3 className="font-semibold text-white mb-2">AI is analyzing your responses...</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Evaluating language structure, keyword density, technical depth, and answer completeness.
              </p>
              <div className="flex gap-1 mt-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                    className="w-2 h-2 rounded-full bg-blue-400"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
    );
  }

  /* ──── Role Selection Screen ──── */
  return (
    <Layout title="Mock Interview Room">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">🎤 AI Mock Interview Simulator</h2>
          <p className="text-slate-500 text-sm">
            Practice role-specific interview questions with live camera recording and get detailed AI feedback reports.
          </p>
        </div>

        {suggestedRoleId && (
          <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Brain size={16} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              <span className="text-blue-400 font-semibold">AI Recommendation:</span> Based on your career goal, we suggest starting with the <span className="text-white font-medium">{interviewRoles.find(r => r.id === suggestedRoleId)?.title}</span> interview.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewRoles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ y: -4 }}
              className="glass p-6 flex flex-col"
              style={{ border: role.id === suggestedRoleId ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.08)' }}
            >
              {role.id === suggestedRoleId && (
                <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full self-start mb-3 uppercase tracking-wider">
                  ⭐ Recommended
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {role.emoji}
              </div>
              <h3 className="font-semibold text-white text-lg mb-1">{role.title}</h3>
              <p className="text-xs text-slate-500 mb-4 flex-1">{role.description}</p>

              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                <Clock size={12} />
                <span>{role.questions.length} questions</span>
                <span>·</span>
                <span>~{role.questions.length * 3}–{role.questions.length * 5} mins</span>
              </div>

              <button
                onClick={() => handleStart(role.id)}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                <VideoIcon size={14} /> Start Interview
              </button>
            </motion.div>
          ))}
        </div>

        {mockInterviewsDone > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-5 flex items-center gap-4"
          >
            <Trophy size={28} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">{mockInterviewsDone} Interview{mockInterviewsDone > 1 ? 's' : ''} Completed 🎉</p>
              <p className="text-xs text-slate-500">Keep practicing to boost your Interview Readiness score on your Placement Profile.</p>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
