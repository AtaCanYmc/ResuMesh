import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { Certificate } from '../../types';

export default function AdminCertificates() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);

  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['admin-certificates'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/certificates/`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('Certificate deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      setCertificateToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete certificate.');
      setCertificateToDelete(null);
    }
  });

  const columns = [
    { header: 'Name', accessorKey: 'name', cell: (c: Certificate) => <span className="font-medium text-gray-900 dark:text-white">{c.name}</span> },
    { header: 'Issuer', accessorKey: 'issuer' },
    { header: 'Issue Date', accessorKey: 'issue_date', cell: (c: Certificate) => new Date(c.issue_date).toLocaleDateString() },
  ];

  const handleEdit = (certificate: Certificate) => {
    toast('Edit functionality will be opened in a Drawer/Modal soon.', { icon: '🚧' });
  };

  const confirmDelete = () => {
    if (certificateToDelete) {
      deleteMutation.mutate(certificateToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Certificates"
        description="Manage your professional certificates and licenses."
        actionLabel="Add Certificate"
        onAction={() => toast('Create form will be opened in a Drawer/Modal soon.', { icon: '🚧' })}
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading certificates...</div>
      ) : (
        <DataTable
          data={certificates}
          columns={columns}
          keyExtractor={(c) => c.id}
          onEdit={handleEdit}
          onDelete={(c) => setCertificateToDelete(c)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!certificateToDelete}
        onClose={() => setCertificateToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${certificateToDelete?.name}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
