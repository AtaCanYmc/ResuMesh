import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import axios from 'axios';
import { Code, Star, GitFork, Loader2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/projects/`);
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract unique languages
  const allLanguages = Array.from(
    new Set(projects.flatMap(p => p.languages || []))
  ).filter(Boolean);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.languages?.includes(filter));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Açık Kaynak Projeler</h1>
          <p className="text-gray-400">GitHub üzerinden senkronize edilen aktif çalışmalarım.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'All'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          All
        </button>
        {allLanguages.map(lang => (
          <button
            key={lang}
            onClick={() => setFilter(lang)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === lang
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col hover:border-gray-600 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1" title={project.title}>
                {project.title}
              </h3>
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white">
                  <Code size={20} />
                </a>
              )}
            </div>
            <p className="text-gray-400 text-sm flex-1 mb-6 line-clamp-3">
              {project.description || 'Açıklama bulunmuyor.'}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-2 flex-wrap max-w-[60%]">
                {project.languages?.slice(0, 2).map(lang => (
                  <span key={lang} className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-1" title={lang}></span>
                ))}
                <span className="text-xs text-gray-500">{project.languages?.[0]}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1"><Star size={14} /> {project.stars || 0}</span>
                <span className="flex items-center gap-1"><GitFork size={14} /> {project.forks || 0}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
             Bu filtreye uygun proje bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
