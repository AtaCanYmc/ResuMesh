import React, { useState } from 'react';
import { Code, BookOpen, Star, User, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between h-full py-8 xl:py-12 gap-12">
      {/* Left: Bio, CTA & Metrics */}
      <div className="flex-1 space-y-8 w-full max-w-3xl xl:max-w-none">

        <div className="space-y-6 text-center xl:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
            Hi, I'm <span className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">Ata Can</span>.<br />
            I bridge the gap between AI Workflows and Financial Technologies.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto xl:mx-0">
            Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum. Modern web teknolojileriyle karmaşık verileri anlamlı içgörülere dönüştürüyorum.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              aria-label="Özgeçmişimi İndir"
            >
              <Download size={20} aria-hidden="true" />
              <span>Özgeçmişimi İndir</span>
            </a>
            <Link
              to="/projects"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              aria-label="Projelerimi İncele"
            >
              <span>Projelerimi İncele</span>
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-center space-x-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors shadow-sm">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <Code size={24} aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Projects</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-center space-x-4 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BookOpen size={24} aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Technical Articles</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-center space-x-4 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors shadow-sm">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
              <Star size={24} aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Featured Works */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center xl:justify-start">
            Öne Çıkan Çalışmalar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Project 1 */}
            <a href="#" className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Lumina</div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Açık kaynak ekosistemi için geliştirilmiş modüler veri analizi aracı.</p>
            </a>

            {/* Project 2 */}
            <a href="#" className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">ÇukurVar</div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Sivil teknoloji alanında kentsel sorunları raporlama platformu.</p>
            </a>

            {/* Project 3 */}
            <a href="#" className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">SentinelCell</div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Gelişmiş yapay zeka entegrasyonları için middleware (ara katman).</p>
            </a>

          </div>
        </div>
      </div>

      {/* Right: Avatar Placeholder */}
      <div className="w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 relative shrink-0">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
        <div className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">

           {/* Image Fallback Logic */}
           {!imageError ? (
             <img
               src="/images/profile.jpg"
               alt="Ata Can Avatar"
               className="w-full h-full object-cover"
               onError={() => setImageError(true)}
             />
           ) : (
             <div className="flex flex-col items-center justify-center">
               <User size={80} className="text-gray-400 dark:text-gray-700 mb-2" aria-hidden="true" />
               <span className="text-2xl font-bold text-gray-500 dark:text-gray-600">AC</span>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default Home;
