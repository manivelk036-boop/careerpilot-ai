import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVideos, markProgress } from '../services/api';
import { useStudentStore } from '../store/useStudentStore';
import Layout from '../components/Layout';
import { ArrowLeft, ArrowRight, CheckCircle2, Play, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

// Convert YouTube URL to embed URL
function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  // Already embed format
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  // youtube.com/watch?v=ID
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?rel=0&modestbranding=1`;
  return url; // return as-is if already an embed URL
}

export default function VideoPlayer() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { id: studentId, addXP, addCoins } = useStudentStore();

  const [videos,    setVideos]    = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [completed, setCompleted] = useState(new Set());
  const [marking,   setMarking]   = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [moduleId]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await getVideos(moduleId);
      setVideos(res.data || []);
    } catch (err) {
      toast.error('Could not load videos.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    const video = videos[current];
    if (!video || completed.has(video.id)) return;

    try {
      setMarking(true);
      if (studentId) {
        await markProgress({ studentId, courseId: Number(courseId), moduleId: Number(moduleId) });
      }
      setCompleted(prev => new Set([...prev, video.id]));
      addXP(50);
      addCoins(20);
      toast.success('✅ Video marked complete! +50 XP +20 🪙');

      // Auto-advance to next video after 1.5s
      if (current < videos.length - 1) {
        setTimeout(() => setCurrent(c => c + 1), 1500);
      }
    } catch (err) {
      toast.error('Could not save progress.');
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Video...">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video w-full bg-white/5 rounded-2xl animate-pulse mb-6" />
          <div className="h-6 bg-white/10 rounded w-1/3 animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!videos.length) {
    return (
      <Layout title="No Videos">
        <div className="glass p-8 text-center rounded-2xl max-w-xl mx-auto">
          <p className="text-slate-400 mb-4">No videos available for this module yet.</p>
          <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-secondary">
            ← Back to Course
          </button>
        </div>
      </Layout>
    );
  }

  const video       = videos[current];
  const embedUrl    = getYoutubeEmbedUrl(video.youtubeUrl);
  const isCompleted = completed.has(video.id);
  const isLast      = current === videos.length - 1;

  return (
    <Layout title={video.title}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Course
        </button>

        {/* Video Player */}
        <motion.div
          key={video.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* YouTube Embed */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-slate-400">Invalid video URL</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Video {current + 1} of {videos.length}
                </p>
                <h2 className="font-display font-bold text-white text-lg">{video.title}</h2>
                {video.durationMinutes && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Clock size={12} /> {video.durationMinutes} min
                  </p>
                )}
              </div>

              {/* Mark Complete button */}
              <button
                onClick={handleMarkComplete}
                disabled={isCompleted || marking}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'btn-primary'
                }`}
              >
                <CheckCircle2 size={16} />
                {marking ? 'Saving...' : isCompleted ? 'Completed ✓' : 'Mark as Complete'}
              </button>
            </div>

            {/* Prev / Next Navigation */}
            <div className="flex gap-3 mt-5 pt-4 border-t border-white/5">
              <button
                onClick={() => setCurrent(c => c - 1)}
                disabled={current === 0}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-4 flex-1 justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {isLast ? (
                <Link
                  to={`/courses/${courseId}/module/${moduleId}/quiz`}
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-4 flex-1 justify-center"
                >
                  Take Quiz 📝 <ChevronRight size={16} />
                </Link>
              ) : (
                <button
                  onClick={() => setCurrent(c => c + 1)}
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-4 flex-1 justify-center"
                >
                  Next Video <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Video List sidebar */}
        {videos.length > 1 && (
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-white text-sm mb-3">📋 Module Videos</h3>
            <div className="space-y-2">
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setCurrent(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    i === current
                      ? 'bg-blue-500/15 border border-blue-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    completed.has(v.id) ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}>
                    {completed.has(v.id)
                      ? <CheckCircle2 size={14} className="text-emerald-400" />
                      : <Play size={12} className={i === current ? 'text-blue-400' : 'text-slate-500'} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${i === current ? 'text-white' : 'text-slate-400'}`}>
                      {v.title}
                    </p>
                    {v.durationMinutes && (
                      <p className="text-[10px] text-slate-600">{v.durationMinutes} min</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
