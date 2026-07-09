import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_PROJECTS } from '../../data/home';
import SpotlightCard from '../ui/SpotlightCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedProjects: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center xl:justify-start">
        Öne Çıkan Çalışmalar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_PROJECTS.map((project) => {

          const getSpotlightColor = (color: string) => {
            switch(color) {
              case 'blue': return 'rgba(59, 130, 246, 0.15)';
              case 'indigo': return 'rgba(99, 102, 241, 0.15)';
              case 'purple': return 'rgba(168, 85, 247, 0.15)';
              default: return 'rgba(156, 163, 175, 0.15)';
            }
          };

          return (
            <motion.div variants={itemVariants} key={project.id} className="h-full">
              <SpotlightCard spotlightColor={getSpotlightColor(project.color)} className="h-full">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm hover:shadow-md"
                  aria-label={`${project.title} projesine git`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </div>
                    <ExternalLink size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{project.description}</p>
                </a>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
