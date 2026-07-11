import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FolderGit, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ProjectFormModal from '../../components/admin/forms/ProjectFormModal';
import EmptyState from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeletons';
import { Project } from '../../types';

export default function AdminProjects() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

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

  // Refresh Mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      const username = import.meta.env.VITE_GITHUB_USERNAME || 'AtaCanYmc';
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/projects/refresh`,
        { username, include_forks: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Projects ingestion started in background.');
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to trigger projects refresh.');
    }
  });

  const columns = [
    { header: 'Title', accessorKey: 'title', cell: (p: Project) => <span className="font-medium text-gray-900 dark:text-white">{p.title}</span> },
    { header: 'Description', accessorKey: 'description', cell: (p: Project) => <span className="line-clamp-1">{p.description || '-'}</span> },
    { header: 'Stars', accessorKey: 'stars' },
    { header: 'Forks', accessorKey: 'forks' },
  ];

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setProjectToEdit(null);
    setIsFormOpen(true);
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
        onAction={handleAdd}
        secondaryActionLabel={refreshMutation.isPending ? "Refreshing..." : "Refresh Github"}
        secondaryActionIcon={<RefreshCw size={18} className={refreshMutation.isPending ? "animate-spin" : ""} />}
        onSecondaryAction={() => refreshMutation.mutate()}
        isSecondaryPending={refreshMutation.isPending}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit}
          title="No projects added yet"
          message="Showcase your coding skills by adding open-source projects or personal works."
          actionLabel="Add Project"
          onAction={handleAdd}
        />
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

      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        project={projectToEdit}
      />
    </div>
  );
}
