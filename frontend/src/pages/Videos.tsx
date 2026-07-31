import React, { useState } from 'react';
import { Video } from '../types';
import { Video as VideoIcon, ExternalLink, Play, AlertOctagon } from 'lucide-react';
import Modal from '../components/Modal';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings, useVideos } from '../hooks/useHomeData';

export default function Videos() {
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos = [], isLoading, isError } = useVideos();

  if (settings && settings.show_videos === false) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <>
        <SEO
          title={`Hata | ResuMesh`}
          description="Videolar yüklenirken bir hata oluştu."
        />
        <div className="py-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30">
            <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-red-400 mb-2">
              Videolar Yüklenemedi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Videolar ve içerikler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${t('videos.title')} | ResuMesh`}
        description={t('videos.subtitle')}
      />
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              {t('videos.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('videos.subtitle')}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ContentCardSkeleton key={idx} />
            ))
          ) : (videos as Video[]).length === 0 ? (
            <EmptyState
              icon={VideoIcon}
              title={t('videos.emptyTitle')}
              message={t('videos.emptyDesc')}
            />
          ) : (
            (videos as Video[]).map((video) => {
              const tags = [video.platform || 'Video'];

              return (
                <ContentCard
                  key={video.id}
                  title={video.title}
                  tags={tags}
                  description={video.description || t('common.noDescription')}
                  icon={<VideoIcon size={20} />}
                  externalLink={video.url}
                  onClick={() => setSelectedVideo(video)}
                  footerContent={
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                      <Play size={14} aria-hidden="true" />
                      {t('videos.watch')}
                    </span>
                  }
                />
              );
            })
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo?.title}
        >
          {selectedVideo && (
            <div className="space-y-6">
              {selectedVideo.thumbnail && (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <img
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.title}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {selectedVideo.description || t('common.noDescription')}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-700 uppercase font-semibold">
                  {selectedVideo.platform || 'Video'}
                </span>

                {selectedVideo.url && (
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    <span>{t('videos.watch')}</span>
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
