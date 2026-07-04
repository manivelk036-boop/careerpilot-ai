import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudentStore } from '../store/useStudentStore';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isOnboarded } = useStudentStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const student = await login({ email, password });
      toast.success('Welcome back! 🚀');
      navigate(student.isOnboarded ? '/dashboard' : '/career-goal');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      const student = await login({ email: 'alex@demo.com', password: 'password' });
      toast.success('Demo mode activated! 🎯');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to activate demo mode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#050912' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(100px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-glow-blue" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">CareerPilot AI</h1>
          <p className="text-slate-500 text-sm">Your Personal AI Placement Coach</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="font-display font-bold text-xl text-white mb-6">Welcome back 👋</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@college.edu"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-600" style={{ background: 'rgba(255,255,255,0.04)' }}>or</span>
            </div>
          </div>

          <button
            onClick={handleDemo}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
          >
            <span>🚀</span> Try Demo Account
          </button>

          <p className="text-center text-xs text-slate-600 mt-6">
            New to CareerPilot?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create account</Link>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          {[['50K+', 'Students'], ['1200+', 'Placed'], ['95%', 'Success Rate']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="gradient-text font-display font-bold text-xl">{val}</p>
              <p className="text-xs text-slate-600">{lbl}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
