import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotes } from '../services/api';
import Layout from '../components/Layout';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesList() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [moduleId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNotes(moduleId);
      setNotes(res.data || []);
    } catch (err) {
      setError('Could not load notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Module Notes">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Course
        </button>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-white/5 rounded-2xl" />
            <div className="h-20 bg-white/5 rounded-2xl" />
          </div>
        ) : error || !notes.length ? (
          <div className="glass p-8 text-center rounded-2xl">
            <p className="text-slate-400 mb-4">{error || 'No notes/PDF manuals available for this module yet.'}</p>
            <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-secondary">
              ← Back to Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base">📚 Available Study Notes</h3>
            <div className="grid grid-cols-1 gap-3">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="glass p-5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">{note.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">PDF Reference Guide</p>
                    </div>
                  </div>

                  <a
                    href={note.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2 text-xs py-2 px-4 rounded-xl"
                  >
                    <span>Download Notes</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
