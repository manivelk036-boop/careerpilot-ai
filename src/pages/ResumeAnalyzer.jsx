import { useState } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Star, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  
  const { resumeScore, resumeKeywords, setResumeScore, addXP, addCoins, updatePlacementScore, placementBreakdown } = useStudentStore();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalyzed(false);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setScanning(true);
    // Simulate ATS scanning
    await new Promise(r => setTimeout(r, 2500));
    
    // Hardcode a realistic high quality score for the demo
    const finalScore = 78;
    const keywords = ['React', 'Spring Boot', 'REST APIs', 'Java', 'SQL', 'Git', 'Agile'];
    
    // Save to store
    setResumeScore(finalScore, keywords);
    
    // Reward XP/Coins
    addXP(100);
    addCoins(30);

    // Update placement breakdown for certifications/projects (since resume highlights them)
    const newBreakdown = { 
      ...placementBreakdown, 
      certifications: Math.min(100, (placementBreakdown.certifications || 60) + 10),
      projects: Math.min(100, (placementBreakdown.projects || 55) + 12)
    };
    updatePlacementScore(newBreakdown);
    
    setScanning(false);
    setAnalyzed(true);
    toast.success('Resume analyzed successfully! +100 XP +30 🪙');
  };

  return (
    <Layout title="Resume ATS Analyzer">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Resume ATS Scanner</h2>
          <p className="text-slate-500 text-sm">Upload your resume to receive an instant ATS score, keyword audit, and optimization tips.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white mb-4">Upload Resume (PDF/DOCX)</h3>
              <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/50 transition-colors relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={scanning}
                />
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Upload size={22} className="text-blue-400" />
                </div>
                {file ? (
                  <div>
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium text-sm">Drag and drop your file here, or click to browse</p>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>

              {file && !scanning && !analyzed && (
                <button onClick={startAnalysis} className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2">
                  Analyze Resume
                </button>
              )}

              {scanning && (
                <div className="mt-4 p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center justify-center text-center">
                  <RefreshCw size={24} className="text-blue-400 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-white">ATS Parser analyzing content...</p>
                  <p className="text-xs text-slate-500 mt-1">Extracting contact info, skill matches, work history, and formatting standards.</p>
                </div>
              )}
            </div>

            {/* Keyword Analysis */}
            {analyzed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Star size={16} className="text-amber-400" /> Extracted Key Skills & Keywords
                </h3>
                <p className="text-xs text-slate-500 mb-4">We found these top keywords matching modern job profiles in your resume:</p>
                <div className="flex flex-wrap gap-2">
                  {resumeKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <div className="glass p-6 text-center">
              <h3 className="font-semibold text-white mb-4">ATS Match Score</h3>
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="54" stroke="#3B82F6" strokeWidth="8" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 54} 
                    strokeDashoffset={2 * Math.PI * 54 * (1 - (analyzed ? resumeScore : 0) / 100)} 
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-3xl font-bold font-display text-white">{analyzed ? `${resumeScore}%` : '0%'}</span>
              </div>

              {analyzed ? (
                <div>
                  <p className="text-sm font-semibold text-emerald-400 mb-2">Good Match Candidate! 👍</p>
                  <p className="text-xs text-slate-500">Your resume shows clean structural hierarchy and solid matches in tech stacks. Some minor optimization could push it to 85%+.</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-500">Upload and run the analysis scanner to view your detailed ATS profile check.</p>
                </div>
              )}
            </div>

            {analyzed && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 space-y-4">
                <h4 className="font-semibold text-white text-sm">💡 Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Clean Contact Info</p>
                      <p className="text-slate-500 text-[10px]">Email, Phone, and LinkedIn links parsed correctly.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Standard Format Used</p>
                      <p className="text-slate-500 text-[10px]">Standard Arial typography and single-column spacing are ATS friendly.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Missing Certifications Section</p>
                      <p className="text-slate-500 text-[10px]">Add explicit credentials/certifications to stand out in screening.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Action Verbs Check</p>
                      <p className="text-slate-500 text-[10px]">Strengthen bullet points under projects with verbs like "Engineered" or "Architected".</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
