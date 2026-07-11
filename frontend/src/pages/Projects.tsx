import React, { useState } from 'react';
import { Project } from '../types';
import axios from 'axios';
import { Star, GitFork, Loader2, Code, FolderSearch, ChevronDown, FolderGit, AlertOctagon } from 'lucide-react';
import Modal from '../components/Modal';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '../components/ui/ContentCard';
import { ContentCardSkeleton } from '../components/ui/ContentCardSkeleton';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';

export default function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'date_desc' | 'date_asc' | 'alphabetical'>('stars');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // TanStack Query for data fetching
  const { data: projects = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axios.get<Project[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/projects/`);
      return res.data;
    }
  });

  if (isError) {
    return (
      <>
        <SEO
          title={`Hata | ResuMesh`}
          description="Projeler yüklenirken bir hata oluştu."
        />
        <div className="py-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30">
            <AlertOctagon className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-red-400 mb-2">
              Projeler Yüklenemedi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Açık kaynak projeleri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Extract unique languages
  const allLanguages = Array.from(
    new Set(projects.flatMap(p => p.languages || []))
  ).filter(Boolean);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.languages?.includes(filter));

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return (b.stars || 0) - (a.stars || 0);
      case 'forks':
        return (b.forks || 0) - (a.forks || 0);
      case 'date_desc':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'date_asc':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <>
    <SEO
      title={`${t('projects.title')} | ResuMesh`}
      description={t('projects.subtitle')}
    />
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">{t('projects.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('projects.subtitle')}</p>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
        {/* Horizontal Scrollable Filters */}
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
              filter === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}
          >
            All
          </button>
          {allLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => setFilter(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
                filter === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Custom Headless Select */}
        <div className="relative shrink-0 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            <option value="stars">Yıldız Sayısına Göre</option>
            <option value="forks">Fork Sayısına Göre</option>
            <option value="date_desc">Eklenme Tarihi (En Yeni)</option>
            <option value="date_asc">Eklenme Tarihi (En Eski)</option>
            <option value="alphabetical">Alfabetik (A-Z)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
            <ChevronDown size={16} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Grid using ContentCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, idx) => (
            <ContentCardSkeleton key={idx} />
          ))
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderGit}
            title={t('projects.emptyTitle')}
            message={t('projects.emptyDesc')}
          />
        ) : sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ContentCard
              key={project.id}
              title={project.title}
              tags={project.languages || []}
              description={project.description || t('common.noDescription')}
              icon={<Code size={20} />}
              externalLink={project.github_url || undefined}
              onClick={() => setSelectedProject(project)}
              footerContent={
                <>
                  <span className="flex items-center gap-1"><Star size={14} aria-hidden="true" /> {project.stars || 0}</span>
                  <span className="flex items-center gap-1"><GitFork size={14} aria-hidden="true" /> {project.forks || 0}</span>
                </>
              }
            />
          ))
        ) : (
          // Empty State
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-4">
              <FolderSearch size={32} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Proje Bulunamadı</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Seçtiğiniz <span className="font-semibold text-gray-700 dark:text-gray-300">"{filter}"</span> filtresine uygun bir açık kaynak projesi henüz eklenmemiş.
            </p>
            <button
              onClick={() => setFilter('All')}
              className="px-6 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
              {selectedProject.description || t('common.noDescription')}
            </p>

            <div className="flex gap-2 flex-wrap">
              {selectedProject.languages?.map(lang => (
                <span key={lang} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md text-sm border border-gray-200 dark:border-gray-700">
                  {lang}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star size={18} aria-hidden="true" />
                <span>{selectedProject.stars || 0} Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork size={18} aria-hidden="true" />
                <span>{selectedProject.forks || 0} Forks</span>
              </div>
              {selectedProject.github_url && (
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Code size={18} aria-hidden="true" />
                  <span>{t('common.viewOnGithub')}</span>
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
