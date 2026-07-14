import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Cloud,
  RefreshCw,
  FileText,
  Download,
  Briefcase,
  Bot,
  Cpu,
  Layers,
  Calendar,
  Lock,
  Unlock,
  ExternalLink,
  Users,
  Star,
  Sparkles,
  History,
  FileBarChart2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeletons';

// Model Interfaces
interface Resume {
  id: string;
  name: string;
  slug: string;
  visibility: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: string;
  company: string;
  position: string;
  stage: string;
  date: string;
  createdAt: string;
}

interface AgentThread {
  id: string;
  aiProviderId?: string;
  sourceResumeId?: string;
  archived?: boolean;
  createdAt: string;
}

interface AiProvider {
  id: string;
  label: string;
  model: string;
  baseURL?: string;
  createdAt?: string;
}

interface ResumeVersion {
  id: string;
  id_?: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AnalysisResult {
  score?: number;
  rating?: string;
  feedback?: string;
  suggestions?: string[];
  tips?: string[];
}

export default function AdminReactiveResume() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'resumes' | 'applications' | 'agent' | 'providers'>('resumes');

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Modals state
  const [viewingVersionsId, setViewingVersionsId] = useState<string | null>(null);
  const [versionsResumeName, setVersionsResumeName] = useState<string>('');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisResumeName, setAnalysisResumeName] = useState<string>('');

  // Queries
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-rxresume-stats'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.statistics;
    }
  });

  const { data: resumes = [], isLoading: isLoadingResumes, error: errorResumes, refetch: refetchResumes } = useQuery<Resume[]>({
    queryKey: ['admin-rxresume-resumes'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.resumes;
    },
    enabled: activeTab === 'resumes'
  });

  const { data: versions = [], isLoading: isLoadingVersions } = useQuery<ResumeVersion[]>({
    queryKey: ['admin-rxresume-versions', viewingVersionsId],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${viewingVersionsId}/versions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.versions;
    },
    enabled: !!viewingVersionsId
  });

  const { data: applications = [], isLoading: isLoadingApps, error: errorApps, refetch: refetchApps } = useQuery<Application[]>({
    queryKey: ['admin-rxresume-applications'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.applications;
    },
    enabled: activeTab === 'applications'
  });

  const { data: agentThreads = [], isLoading: isLoadingThreads, error: errorThreads, refetch: refetchThreads } = useQuery<AgentThread[]>({
    queryKey: ['admin-rxresume-agent-threads'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/agent/threads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.threads;
    },
    enabled: activeTab === 'agent'
  });

  const { data: providers = [], isLoading: isLoadingProviders, error: errorProviders, refetch: refetchProviders } = useQuery<AiProvider[]>({
    queryKey: ['admin-rxresume-ai-providers'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/ai-providers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.providers;
    },
    enabled: activeTab === 'providers'
  });

  // Mutations
  const syncMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      setSyncingId(resumeId);
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${resumeId}/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('ResuMesh database content successfully synchronized to Reactive Resume!');
      queryClient.invalidateQueries({ queryKey: ['admin-rxresume-resumes'] });
      setSyncingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to sync data with Reactive Resume.');
      setSyncingId(null);
    }
  });

  const downloadPdfMutation = useMutation({
    mutationFn: async ({ resumeId, newWindow }: { resumeId: string; newWindow: Window | null }) => {
      setDownloadingId(resumeId);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${resumeId}/pdf`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const url = res.data.url;
        if (url && newWindow) {
          newWindow.location.href = url;
        } else if (newWindow) {
          newWindow.close();
          toast.error('PDF URL not found.');
        }
      } catch (error: any) {
        if (newWindow) newWindow.close();
        toast.error(error.response?.data?.detail || 'Failed to retrieve PDF download URL.');
      } finally {
        setDownloadingId(null);
      }
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      setAnalyzingId(resumeId);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${resumeId}/analyze`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.analysis;
    },
    onSuccess: (data, resumeId) => {
      toast.success('Resume analysis completed successfully!');
      const target = resumes.find(r => r.id === resumeId);
      setAnalysisResumeName(target?.name || 'Resume');

      // Handle different formats that the analyze API might return
      let parsedAnalysis: AnalysisResult = {};
      if (data && typeof data === 'object') {
        parsedAnalysis = {
          score: data.score || data.overallScore || 75,
          rating: data.rating || 'Good',
          feedback: data.feedback || data.summary || 'Resume analyzed successfully.',
          suggestions: data.suggestions || data.improvements || [],
          tips: data.tips || []
        };
      }
      setActiveAnalysis(parsedAnalysis);
      setAnalyzingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to analyze resume. Make sure you have an AI Provider configured.');
      setAnalyzingId(null);
    }
  });

  const viewAnalysisMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${resumeId}/analysis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.analysis;
    },
    onSuccess: (data, resumeId) => {
      const target = resumes.find(r => r.id === resumeId);
      setAnalysisResumeName(target?.name || 'Resume');
      if (!data || Object.keys(data).length === 0) {
        toast.error('No persisted analysis found. Please click Analyze first.');
        return;
      }
      setActiveAnalysis({
        score: data.score || data.overallScore || 70,
        rating: data.rating || 'N/A',
        feedback: data.feedback || data.summary || 'No feedback details saved.',
        suggestions: data.suggestions || data.improvements || [],
        tips: data.tips || []
      });
    },
    onError: () => {
      toast.error('No persisted analysis found. Trigger a new evaluation by clicking Analyze.');
    }
  });

  // Tables Columns
  const resumeColumns = [
    {
      header: 'Resume Name',
      accessorKey: 'name',
      cell: (r: Resume) => (
        <div className="flex items-center gap-2">
          <FileText className="text-blue-500" size={18} />
          <span className="font-semibold text-gray-900 dark:text-white">{r.name}</span>
        </div>
      )
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: (r: Resume) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{r.slug}</code>
    },
    {
      header: 'Visibility',
      accessorKey: 'visibility',
      cell: (r: Resume) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
          r.visibility === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {r.visibility}
        </span>
      )
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: (r: Resume) => <span>{new Date(r.updatedAt).toLocaleString()}</span>
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (r: Resume) => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => syncMutation.mutate(r.id)}
            disabled={syncingId !== null}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Sync Local Data to Resume"
          >
            <RefreshCw size={13} className={syncingId === r.id ? 'animate-spin' : ''} />
            Sync
          </button>
          <button
            onClick={() => {
              const newWindow = window.open('about:blank', '_blank');
              downloadPdfMutation.mutate({ resumeId: r.id, newWindow });
            }}
            disabled={downloadingId !== null}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-200"
            title="Open PDF in new tab"
          >
            <Download size={13} className={downloadingId === r.id ? 'animate-spin' : ''} />
            PDF
          </button>
          <button
            onClick={() => {
              setVersionsResumeName(r.name);
              setViewingVersionsId(r.id);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
            title="View History Versions"
          >
            <History size={13} />
            Versions
          </button>
          <button
            onClick={() => analyzeMutation.mutate(r.id)}
            disabled={analyzingId !== null}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-lg transition-colors disabled:opacity-50"
            title="Run AI Resume Quality Analysis"
          >
            <Sparkles size={13} className={analyzingId === r.id ? 'animate-pulse' : ''} />
            {analyzingId === r.id ? 'Analyzing...' : 'Analyze'}
          </button>
          <button
            onClick={() => viewAnalysisMutation.mutate(r.id)}
            disabled={viewAnalysisMutation.isPending}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-indigo-250 dark:border-indigo-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg transition-colors disabled:opacity-50"
            title="View Persisted AI Analysis"
          >
            <FileBarChart2 size={13} className={viewAnalysisMutation.isPending ? 'animate-spin' : ''} />
            Report
          </button>
        </div>
      )
    }
  ];

  const appColumns = [
    {
      header: 'Company',
      accessorKey: 'company',
      cell: (a: Application) => <span className="font-semibold text-gray-900 dark:text-white">{a.company}</span>
    },
    {
      header: 'Position',
      accessorKey: 'position',
      cell: (a: Application) => <span>{a.position}</span>
    },
    {
      header: 'Stage',
      accessorKey: 'stage',
      cell: (a: Application) => {
        const stageColors: Record<string, string> = {
          Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          Interviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
          Offered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${stageColors[a.stage] || stageColors.Applied}`}>
            {a.stage}
          </span>
        );
      }
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (a: Application) => <span>{new Date(a.date).toLocaleDateString()}</span>
    }
  ];

  const threadColumns = [
    {
      header: 'Thread ID',
      accessorKey: 'id',
      cell: (t: AgentThread) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{t.id}</code>
    },
    {
      header: 'AI Provider ID',
      accessorKey: 'aiProviderId',
      cell: (t: AgentThread) => <span>{t.aiProviderId || 'Default'}</span>
    },
    {
      header: 'Source Resume ID',
      accessorKey: 'sourceResumeId',
      cell: (t: AgentThread) => <span>{t.sourceResumeId || '-'}</span>
    },
    {
      header: 'Status',
      accessorKey: 'archived',
      cell: (t: AgentThread) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.archived ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
          {t.archived ? 'Archived' : 'Active'}
        </span>
      )
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: (t: AgentThread) => <span>{new Date(t.createdAt).toLocaleString()}</span>
    }
  ];

  const providerColumns = [
    {
      header: 'Provider Label',
      accessorKey: 'label',
      cell: (p: AiProvider) => <span className="font-semibold text-gray-900 dark:text-white">{p.label}</span>
    },
    {
      header: 'Model',
      accessorKey: 'model',
      cell: (p: AiProvider) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">{p.model}</code>
    },
    {
      header: 'Base URL',
      accessorKey: 'baseURL',
      cell: (p: AiProvider) => <span>{p.baseURL || 'Default'}</span>
    }
  ];

  const currentRefetch = () => {
    if (activeTab === 'resumes') refetchResumes();
    if (activeTab === 'applications') refetchApps();
    if (activeTab === 'agent') refetchThreads();
    if (activeTab === 'providers') refetchProviders();
  };

  const isCurrentLoading =
    (activeTab === 'resumes' && isLoadingResumes) ||
    (activeTab === 'applications' && isLoadingApps) ||
    (activeTab === 'agent' && isLoadingThreads) ||
    (activeTab === 'providers' && isLoadingProviders);

  const hasCurrentError =
    (activeTab === 'resumes' && errorResumes) ||
    (activeTab === 'applications' && errorApps) ||
    (activeTab === 'agent' && errorThreads) ||
    (activeTab === 'providers' && errorProviders);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reactive Resume Management"
        description="Sync database content, trace applications, configure Agent threads, evaluate resume metrics and view statistics."
        actionLabel={isCurrentLoading ? 'Loading...' : 'Refresh'}
        actionIcon={<RefreshCw size={18} className={isCurrentLoading ? 'animate-spin' : ''} />}
        onAction={currentRefetch}
      />

      {/* Global Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resumes</p>
              <h4 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.resumesCount}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3.5 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <h4 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.usersCount}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub Stars</p>
              <h4 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.githubStars}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('resumes')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'resumes'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Cloud size={16} />
            Resumes
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Briefcase size={16} />
            Applications
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'agent'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Bot size={16} />
            Agent Threads
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'providers'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Cpu size={16} />
            AI Providers
          </button>
        </nav>
      </div>

      {hasCurrentError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle size={18} />
          Failed to fetch data. Please check if your Reactive Resume connection credentials are set up correctly in the environment variables.
        </div>
      )}

      {isCurrentLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {activeTab === 'resumes' && (
            resumes.length === 0 ? (
              <EmptyState
                icon={Cloud}
                title="No resumes found"
                message="No resumes listed in your Reactive Resume account. Create a resume on the dashboard first."
                actionLabel="Refresh List"
                onAction={refetchResumes}
              />
            ) : (
              <DataTable data={resumes} columns={resumeColumns} keyExtractor={(r) => r.id} />
            )
          )}

          {activeTab === 'applications' && (
            applications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No job applications found"
                message="Tracked job applications will be displayed here."
                actionLabel="Refresh Applications"
                onAction={refetchApps}
              />
            ) : (
              <DataTable data={applications} columns={appColumns} keyExtractor={(a) => a.id} />
            )
          )}

          {activeTab === 'agent' && (
            agentThreads.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="No agent threads found"
                message="Active agent communication threads from Reactive Resume will be listed here."
                actionLabel="Refresh Threads"
                onAction={refetchThreads}
              />
            ) : (
              <DataTable data={agentThreads} columns={threadColumns} keyExtractor={(t) => t.id} />
            )
          )}

          {activeTab === 'providers' && (
            providers.length === 0 ? (
              <EmptyState
                icon={Cpu}
                title="No AI Providers configured"
                message="AI Providers and API settings configured on Reactive Resume will appear here."
                actionLabel="Refresh Providers"
                onAction={refetchProviders}
              />
            ) : (
              <DataTable data={providers} columns={providerColumns} keyExtractor={(p) => p.id} />
            )
          )}
        </>
      )}

      {/* Resume Version History Modal */}
      {viewingVersionsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <History className="text-blue-500" size={20} />
                Version History: {versionsResumeName}
              </h3>
              <button
                onClick={() => setViewingVersionsId(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {isLoadingVersions ? (
                <div className="space-y-3 py-4">
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                </div>
              ) : versions.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">No backup versions or revisions found for this resume.</p>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {versions.map((ver, idx) => (
                    <div key={ver.id || idx} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {ver.name || `Revision #${versions.length - idx}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ID: <code className="bg-gray-50 dark:bg-gray-800/80 px-1 py-0.5 rounded text-[10px]">{ver.id || ver.id_}</code>
                        </p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(ver.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setViewingVersionsId(null)}
                className="px-4 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Analysis Result Modal */}
      {activeAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-indigo-500" size={20} />
                AI Quality Analysis: {analysisResumeName}
              </h3>
              <button
                onClick={() => setActiveAnalysis(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* Score Indicator */}
              <div className="flex items-center gap-6 p-4 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/20">
                <div className="relative w-20 h-20 flex items-center justify-center bg-indigo-600 text-white rounded-full font-bold text-2xl shadow-inner">
                  {activeAnalysis.score}
                  <span className="text-[10px] absolute bottom-2 font-normal uppercase opacity-70">Score</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Rating: <span className="text-indigo-600 dark:text-indigo-400">{activeAnalysis.rating}</span></h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activeAnalysis.feedback}</p>
                </div>
              </div>

              {/* Suggestions List */}
              {activeAnalysis.suggestions && activeAnalysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileBarChart2 size={16} className="text-indigo-500" />
                    Key Suggestions & Improvements
                  </h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                    {activeAnalysis.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips List */}
              {activeAnalysis.tips && activeAnalysis.tips.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={16} className="text-green-500" />
                    Career & Industry Tips
                  </h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                    {activeAnalysis.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setActiveAnalysis(null)}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
