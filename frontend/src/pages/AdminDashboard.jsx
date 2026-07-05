import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/v1/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(response.data.data);
      localStorage.setItem('adminToken', token);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Yetkisiz erişim. Token geçersiz veya süresi dolmuş.');
      } else {
        setError('Loglar çekilirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, []);

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
            <input
              type="password"
              placeholder="Admin JWT Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500 w-64"
            />
            <button
              onClick={fetchLogs}
              disabled={loading || !token}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
              Yenile
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

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-neutral-400 text-sm border-b border-neutral-700">
                  <th className="pb-3 font-medium">Zaman</th>
                  <th className="pb-3 font-medium">Seviye</th>
                  <th className="pb-3 font-medium">Modül</th>
                  <th className="pb-3 font-medium">Mesaj</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-neutral-500">
                      Gösterilecek log bulunamadı.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/20 transition-colors">
                      <td className="py-3 pr-4 text-neutral-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                          log.level === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-blue-300">{log.module}</td>
                      <td className="py-3 text-neutral-300">{log.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
