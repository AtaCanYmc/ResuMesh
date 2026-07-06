import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Loader2, RefreshCw, LogOut, FileText, Wand2, Download, Upload } from 'lucide-react';
import axios from 'axios';
import { useLogs } from '../hooks/useLogs';
import LogTable from '../components/LogTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { logs, loading, error, fetchLogs } = useLogs();
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'logs' | 'ai-cv' | 'import-linkedin'>('logs');

  // Import LinkedIn State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/import/linkedin-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setUploadMessage({ type: 'success', text: response.data.message || 'PDF başarıyla yapay zeka tarafından parse edildi ve kaydedildi.' });
      setSelectedFile(null);
    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.response?.data?.detail || err.message || 'Yükleme başarısız oldu.' });
    } finally {
      setIsUploading(false);
    }
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
          <button
            onClick={() => setActiveTab('import-linkedin')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all shrink-0 ${
              activeTab === 'import-linkedin'
                ? 'bg-neutral-950 text-white shadow-sm border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            LinkedIn İçe Aktar
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

        {/* Tab Content: Import LinkedIn */}
        {activeTab === 'import-linkedin' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">LinkedIn PDF İçe Aktar</h2>
                <p className="text-neutral-400">
                  LinkedIn profilinizden indirdiğiniz PDF dosyasını yükleyin. Yapay zeka bu dosyayı analiz edip sistemdeki portfolyo verilerinizi güncelleyecektir.
                </p>
              </div>

              {uploadMessage && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${uploadMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/50'}`}>
                  {uploadMessage.type === 'error' && <ShieldAlert className="w-5 h-5 shrink-0" />}
                  <p>{uploadMessage.text}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-3 text-neutral-400" />
                      <p className="mb-2 text-sm text-neutral-400">
                        <span className="font-semibold text-white">Yüklemek için tıklayın</span> veya sürükleyip bırakın
                      </p>
                      <p className="text-xs text-neutral-500">Sadece PDF dosyaları (.pdf)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded-lg">
                    <span className="text-sm text-neutral-300 truncate pr-4">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={isUploading || !selectedFile}
                  className="mt-4 flex justify-center items-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
                >
                  {isUploading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  {isUploading ? 'Yapay Zeka Analiz Ediyor...' : 'Verileri İçe Aktar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
