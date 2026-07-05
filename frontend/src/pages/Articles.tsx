import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import axios from 'axios';
import { Loader2, ExternalLink, Clock, Calendar } from 'lucide-react';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'medium' | 'devto'>('medium');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get<Article[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/articles`);
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
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Makaleler</h1>
          <p className="text-gray-400">Teknik yazılarım ve paylaşımlarım.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setActiveTab('medium')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'medium'
                ? 'bg-black text-white shadow-sm border border-gray-700'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setActiveTab('devto')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'devto'
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
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <ExternalLink size={20} className="text-gray-600 group-hover:text-blue-400 ml-4 shrink-0" />
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
              {article.read_time_minutes && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{article.read_time_minutes} min read</span>
                </div>
              )}
            </div>
          </a>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
             Bu platformda henüz makale bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
