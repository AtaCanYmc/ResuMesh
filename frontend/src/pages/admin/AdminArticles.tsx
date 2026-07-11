import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ArticleFormModal from '../../components/admin/forms/ArticleFormModal';
import EmptyState from '../../components/ui/EmptyState';
import { Article } from '../../types';

export default function AdminArticles() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/articles/`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      toast.success('Article deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      setArticleToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete article.');
      setArticleToDelete(null);
    }
  });

  const columns = [
    { header: 'Title', accessorKey: 'title', cell: (a: Article) => <span className="font-medium text-gray-900 dark:text-white">{a.title}</span> },
    { header: 'Platform', accessorKey: 'platform', cell: (a: Article) => <span className="capitalize">{a.platform}</span> },
    { header: 'Published Date', accessorKey: 'published_date', cell: (a: Article) => a.published_date ? new Date(a.published_date).toLocaleDateString() : '-' },
    { header: 'Url', accessorKey: 'url', cell: (a: Article) => a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Link</a> : '-' },
  ];

  const handleEdit = (article: Article) => {
    setArticleToEdit(article);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setArticleToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteMutation.mutate(articleToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Articles"
        description="Manage your published articles and blog posts."
        actionLabel="Add Article"
        onAction={handleAdd}
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading articles...</div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No articles added yet"
          message="Share your professional knowledge and writing by adding links to your blog posts."
          actionLabel="Add Article"
          onAction={handleAdd}
        />
      ) : (
        <DataTable
          data={articles}
          columns={columns}
          keyExtractor={(a) => a.id}
          onEdit={handleEdit}
          onDelete={(a) => setArticleToDelete(a)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!articleToDelete}
        onClose={() => setArticleToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />

      <ArticleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        article={articleToEdit}
      />
    </div>
  );
}
