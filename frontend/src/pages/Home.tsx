import React from 'react';
import { Code, BookOpen, Star, User } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between h-full py-12">
      {/* Left: Bio & Hero */}
      <div className="flex-1 space-y-6 pr-8">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Hi, I'm <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Ata Can</span>.<br />
          I bridge the gap between AI Workflows and Financial Technologies.
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
          Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum. Modern web teknolojileriyle karmaşık verileri anlamlı içgörülere dönüştürüyorum.
        </p>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center space-x-4 hover:border-blue-500/50 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <Code size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-gray-500 font-medium">Active Projects</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center space-x-4 hover:border-indigo-500/50 transition-colors">
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12+</div>
              <div className="text-sm text-gray-500 font-medium">Technical Articles</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center space-x-4 hover:border-purple-500/50 transition-colors">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <Star size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm text-gray-500 font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Avatar Placeholder */}
      <div className="hidden lg:flex w-72 h-72 xl:w-96 xl:h-96 relative mt-12 lg:mt-0">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        <div className="w-full h-full rounded-full border border-gray-800 bg-gray-900 flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">
           <User size={100} className="text-gray-700" />
           {/* Replace with actual image <img src="profile.jpg" className="w-full h-full object-cover" /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
