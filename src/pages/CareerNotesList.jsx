import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCareerLmsNotes } from '../services/api';
import Layout from '../components/Layout';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CareerNotesList() {
  const { goalId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [goalId, moduleId, lessonId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCareerLmsNotes(goalId, moduleId, lessonId);
      setNotes(res.data || []);
    } catch {
      setError('Could not load notes.');
    } finally {
      setLoading(false);
    }
  };

  const backUrl = `/learn/${goalId}`;

  return (
    <Layout title="Lesson Notes">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate(backUrl)}
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
            <FileText size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">{error || 'No notes available for this lesson yet.'}</p>
            <button onClick={() => navigate(backUrl)} className="btn-secondary">
              ← Back to Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base">📚 Lesson Study Notes</h3>
            <div className="grid grid-cols-1 gap-3">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="glass p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors mb-1">
                        {note.title}
                      </h4>
                      {note.content && (
                        <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
