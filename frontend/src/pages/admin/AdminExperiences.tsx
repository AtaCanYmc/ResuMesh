import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { Experience } from '../../types';

export default function AdminExperiences() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['admin-experiences'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/experiences/`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('Experience deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      setExperienceToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete experience.');
      setExperienceToDelete(null);
    }
  });

  const columns = [
    { header: 'Title', accessorKey: 'title', cell: (e: Experience) => <span className="font-medium text-gray-900 dark:text-white">{e.title}</span> },
    { header: 'Company', accessorKey: 'company_name' },
    { header: 'Location', accessorKey: 'location' },
    { header: 'Start Date', accessorKey: 'start_date', cell: (e: Experience) => new Date(e.start_date).toLocaleDateString() },
  ];

  const handleEdit = (experience: Experience) => {
    toast('Edit functionality will be opened in a Drawer/Modal soon.', { icon: '🚧' });
  };

  const confirmDelete = () => {
    if (experienceToDelete) {
      deleteMutation.mutate(experienceToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experiences"
        description="Manage your work experience and career history."
        actionLabel="Add Experience"
        onAction={() => toast('Create form will be opened in a Drawer/Modal soon.', { icon: '🚧' })}
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading experiences...</div>
      ) : (
        <DataTable
          data={experiences}
          columns={columns}
          keyExtractor={(e) => e.id}
          onEdit={handleEdit}
          onDelete={(e) => setExperienceToDelete(e)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!experienceToDelete}
        onClose={() => setExperienceToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Experience"
        message={`Are you sure you want to delete "${experienceToDelete?.title} at ${experienceToDelete?.company_name}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
