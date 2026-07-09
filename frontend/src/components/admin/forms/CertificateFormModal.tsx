import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../Modal';
import { Certificate } from '../../../types';

const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuing_organization: z.string().optional(),
  issue_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.union([z.literal(''), z.string().url('Invalid URL')]).optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

interface CertificateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate?: Certificate | null;
}

export default function CertificateFormModal({ isOpen, onClose, certificate }: CertificateFormModalProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  useEffect(() => {
    if (certificate && isOpen) {
      const formatDate = (dateString?: string) => dateString ? dateString.split('T')[0] : '';
      reset({
        name: certificate.name,
        issuing_organization: certificate.issuing_organization || '',
        issue_date: formatDate(certificate.issue_date),
        credential_id: certificate.credential_id || '',
        credential_url: certificate.credential_url || '',
      });
    } else if (isOpen) {
      reset({
        name: '',
        issuing_organization: '',
        issue_date: '',
        credential_id: '',
        credential_url: '',
      });
    }
  }, [certificate, isOpen, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = certificate
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/certificates/${certificate.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/certificates/`;
      const method = certificate ? 'put' : 'post';
      await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success(certificate ? 'Certificate updated!' : 'Certificate created!');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['home-data'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to save certificate.');
    }
  });

  const onSubmit = (data: CertificateFormData) => {
    const payload = {
      ...data,
      issuing_organization: data.issuing_organization || null,
      issue_date: data.issue_date || null,
      credential_id: data.credential_id || null,
      credential_url: data.credential_url || null,
    };
    saveMutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={certificate ? 'Edit Certificate' : 'Add Certificate'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            placeholder="AWS Certified Solutions Architect"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issuing Organization</label>
          <input
            {...register('issuing_organization')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Amazon Web Services"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
          <input
            type="date"
            {...register('issue_date')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credential ID</label>
            <input
              {...register('credential_id')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              placeholder="123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Credential URL</label>
            <input
              {...register('credential_url')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              placeholder="https://www.credly.com/..."
            />
            {errors.credential_url && <p className="text-red-500 text-xs mt-1">{errors.credential_url.message}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
