import React from 'react';
import { useLogs } from '../../hooks/useLogs';
import LogTable from '../../components/LogTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { ShieldAlert, Loader2, RefreshCw } from 'lucide-react';

export default function AdminSystemLogs() {
  const { logs, loading, error, fetchLogs } = useLogs();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Logs"
        description="View real-time system health and audit logs."
        actionLabel="Refresh Logs"
        onAction={fetchLogs}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && !logs.length ? (
        <div className="flex items-center justify-center h-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <LogTable logs={logs} />
        </div>
      )}
    </div>
  );
}
