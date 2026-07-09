import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { Project } from '../../types';

export default function AdminProjects() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Read
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/projects/`);
      return res.data;
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('Project deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setProjectToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete project.');
      setProjectToDelete(null);
    }
  });

  const columns = [
    { header: 'Title', accessorKey: 'title', cell: (p: Project) => <span className="font-medium text-gray-900 dark:text-white">{p.title}</span> },
    { header: 'Description', accessorKey: 'description', cell: (p: Project) => <span className="line-clamp-1">{p.description || '-'}</span> },
    { header: 'Stars', accessorKey: 'stargazers_count' },
    { header: 'Forks', accessorKey: 'forks_count' },
  ];

  const handleEdit = (project: Project) => {
    toast('Edit functionality will be opened in a Drawer/Modal soon.', { icon: '🚧' });
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Manage your open source and personal projects."
        actionLabel="Add Project"
        onAction={() => toast('Create form will be opened in a Drawer/Modal soon.', { icon: '🚧' })}
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading projects...</div>
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          keyExtractor={(p) => p.id}
          onEdit={handleEdit}
          onDelete={(p) => setProjectToDelete(p)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
