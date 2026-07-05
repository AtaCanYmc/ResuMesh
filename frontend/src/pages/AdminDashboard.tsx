import React, { useEffect } from 'react';
import { Terminal, ShieldAlert, Loader2, RefreshCw, LogOut } from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import LogTable from '../components/LogTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { logs, loading, error, fetchLogs } = useLogs();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Sistem Sağlığı & İzleme
            </h1>
            <p className="text-neutral-400 mt-2">Canlı sistem logları ve arka plan görevleri</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
              Yenile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
              Çıkış
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 mb-8">
            <ShieldAlert className="w-6 h-6" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-neutral-950 border-b border-neutral-800">
            <Terminal className="w-5 h-5 text-neutral-400" />
            <span className="text-sm font-mono text-neutral-400">/var/log/system.log</span>
          </div>

          <LogTable logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
