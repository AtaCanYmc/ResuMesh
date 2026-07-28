import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

interface AppSettings {
  show_projects: boolean;
  show_certificates: boolean;
  show_videos: boolean;
  show_experiences: boolean;
}

const ToggleSwitch = ({ label, description, isChecked, onChange }: { label: string; description: string; isChecked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 last:border-none">
    <div className="space-y-1">
      <span className="text-sm font-semibold text-gray-900 dark:text-white block">{label}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 block">{description}</span>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`${
        isChecked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-850'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0`}
    >
      <span
        className={`${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  </div>
);

export default function AdminAppSettings() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001';

  const { data: settings = {
    show_projects: true,
    show_certificates: true,
    show_videos: true,
    show_experiences: true,
  }, isLoading } = useQuery<AppSettings>({
    queryKey: ['admin-app-settings'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/v1/settings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<AppSettings>) => {
      const res = await axios.patch(`${API_URL}/api/v1/settings/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-app-settings'], data);
      toast.success('Settings updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update settings.');
    }
  });

  const handleToggle = (key: keyof AppSettings) => {
    updateMutation.mutate({ [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure your portfolio visibility preferences."
      />

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm max-w-2xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <Eye size={18} className="text-gray-500 dark:text-gray-400" />
            <h2 className="text-sm font-bold text-gray-850 dark:text-white uppercase tracking-wider">Module Visibility</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <ToggleSwitch
              label="Projects Section"
              description="Show or hide your projects page on the public site."
              isChecked={settings.show_projects}
              onChange={() => handleToggle('show_projects')}
            />
            <ToggleSwitch
              label="Certificates Section"
              description="Show or hide your certificates page on the public site."
              isChecked={settings.show_certificates}
              onChange={() => handleToggle('show_certificates')}
            />
            <ToggleSwitch
              label="Videos Section"
              description="Show or hide your videos page on the public site."
              isChecked={settings.show_videos}
              onChange={() => handleToggle('show_videos')}
            />
            <ToggleSwitch
              label="Experiences Section"
              description="Show or hide your experiences page on the public site."
              isChecked={settings.show_experiences}
              onChange={() => handleToggle('show_experiences')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
