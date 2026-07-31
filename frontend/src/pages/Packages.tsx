import React, { useState } from 'react';
import { Package } from '../types';
import { Package as PackageIcon, Download, ExternalLink, BookOpen, ChevronDown, FolderSearch, AlertOctagon } from 'lucide-react';
import Modal from '../components/Modal';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings, usePackages } from '../hooks/useHomeData';

export default function Packages() {
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'platform'>('downloads');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const { data: packages = [], isLoading, isError } = usePackages();

  if (settings && settings.show_packages === false) {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <>
        <SEO
          title={`Hata | ResuMesh`}
          description="Paketler yüklenirken bir hata oluştu."
        />
        <div className="py-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30">
            <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-red-400 mb-2">
              Paketler Yüklenemedi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Paketler ve kütüphaneler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Extract unique platforms
  const platforms = Array.from(
    new Set((packages as Package[]).map(p => p.platform).filter(Boolean))
  );

  const filteredPackages = (packages as Package[]).filter(pkg => {
    if (platformFilter !== 'All' && pkg.platform !== platformFilter) return false;
    return true;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'downloads':
        return (b.last_month_downloads || 0) - (a.last_month_downloads || 0);
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'platform':
        return (a.platform || '').localeCompare(b.platform || '');
      default:
        return 0;
    }
  });

  return (
    <>
      <SEO
        title={`${t('packages.title')} | ResuMesh`}
        description={t('packages.subtitle')}
      />
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              {t('packages.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('packages.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
          {/* Platform Filters */}
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setPlatformFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
                platformFilter === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              All
            </button>
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
                  platformFilter === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="relative shrink-0 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <option value="downloads">Aylık İndirmeye Göre</option>
              <option value="name">Alfabetik (A-Z)</option>
              <option value="platform">Platforma Göre</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Grid using ContentCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ContentCardSkeleton key={idx} />
            ))
          ) : packages.length === 0 ? (
            <EmptyState
              icon={PackageIcon}
              title={t('packages.emptyTitle')}
              message={t('packages.emptyDesc')}
            />
          ) : sortedPackages.length > 0 ? (
            sortedPackages.map((pkg) => {
              const tagsArray = pkg.tags ? pkg.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
              if (pkg.platform && !tagsArray.includes(pkg.platform)) {
                tagsArray.unshift(pkg.platform);
              }
              if (pkg.version) {
                tagsArray.push(`v${pkg.version}`);
              }

              return (
                <ContentCard
                  key={pkg.id}
                  title={pkg.title}
                  tags={tagsArray}
                  description={pkg.description || t('common.noDescription')}
                  icon={<PackageIcon size={20} />}
                  externalLink={pkg.url || pkg.docs_url || undefined}
                  onClick={() => setSelectedPackage(pkg)}
                  footerContent={
                    pkg.last_month_downloads !== undefined && pkg.last_month_downloads > 0 ? (
                      <span className="flex items-center gap-1">
                        <Download size={14} aria-hidden="true" />
                        {pkg.last_month_downloads.toLocaleString()} / ay
                      </span>
                    ) : null
                  }
                />
              );
            })
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-4">
                <FolderSearch size={32} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Paket Bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Seçtiğiniz filtreye uygun bir paket veya kütüphane bulunamadı.
              </p>
              <button
                onClick={() => {
                  setPlatformFilter('All');
                }}
                className="px-6 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          title={selectedPackage?.title}
        >
          {selectedPackage && (
            <div className="space-y-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {selectedPackage.description || t('common.noDescription')}
              </p>

              {/* Tags & Metadata */}
              <div className="flex gap-2 flex-wrap items-center">
                {selectedPackage.platform && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-semibold rounded-md text-sm border border-blue-200 dark:border-blue-800">
                    {selectedPackage.platform}
                  </span>
                )}
                {selectedPackage.version && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-700">
                    v{selectedPackage.version}
                  </span>
                )}
                {selectedPackage.tags &&
                  selectedPackage.tags.split(',').map((tag) => (
                    <span
                      key={tag.trim()}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-700"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>

              {/* Download & Links */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 flex-wrap">
                {selectedPackage.last_month_downloads !== undefined && selectedPackage.last_month_downloads > 0 && (
                  <div className="flex items-center gap-2">
                    <Download size={18} aria-hidden="true" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedPackage.last_month_downloads.toLocaleString()}
                    </span>
                    <span className="text-sm">aylık indirme</span>
                  </div>
                )}

                <div className="ml-auto flex gap-3 items-center flex-wrap">
                  {selectedPackage.docs_url && (
                    <a
                      href={selectedPackage.docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm font-medium"
                    >
                      <BookOpen size={16} aria-hidden="true" />
                      <span>{t('packages.docs')}</span>
                    </a>
                  )}

                  {selectedPackage.url && (
                    <a
                      href={selectedPackage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm font-medium"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      <span>Platform Sayfası</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
