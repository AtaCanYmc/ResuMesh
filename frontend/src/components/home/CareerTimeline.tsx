import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCES_DATA } from '../../data/home';
import SpotlightCard from '../ui/SpotlightCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function CareerTimeline() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-12"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 flex items-center justify-center xl:justify-start">
        Kariyer Özeti
      </h2>

      <div className="relative pl-4 sm:pl-8">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 sm:left-8 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-800 rounded-full" />

        <div className="space-y-8">
          {EXPERIENCES_DATA.map((exp, index) => {
            const getDotColor = (color: string) => {
              switch(color) {
                case 'blue': return 'bg-blue-500 shadow-blue-500/50';
                case 'indigo': return 'bg-indigo-500 shadow-indigo-500/50';
                case 'purple': return 'bg-purple-500 shadow-purple-500/50';
                default: return 'bg-gray-500 shadow-gray-500/50';
              }
            };

            const getSpotlightColor = (color: string) => {
              switch(color) {
                case 'blue': return 'rgba(59, 130, 246, 0.1)';
                case 'indigo': return 'rgba(99, 102, 241, 0.1)';
                case 'purple': return 'rgba(168, 85, 247, 0.1)';
                default: return 'rgba(156, 163, 175, 0.1)';
              }
            };

            return (
              <motion.div variants={itemVariants} key={exp.id} className="relative pl-8 sm:pl-12">
                {/* Timeline Dot */}
                <div className={`absolute left-[-5px] sm:left-[-5px] top-6 w-3 h-3 rounded-full shadow-lg ${getDotColor(exp.color)}`} />

                <SpotlightCard spotlightColor={getSpotlightColor(exp.color)}>
                  <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                      <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full w-fit">
                        {exp.date}
                      </span>
                    </div>
                    <div className={`text-base font-medium mb-3 text-${exp.color}-600 dark:text-${exp.color}-400`}>
                      {exp.company}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                      {exp.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
