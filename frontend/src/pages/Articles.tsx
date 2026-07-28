import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import axios from 'axios';
import { Loader2, ExternalLink, Clock, Calendar, BookOpen } from 'lucide-react';
import Modal from '../components/Modal';
import SEO from '../components/SEO';
import EmptyState from '../components/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { ENV } from '../config/env';

import { ArticlesSkeleton } from '../components/ui/Skeletons';

export default function Articles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MEDIUM' | 'DEV_TO'>('MEDIUM');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get<Article[]>(`${ENV.API_URL}/api/v1/articles/`);
        setArticles(res.data);
      } catch (error) {
        console.error('Failed to fetch articles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(a => a.platform === activeTab);

  if (loading) {
    return <ArticlesSkeleton />;
  }

  return (
    <>
    <SEO
      title={`${t('articles.title')} | ResuMesh`}
      description={t('articles.subtitle')}
    />
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{t('articles.title')}</h1>
          <p className="text-gray-400">{t('articles.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setActiveTab('MEDIUM')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'MEDIUM'
                ? 'bg-black text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setActiveTab('DEV_TO')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'DEV_TO'
                ? 'bg-black text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dev.to
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-600 group-hover:text-blue-400 ml-4 shrink-0"
              >
                <ExternalLink size={20} />
              </a>
            </div>

            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
              {article.summary || 'Açıklama bulunmuyor.'}
            </p>

            <div className="flex items-center space-x-4 text-xs font-medium text-gray-500 mt-auto">
              {article.published_at && (
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              )}
              {article.reading_time_minutes && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{article.reading_time_minutes} min read</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredArticles.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title={t('articles.emptyTitle')}
            message={t('articles.emptyDesc', { platform: activeTab })}
          />
        )}
      </div>

      <Modal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title}
      >
        {selectedArticle && (
          <div className="space-y-6">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
              {selectedArticle.summary || t('common.noDescription')}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-800 text-gray-400">
              {selectedArticle.published_at && (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>{new Date(selectedArticle.published_at).toLocaleDateString()}</span>
                </div>
              )}
              {selectedArticle.reading_time_minutes && (
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{selectedArticle.reading_time_minutes} min read</span>
                </div>
              )}
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <ExternalLink size={18} />
                <span>{t('common.readMore')}</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
    </>
  );
}
