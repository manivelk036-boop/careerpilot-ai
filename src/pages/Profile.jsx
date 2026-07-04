import { useState } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { badges } from '../data/badges';
import { motion } from 'framer-motion';
import { User, Award, Book, Star, Plus, Briefcase, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const store = useStudentStore();
  const levelInfo = store.getCurrentLevel();
  const xpProgress = store.getXPProgress();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: store.name,
    college: store.college,
    department: store.department,
    year: store.year,
    cgpa: store.cgpa
  });

  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({ title: '', tech: '', desc: '' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '' });

  const handleProfileSave = (e) => {
    e.preventDefault();
    store.updateProfile({
      name: profileForm.name,
      college: profileForm.college,
      department: profileForm.department,
      year: parseInt(profileForm.year) || 3,
      cgpa: parseFloat(profileForm.cgpa) || 8.0
    });
    setIsEditing(false);
    toast.success('Profile details updated!');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      store.addSkill(newSkill.trim());
      setNewSkill('');
      toast.success('Skill added!');
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProject.title.trim()) {
      const updatedProjects = [...store.projects, { ...newProject, id: Date.now() }];
      store.updateProfile({ projects: updatedProjects });
      setNewProject({ title: '', tech: '', desc: '' });
      toast.success('Project added!');
    }
  };

  const handleRemoveProject = (id) => {
    const updatedProjects = store.projects.filter(p => p.id !== id);
    store.updateProfile({ projects: updatedProjects });
    toast.success('Project removed.');
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.title.trim()) {
      const updatedCerts = [...store.certifications, { ...newCert, id: Date.now() }];
      store.updateProfile({ certifications: updatedCerts });
      setNewCert({ title: '', issuer: '' });
      toast.success('Certification added!');
    }
  };

  const handleRemoveCert = (id) => {
    const updatedCerts = store.certifications.filter(c => c.id !== id);
    store.updateProfile({ certifications: updatedCerts });
    toast.success('Certification removed.');
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="glass p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white shadow-glow-blue flex-shrink-0">
              🎯
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white flex items-center justify-center md:justify-start gap-2">
                {store.name}
              </h2>
              <p className="text-slate-400 text-sm">{store.department} · {store.college}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">{levelInfo.icon} Level {levelInfo.level}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">🪙 {store.coins} Coins</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>{levelInfo.title}</span>
              <span>{store.xp} XP</span>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" animate={{ width: `${xpProgress}%` }} transition={{ duration: 0.5 }} />
            </div>
            <p className="text-[10px] text-slate-500 text-right">Progress: {xpProgress}% to next level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Profile edit & skills */}
          <div className="space-y-6">
            {/* Edit Info */}
            <div className="glass p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white text-sm flex items-center gap-1.5"><User size={16} className="text-blue-400" /> Academic Profile</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Full Name</label>
                    <input className="input-field py-2 text-xs" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">College</label>
                    <input className="input-field py-2 text-xs" value={profileForm.college} onChange={e => setProfileForm({ ...profileForm, college: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Department</label>
                    <input className="input-field py-2 text-xs" value={profileForm.department} onChange={e => setProfileForm({ ...profileForm, department: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Year</label>
                      <input className="input-field py-2 text-xs" type="number" min="1" max="4" value={profileForm.year} onChange={e => setProfileForm({ ...profileForm, year: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">CGPA</label>
                      <input className="input-field py-2 text-xs" type="number" step="0.01" min="0" max="10" value={profileForm.cgpa} onChange={e => setProfileForm({ ...profileForm, cgpa: e.target.value })} required />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full py-2 text-xs">Save Info</button>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">College</span>
                    <span className="text-white font-medium">{store.college}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Department</span>
                    <span className="text-white font-medium">{store.department}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">Year</span>
                    <span className="text-white font-medium">{store.year} Year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGPA</span>
                    <span className="text-emerald-400 font-bold">{store.cgpa}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white text-sm flex items-center gap-1.5 mb-4"><Star size={16} className="text-blue-400" /> Core Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {store.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl text-xs bg-white/5 text-slate-300 border border-white/5 font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Next.js)..."
                  className="input-field py-1.5 text-xs flex-1"
                />
                <button type="submit" className="btn-primary px-3 flex items-center justify-center">
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Projects, Certifications & Badges */}
          <div className="md:col-span-2 space-y-6">
            {/* Badges Wall */}
            <div className="glass p-6">
              <h3 className="font-semibold text-white text-sm flex items-center gap-1.5 mb-4"><Award size={16} className="text-amber-400" /> Unlocked Badges ({store.badges.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map(badge => {
                  const unlocked = store.badges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                        unlocked 
                        ? 'bg-amber-500/5 border-amber-500/30' 
                        : 'bg-white/5 border-white/5 opacity-30 grayscale'
                      }`}
                    >
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      <p className="text-[10px] font-bold text-white truncate max-w-full">{badge.name}</p>
                      <p className="text-[8px] text-slate-500 mt-0.5">{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projects Section */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-white text-sm flex items-center gap-1.5"><Briefcase size={16} className="text-blue-400" /> Projects ({store.projects.length})</h3>
              
              <div className="space-y-3">
                {store.projects.map(p => (
                  <div key={p.id} className="flex justify-between items-start p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <p className="text-[10px] text-blue-400 font-semibold mt-0.5">{p.tech}</p>
                      <p className="text-slate-400 mt-1">{p.desc}</p>
                    </div>
                    <button onClick={() => handleRemoveProject(p.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/5 p-4 rounded-xl">
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Project Title"
                  className="input-field py-1.5 text-xs"
                  required
                />
                <input 
                  type="text" 
                  value={newProject.tech}
                  onChange={e => setNewProject({ ...newProject, tech: e.target.value })}
                  placeholder="Tech (e.g. React, Java)"
                  className="input-field py-1.5 text-xs"
                />
                <input 
                  type="text" 
                  value={newProject.desc}
                  onChange={e => setNewProject({ ...newProject, desc: e.target.value })}
                  placeholder="Brief description"
                  className="input-field py-1.5 text-xs sm:col-span-2"
                />
                <button type="submit" className="btn-primary py-1.5 text-xs flex items-center justify-center gap-1.5">
                  <Plus size={14} /> Add Project
                </button>
              </form>
            </div>

            {/* Certifications Section */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-semibold text-white text-sm flex items-center gap-1.5"><Book size={16} className="text-blue-400" /> Certifications ({store.certifications.length})</h3>
              
              <div className="space-y-3">
                {store.certifications.map(c => (
                  <div key={c.id} className="flex justify-between items-start p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{c.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{c.issuer}</p>
                    </div>
                    <button onClick={() => handleRemoveCert(c.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddCert} className="flex flex-col sm:flex-row gap-2 bg-white/5 p-4 rounded-xl">
                <input 
                  type="text" 
                  value={newCert.title}
                  onChange={e => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="Certification Name"
                  className="input-field py-1.5 text-xs flex-1"
                  required
                />
                <input 
                  type="text" 
                  value={newCert.issuer}
                  onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="Issuer (e.g. AWS, Oracle)"
                  className="input-field py-1.5 text-xs flex-1"
                />
                <button type="submit" className="btn-primary py-1.5 px-4 text-xs flex items-center justify-center gap-1.5">
                  <Plus size={14} /> Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
