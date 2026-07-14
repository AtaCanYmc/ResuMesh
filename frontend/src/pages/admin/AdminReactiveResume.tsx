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
  ExternalLink
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

export default function AdminReactiveResume() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'resumes' | 'applications' | 'agent' | 'providers'>('resumes');

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Queries
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => syncMutation.mutate(r.id)}
            disabled={syncingId !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncingId === r.id ? 'animate-spin' : ''} />
            {syncingId === r.id ? 'Syncing...' : 'Sync Data'}
          </button>
          <button
            onClick={() => {
              const newWindow = window.open('about:blank', '_blank');
              downloadPdfMutation.mutate({ resumeId: r.id, newWindow });
            }}
            disabled={downloadingId !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-200"
          >
            <Download size={14} className={downloadingId === r.id ? 'animate-spin' : ''} />
            PDF
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
        description="Sync database content, trace applications, configure Agent threads, and view configured AI providers."
        actionLabel={isCurrentLoading ? 'Loading...' : 'Refresh'}
        actionIcon={<RefreshCw size={18} className={isCurrentLoading ? 'animate-spin' : ''} />}
        onAction={currentRefetch}
      />

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
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
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
    </div>
  );
}
