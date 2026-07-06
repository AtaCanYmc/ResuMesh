import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_PROJECTS } from '../../data/home';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedProjects: React.FC = () => {
  return (
    <motion.div variants={itemVariants} className="pt-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center xl:justify-start">
        Öne Çıkan Çalışmalar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED_PROJECTS.map((project) => {

          const getHoverClasses = (color: string) => {
            switch(color) {
              case 'blue': return 'hover:border-blue-500 focus-visible:ring-blue-500';
              case 'indigo': return 'hover:border-indigo-500 focus-visible:ring-indigo-500';
              case 'purple': return 'hover:border-purple-500 focus-visible:ring-purple-500';
              default: return 'hover:border-gray-500 focus-visible:ring-gray-500';
            }
          };

          const getTextHoverClasses = (color: string) => {
            switch(color) {
              case 'blue': return 'group-hover:text-blue-600 dark:group-hover:text-blue-400';
              case 'indigo': return 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400';
              case 'purple': return 'group-hover:text-purple-600 dark:group-hover:text-purple-400';
              default: return 'group-hover:text-gray-600 dark:group-hover:text-gray-400';
            }
          };

          const getIconHoverClasses = (color: string) => {
            switch(color) {
              case 'blue': return 'group-hover:text-blue-500';
              case 'indigo': return 'group-hover:text-indigo-500';
              case 'purple': return 'group-hover:text-purple-500';
              default: return 'group-hover:text-gray-500';
            }
          };

          return (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl transition-all focus:outline-none focus-visible:ring-2 shadow-sm ${getHoverClasses(project.color)}`}
              aria-label={`${project.title} projesine git`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`font-bold text-gray-900 dark:text-white transition-colors ${getTextHoverClasses(project.color)}`}>
                  {project.title}
                </div>
                <ExternalLink size={16} className={`text-gray-400 transition-colors ${getIconHoverClasses(project.color)}`} aria-hidden="true" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
