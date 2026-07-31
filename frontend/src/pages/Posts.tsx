import React, { useState } from 'react';
import { Post } from '../types';
import { Share2, ExternalLink, AlertOctagon } from 'lucide-react';
import Modal from '../components/Modal';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings, usePosts } from '../hooks/useHomeData';

export default function Posts() {
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { data: posts = [], isLoading, isError } = usePosts();

  if (settings && settings.show_posts === false) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <>
        <SEO
          title={`Hata | ResuMesh`}
          description="Gönderiler yüklenirken bir hata oluştu."
        />
        <div className="py-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30">
            <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-red-400 mb-2">
              Gönderiler Yüklenemedi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Paylaşımlar yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${t('posts.title')} | ResuMesh`}
        description={t('posts.subtitle')}
      />
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              {t('posts.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('posts.subtitle')}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ContentCardSkeleton key={idx} />
            ))
          ) : (posts as Post[]).length === 0 ? (
            <EmptyState
              icon={Share2}
              title={t('posts.emptyTitle')}
              message={t('posts.emptyDesc')}
            />
          ) : (
            (posts as Post[]).map((post) => {
              const tags = [post.platform || 'Post'];

              return (
                <ContentCard
                  key={post.id}
                  title={post.title}
                  tags={tags}
                  description={post.description || t('common.noDescription')}
                  icon={<Share2 size={20} />}
                  externalLink={post.url}
                  onClick={() => setSelectedPost(post)}
                  footerContent={
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                      <ExternalLink size={14} aria-hidden="true" />
                      {t('posts.viewPost')}
                    </span>
                  }
                />
              );
            })
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          title={selectedPost?.title}
        >
          {selectedPost && (
            <div className="space-y-6">
              {selectedPost.thumbnail && (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <img
                    src={selectedPost.thumbnail}
                    alt={selectedPost.title}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {selectedPost.description || t('common.noDescription')}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-700 uppercase font-semibold">
                  {selectedPost.platform || 'Post'}
                </span>

                {selectedPost.url && (
                  <a
                    href={selectedPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    <span>{t('posts.viewPost')}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
