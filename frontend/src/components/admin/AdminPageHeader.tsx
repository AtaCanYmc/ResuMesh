import React from 'react';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminPageHeader({ title, description, actionLabel, onAction }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
