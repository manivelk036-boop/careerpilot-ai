import { useState } from 'react';
import Layout from '../components/Layout';
import { useStudentStore } from '../store/useStudentStore';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Volume2, ShieldAlert, LogOut, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const store = useStudentStore();
  const navigate = useNavigate();

  const [reminders, setReminders] = useState(true);
  const [sounds, setSounds] = useState(false);

  const handleReset = () => {
    if (window.confirm('WARNING: Are you sure you want to reset all progress? This will delete your timelines, quiz history, and scores from the database permanently!')) {
      store.resetProgress();
      toast.success('Your student profile and database records have been reset.');
      navigate('/career-goal');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `careerpilot-profile-${store.email}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Profile exported successfully!');
  };

  const handleLogout = () => {
    store.logout();
    navigate('/');
  };

  return (
    <Layout title="Platform Settings">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white mb-1">Account & Preferences</h2>
          <p className="text-slate-500 text-sm">Manage configuration settings, toggle alert frequencies, and reset data values.</p>
        </div>

        {/* Notifications & Sound */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-1.5"><Bell size={16} className="text-blue-400" /> Notifications & Sound</h3>
          
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Daily Learning Reminders</p>
              <p className="text-[10px] text-slate-500">Email alerts to help you maintain your learning streak.</p>
            </div>
            <input 
              type="checkbox" 
              checked={reminders} 
              onChange={e => setReminders(e.target.checked)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-white">Platform sound effects</p>
              <p className="text-[10px] text-slate-500">Acoustic signals upon quiz completions and level ups.</p>
            </div>
            <input 
              type="checkbox" 
              checked={sounds} 
              onChange={e => setSounds(e.target.checked)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass p-6 space-y-4">
          <h3 className="font-semibold text-white text-sm flex items-center gap-1.5"><SettingsIcon size={16} className="text-blue-400" /> Backup & Account</h3>
          
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Export Student Data</p>
              <p className="text-[10px] text-slate-500">Download a full backup of your platform progress as JSON.</p>
            </div>
            <button onClick={handleExport} className="btn-secondary px-3 py-1.5 text-[10px] flex items-center gap-1">
              <Download size={12} /> Export
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-white">Logout from Session</p>
              <p className="text-[10px] text-slate-500">Securely sign out of your CareerPilot profile.</p>
            </div>
            <button onClick={handleLogout} className="px-3 py-1.5 text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 flex items-center gap-1 font-bold">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-950/10 border border-red-500/25 space-y-4">
          <h3 className="font-semibold text-red-400 text-sm flex items-center gap-1.5"><ShieldAlert size={16} className="text-red-400" /> Danger Zone</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-red-400">Reset Placement Data</p>
              <p className="text-[10px] text-slate-500">Clears all milestones and synchronizes fresh profiles with DB.</p>
            </div>
            <button onClick={handleReset} className="px-3 py-1.5 text-[10px] bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center gap-1 font-bold transition-colors">
              <AlertTriangle size={12} /> Reset Progress
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
