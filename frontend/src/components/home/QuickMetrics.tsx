import React from 'react';
import { motion } from 'framer-motion';
import { METRICS_DATA } from '../../data/home';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const QuickMetrics: React.FC = () => {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {METRICS_DATA.map((metric) => {
        const Icon = metric.icon;

        // Tailwind class generators for dynamic colors (needed for purgable CSS)
        const getBgClass = (color: string) => {
          switch(color) {
            case 'blue': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-500/50';
            case 'indigo': return 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/50';
            case 'purple': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-500/50';
            default: return 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500/50';
          }
        };

        const colorClasses = getBgClass(metric.color);
        const [bgClass, textClass, borderHoverClass] = colorClasses.split(' text-').map(s => s.startsWith('bg') ? s : 'text-' + s).join(' border-').split(' border-');

        // Simple mapping for hover borders
        const hoverBorder = metric.color === 'blue' ? 'hover:border-blue-300 dark:hover:border-blue-500/50' :
                            metric.color === 'indigo' ? 'hover:border-indigo-300 dark:hover:border-indigo-500/50' :
                            'hover:border-purple-300 dark:hover:border-purple-500/50';

        const iconBg = metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                       metric.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                       'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';

        return (
          <div key={metric.id} className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex items-center space-x-4 transition-colors shadow-sm ${hoverBorder}`}>
            <div className={`p-3 rounded-xl ${iconBg}`}>
              <Icon size={24} aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{metric.label}</div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default QuickMetrics;
