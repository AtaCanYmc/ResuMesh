import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  HardDrive,
  Upload,
  Trash2,
  ExternalLink,
  Search,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Database,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ADMIN_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface StorageFile {
  name: string;
  bucket: string;
  created_at: string | null;
  updated_at: string | null;
  size: number | null;
  content_type: string;
  public_url: string;
}

interface BucketInfo {
  name: string;
  description: string;
  allowed_mime: string[];
}

export default function AdminStorage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [activeBucket, setActiveBucket] = useState<string>('cv-pdfs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  // Fetch Available Buckets
  const { data: buckets = [] } = useQuery<BucketInfo[]>({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      const res = await axios.get(`${ADMIN_API_URL}/api/v1/admin/storage/buckets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  // Fetch Files in Active Bucket
  const {
    data: files = [],
    isLoading,
    isRefetching,
    refetch
  } = useQuery<StorageFile[]>({
    queryKey: ['storage-files', activeBucket],
    queryFn: async () => {
      const res = await axios.get(`${ADMIN_API_URL}/api/v1/admin/storage/files?bucket=${activeBucket}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (filename: string) => {
      await axios.delete(
        `${ADMIN_API_URL}/api/v1/admin/storage/files?bucket=${activeBucket}&filename=${encodeURIComponent(filename)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    },
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['storage-files', activeBucket] });
      setDeletingFile(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to delete file');
      setDeletingFile(null);
    }
  });

  // Handle File Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(
        `${ADMIN_API_URL}/api/v1/admin/storage/upload?bucket=${activeBucket}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      toast.success(`File uploaded to ${activeBucket} bucket!`);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['storage-files', activeBucket] });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Filter files based on search
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HardDrive className="text-blue-600 dark:text-blue-400" />
            Supabase Storage Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload, inspect, download, and monitor files stored across Supabase Storage buckets.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={16} className={isRefetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Database size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Active Bucket</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{activeBucket}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FileCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Files</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{files.length}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Size</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{formatBytes(totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bucket Selector Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex gap-2">
        {buckets.map((b) => (
          <button
            key={b.name}
            onClick={() => {
              setActiveBucket(b.name);
              setSearchQuery('');
            }}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeBucket === b.name
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {b.name === 'cv-pdfs' ? <FileText size={16} /> : <ImageIcon size={16} />}
            {b.name}
          </button>
        ))}
      </div>

      {/* Upload Dropzone / Card */}
      <form onSubmit={handleUpload} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} className="text-blue-600 dark:text-blue-400" />
          Upload New File to <span className="text-blue-600 dark:text-blue-400">{activeBucket}</span>
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer"
          />
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload File
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search & File Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Files in Bucket ({filteredFiles.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Files Table */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Loading storage files...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            No files found in <span className="font-semibold">{activeBucket}</span>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Content Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                {filteredFiles.map((file) => (
                  <tr key={file.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {activeBucket === 'cv-pdfs' ? (
                        <FileText size={16} className="text-red-500 shrink-0" />
                      ) : (
                        <ImageIcon size={16} className="text-blue-500 shrink-0" />
                      )}
                      <span className="truncate max-w-xs">{file.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {file.content_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs font-mono">
                      {file.size ? formatBytes(file.size) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`${ADMIN_API_URL}${file.public_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Open Public Link"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeletingFile(file.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete File</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{deletingFile}</span> from <span className="font-semibold">{activeBucket}</span> bucket?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFile(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deletingFile)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
