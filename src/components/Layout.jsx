import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen" style={{ background: '#050912' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-2/3 w-64 h-64 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)', filter: 'blur(80px)' }} />
      </div>

      <Sidebar />
      <Navbar title={title} />

      <main
        className="relative z-10 min-h-screen pt-16 p-6"
        style={{ marginLeft: 240, transition: 'margin-left 0.3s ease' }}
      >
        {children}
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A0F1E',
            color: '#E2E8F0',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}
