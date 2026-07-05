import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Loader2, RefreshCw, LogOut, FileText, Wand2, Download } from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import LogTable from '../components/LogTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { logs, loading, error, fetchLogs } = useLogs();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'logs' | 'ai-cv'>('logs');

  // AI CV State
  const [jobUrl, setJobUrl] = useState('');
  const [cvMarkdown, setCvMarkdown] = useState('# Generated CV\n\nWaiting for analysis...');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    }
  }, [fetchLogs, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleGenerateCV = async () => {
    if (!jobUrl) return;
    setIsGenerating(true);
    // Mock API call
    setTimeout(() => {
      setCvMarkdown(`# Ata Can Yücel\n## Senior Software Engineer\n\n**Tailored for:** ${jobUrl}\n\n- Expert in React, Python, and AI Workflows\n- Proven track record of scalable architecture`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Admin Kontrol Paneli
            </h1>
            <p className="text-neutral-400 mt-2">Sistem yönetimi ve Yapay Zeka destekli araçlar</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
              Çıkış
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-neutral-800 p-1 rounded-lg w-max border border-neutral-700 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all shrink-0 ${
              activeTab === 'logs'
                ? 'bg-neutral-950 text-white shadow-sm border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Sistem Sağlığı / Loglar
          </button>
          <button
            onClick={() => setActiveTab('ai-cv')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all shrink-0 ${
              activeTab === 'ai-cv'
                ? 'bg-neutral-950 text-white shadow-sm border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            AI CV Jeneratörü
          </button>
        </div>

        {/* Tab Content: Logs */}
        {activeTab === 'logs' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-end mb-4">
               <button
                  onClick={fetchLogs}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors text-sm"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  Yenile
                </button>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3 mb-6">
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
        )}

        {/* Tab Content: AI CV Generator */}
        {activeTab === 'ai-cv' && (
          <div className="animate-in fade-in duration-300 flex flex-col gap-6">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-lg">
              <label className="block text-sm font-medium text-neutral-300 mb-2">İş İlanı URL'si</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://linkedin.com/jobs/view/..."
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleGenerateCV}
                  disabled={isGenerating || !jobUrl}
                  className="flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg font-medium transition-all shadow-lg shrink-0"
                >
                  {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                  İlanı Analiz Et ve CV Üret
                </button>
              </div>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
              {/* Left Panel: Markdown Editor */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden flex flex-col shadow-lg">
                <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-700 flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Markdown Editör
                  </span>
                </div>
                <textarea
                  value={cvMarkdown}
                  onChange={(e) => setCvMarkdown(e.target.value)}
                  className="flex-1 bg-transparent p-4 focus:outline-none resize-none text-neutral-300 font-mono text-sm leading-relaxed"
                  placeholder="Generated markdown will appear here..."
                />
              </div>

              {/* Right Panel: PDF Preview (Mocked) */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden flex flex-col shadow-lg relative">
                <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-700 flex justify-between items-center z-10">
                  <span className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
                    PDF Önizleme
                  </span>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 rounded-md transition-colors text-xs font-medium">
                    <Download className="w-4 h-4" />
                    İndir (PDF)
                  </button>
                </div>

                {/* Simulated Paper */}
                <div className="flex-1 bg-neutral-900 p-8 overflow-y-auto flex justify-center">
                  <div className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-8 shadow-2xl">
                     <div dangerouslySetInnerHTML={{ __html: cvMarkdown.replace(/\n/g, '<br/>').replace(/## (.*?)<br\/>/g, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>').replace(/# (.*?)<br\/>/g, '<h1 class="text-3xl font-extrabold mb-4">$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
