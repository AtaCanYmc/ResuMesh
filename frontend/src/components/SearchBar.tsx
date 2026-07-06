import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, FolderGit, Briefcase, BookOpen, Award, ExternalLink } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { GlobalSearchResponse, SearchResultItem } from '../types';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get<GlobalSearchResponse>(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/search`,
          { params: { query: debouncedQuery } }
        );
        setResults(response.data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSection = (title: string, items: SearchResultItem[], icon: React.ReactNode, linkPrefix: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2 px-3">
          {icon}
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col px-3 py-2 hover:bg-gray-800 rounded-lg group transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400">{item.title}</span>
                    <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400" />
                  </div>
                  {item.subtitle && <span className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</span>}
                </a>
              ) : (
                <Link
                  to={linkPrefix}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-3 py-2 hover:bg-gray-800 rounded-lg group transition-colors"
                >
                  <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400">{item.title}</span>
                  {item.subtitle && <span className="text-xs text-gray-500 line-clamp-1">{item.subtitle}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const hasResults = results && (
    results.projects.length > 0 ||
    results.experiences.length > 0 ||
    results.articles.length > 0 ||
    results.certificates.length > 0
  );

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-xl focus-within:border-blue-500 shadow-lg transition-all">
        <Search className="absolute left-4 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
             setQuery(e.target.value);
             if (e.target.value.trim() && results) setIsOpen(true);
          }}
          onFocus={() => { if (query.trim() && results) setIsOpen(true); }}
          placeholder="Yetenek, proje, sertifika veya makale ara..."
          className="w-full bg-transparent pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        {loading && (
          <div className="absolute right-4">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (query.trim() !== '') && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          <div className="p-2">
            {!loading && !hasResults && (
               <div className="p-4 text-center text-sm text-gray-500">
                 Sonuç bulunamadı.
               </div>
            )}

            {results && (
              <>
                {renderSection("Projeler", results.projects, <FolderGit size={14} />, "/projects")}
                {renderSection("Deneyimler", results.experiences, <Briefcase size={14} />, "/experiences")}
                {renderSection("Makaleler", results.articles, <BookOpen size={14} />, "/articles")}
                {renderSection("Sertifikalar", results.certificates, <Award size={14} />, "/certificates")}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
