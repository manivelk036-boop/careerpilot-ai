import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CareerGoal from './pages/CareerGoal';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import PlacementScore from './pages/PlacementScore';
import Companies from './pages/Companies';
import Aptitude from './pages/Aptitude';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import Salary from './pages/Salary';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BaselineAssessment from './pages/BaselineAssessment';
import { Toaster } from 'react-hot-toast';
import { useStudentStore } from './store/useStudentStore';
import Layout from './components/Layout';
import { useEffect } from 'react';

// Simple placeholder page component for routes without full pages yet
const Placeholder = ({ title }) => (
  <Layout title={title}>
    <div className="glass p-8 text-center text-slate-400">
      <h2 className="text-xl font-bold text-white mb-2">{title} Page</h2>
      <p>This gamified feature is being loaded by CareerPilot AI. Stay tuned!</p>
    </div>
  </Layout>
);

function ProtectedRoute({ children }) {
  const { isLoggedIn, careerGoal, baselineAssessmentCompleted } = useStudentStore();
  if (!isLoggedIn) return <Navigate to="/" />;
  if (!careerGoal) return <Navigate to="/career-goal" />;
  if (!baselineAssessmentCompleted) return <Navigate to="/baseline-assessment" />;
  return children;
}

function CareerGoalRoute({ children }) {
  const { isLoggedIn, careerGoal, baselineAssessmentCompleted } = useStudentStore();
  if (!isLoggedIn) return <Navigate to="/" />;
  if (careerGoal && baselineAssessmentCompleted) return <Navigate to="/dashboard" />;
  return children;
}

function BaselineAssessmentRoute({ children }) {
  const { isLoggedIn, careerGoal, baselineAssessmentCompleted } = useStudentStore();
  if (!isLoggedIn) return <Navigate to="/" />;
  if (!careerGoal) return <Navigate to="/career-goal" />;
  if (baselineAssessmentCompleted) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  const { isLoggedIn, email, syncFromBackend } = useStudentStore();

  // Sync state on boot if logged in
  useEffect(() => {
    if (isLoggedIn && email && syncFromBackend) {
      syncFromBackend();
    }
  }, [isLoggedIn, email, syncFromBackend]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#0A0F1E', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.08)' 
          } 
        }} 
      />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Onboarding Routes */}
        <Route path="/career-goal" element={<CareerGoalRoute><CareerGoal /></CareerGoalRoute>} />
        <Route path="/baseline-assessment" element={<BaselineAssessmentRoute><BaselineAssessment /></BaselineAssessmentRoute>} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        
        <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/placement-score" element={<ProtectedRoute><PlacementScore /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
