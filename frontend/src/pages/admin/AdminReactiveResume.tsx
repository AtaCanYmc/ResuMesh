import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Cloud, RefreshCw, FileText, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeletons';

interface Resume {
  id: string;
  name: string;
  slug: string;
  visibility: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReactiveResume() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: resumes = [], isLoading, error, refetch } = useQuery<Resume[]>({
    queryKey: ['admin-rxresume-resumes'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.resumes;
    }
  });

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
    mutationFn: async (resumeId: string) => {
      setDownloadingId(resumeId);
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/rxresume/resume/${resumeId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.url;
    },
    onSuccess: (url: string) => {
      if (url) {
        window.open(url, '_blank');
        toast.success('Opening PDF in a new tab.');
      } else {
        toast.error('PDF URL not found.');
      }
      setDownloadingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to retrieve PDF download URL.');
      setDownloadingId(null);
    }
  });

  const columns = [
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
            onClick={() => downloadPdfMutation.mutate(r.id)}
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

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reactive Resume Management"
        description="Sync your local data (projects, experiences, skills) to Reactive Resume."
        actionLabel={isLoading ? 'Loading...' : 'Refresh List'}
        actionIcon={<RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />}
        onAction={() => refetch()}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
          Failed to fetch resumes. Please ensure that the reactive resume configuration is correct in your .env settings.
        </div>
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={Cloud}
          title="No resumes found"
          message="Could not find any resumes in your Reactive Resume account. Create a resume on the platform first."
          actionLabel="Refresh List"
          onAction={() => refetch()}
        />
      ) : (
        <DataTable
          data={resumes}
          columns={columns}
          keyExtractor={(r) => r.id}
        />
      )}
    </div>
  );
}
