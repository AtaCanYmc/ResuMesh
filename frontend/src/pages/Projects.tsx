import React, { useState } from 'react';
import { Project } from '../types';
import axios from 'axios';
import { Star, GitFork, Loader2, Code } from 'lucide-react';
import Modal from '../components/Modal';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '../components/ui/ContentCard';

export default function Projects() {
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
    throw error; // Let ErrorBoundary handle it
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Açık Kaynak Projeler</h1>
          <p className="text-gray-600 dark:text-gray-400">GitHub üzerinden senkronize edilen aktif çalışmalarım.</p>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                filter === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg p-1 px-3 shadow-sm">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sırala:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-gray-900 dark:text-white text-sm focus:ring-0 focus:outline-none border-none py-2 cursor-pointer"
          >
            <option value="stars" className="dark:bg-gray-900">Yıldız Sayısına Göre</option>
            <option value="forks" className="dark:bg-gray-900">Fork Sayısına Göre</option>
            <option value="date_desc" className="dark:bg-gray-900">Eklenme Tarihi (En Yeni)</option>
            <option value="date_asc" className="dark:bg-gray-900">Eklenme Tarihi (En Eski)</option>
            <option value="alphabetical" className="dark:bg-gray-900">Alfabetik (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid using ContentCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => (
          <ContentCard
            key={project.id}
            title={project.title}
            description={project.description || ''}
            tags={project.languages || []}
            externalLink={project.github_url || undefined}
            icon={<Code size={20} />}
            onClick={() => setSelectedProject(project)}
            footerContent={
              <>
                <span className="flex items-center gap-1"><Star size={14} aria-hidden="true" /> {project.stars || 0}</span>
                <span className="flex items-center gap-1"><GitFork size={14} aria-hidden="true" /> {project.forks || 0}</span>
              </>
            }
          />
        ))}
        {sortedProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
             Bu filtreye uygun proje bulunamadı.
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
              {selectedProject.description || 'Açıklama bulunmuyor.'}
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
                  <span>GitHub'da Görüntüle</span>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
