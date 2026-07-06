import React from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HERO_DATA } from '../../data/home';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const HeroSection: React.FC = () => {
  return (
    <motion.div variants={itemVariants} className="space-y-6 text-center xl:text-left">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
        Hi, I'm <span className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">{HERO_DATA.name}</span>.<br />
        {HERO_DATA.title}
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto xl:mx-0">
        {HERO_DATA.description}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 pt-2">
        <a
          href={HERO_DATA.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-blue-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          aria-label="Özgeçmişimi İndir"
        >
          <Download size={20} aria-hidden="true" />
          <span>Özgeçmişimi İndir</span>
        </a>
        <Link
          to="/projects"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-medium rounded-xl transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          aria-label="Projelerimi İncele"
        >
          <span>Projelerimi İncele</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
};

export default HeroSection;
