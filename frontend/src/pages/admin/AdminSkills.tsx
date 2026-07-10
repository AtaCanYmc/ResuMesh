import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import SkillFormModal from '../../components/admin/forms/SkillFormModal';
import { Skill } from '../../types';

export default function AdminSkills() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/skills/`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('Skill deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      setSkillToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete skill.');
      setSkillToDelete(null);
    }
  });

  const columns = [
    { header: 'Name', accessorKey: 'name', cell: (s: Skill) => <span className="font-medium text-gray-900 dark:text-white">{s.name}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Icon Name', accessorKey: 'icon_name' },
  ];

  const handleEdit = (skill: Skill) => {
    setSkillToEdit(skill);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSkillToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (skillToDelete) {
      deleteMutation.mutate(skillToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Skills"
        description="Manage your skills and categorize them."
        actionLabel="Add Skill"
        onAction={handleAdd}
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading skills...</div>
      ) : (
        <DataTable
          data={skills}
          columns={columns}
          keyExtractor={(s) => s.id}
          onEdit={handleEdit}
          onDelete={(s) => setSkillToDelete(s)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />

      <SkillFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        skill={skillToEdit}
      />
    </div>
  );
}
