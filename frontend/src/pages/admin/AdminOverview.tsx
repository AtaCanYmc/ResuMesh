import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Welcome to your ResuMesh Admin Portal."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quick Start</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select a module</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Use the sidebar to navigate to your projects, articles, experiences, or tools.
          </p>
        </div>
      </div>
    </div>
  );
}
