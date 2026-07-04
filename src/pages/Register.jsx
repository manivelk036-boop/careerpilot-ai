import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../store/useStudentStore';
import { Zap, User, Mail, Lock, GraduationCap, Building, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Academic Info', 'Create Account'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    college: '', department: '', year: '3', cgpa: ''
  });
  const { register } = useStudentStore();
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
        department: form.department,
        year: parseInt(form.year),
        cgpa: parseFloat(form.cgpa) || 0,
        isLoggedIn: true,
      });
      toast.success('Account created! Welcome to CareerPilot 🎉');
      navigate('/career-goal');
    } catch (err) {
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#050912' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(100px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-glow-blue" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Join CareerPilot AI</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-6 px-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: i <= step ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'rgba(255,255,255,0.06)',
                  color: i <= step ? 'white' : '#64748B'
                }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-white' : 'text-slate-600'}`}>{s}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px" style={{ background: i < step ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        <div className="glass p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white mb-4">Personal Information</h3>
                <div>
                  <label className="text-xs font-medium text-slate-400">Full Name</label>
                  <div className="relative mt-1.5">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="input-field pl-11" placeholder="Arjun Mehta" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Email Address</label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="input-field pl-11" placeholder="arjun@college.edu" type="email" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">Next <ArrowRight size={16} /></button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white mb-4">Academic Information</h3>
                <div>
                  <label className="text-xs font-medium text-slate-400">College Name</label>
                  <div className="relative mt-1.5">
                    <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="input-field pl-11" placeholder="Anna University" value={form.college} onChange={e => update('college', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Department</label>
                  <div className="relative mt-1.5">
                    <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="input-field pl-11" placeholder="Computer Science" value={form.department} onChange={e => update('department', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Year</label>
                    <select className="input-field mt-1.5" value={form.year} onChange={e => update('year', e.target.value)}>
                      {['1','2','3','4'].map(y => <option key={y} value={y} style={{background:'#0A0F1E'}}>{y}st/nd/rd/th Year</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">CGPA</label>
                    <input className="input-field mt-1.5" placeholder="8.5" type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={e => update('cgpa', e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex items-center gap-2 px-5"><ArrowLeft size={16} /> Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">Next <ArrowRight size={16} /></button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white mb-4">Create Password</h3>
                <div>
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  <div className="relative mt-1.5">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="input-field pl-11" placeholder="••••••••" type="password" value={form.password} onChange={e => update('password', e.target.value)} />
                  </div>
                </div>
                <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-emerald-400 font-medium mb-2">🎉 You're about to join 50,000+ students!</p>
                  <p className="text-slate-500 text-xs">AI roadmap, gamified learning, mock interviews, and more await you.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2 px-5"><ArrowLeft size={16} /> Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span> 🚀</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
