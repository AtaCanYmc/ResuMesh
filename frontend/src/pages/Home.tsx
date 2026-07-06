import React, { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import QuickMetrics from '../components/home/QuickMetrics';
import FeaturedProjects from '../components/home/FeaturedProjects';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger effect: cascading fall
    },
  },
};

const Home: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between h-full py-8 xl:py-12 gap-12">

      {/* Left: Bio, CTA & Metrics orchestrated by framer-motion stagger */}
      <motion.div
        className="flex-1 space-y-8 w-full max-w-3xl xl:max-w-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />
        <QuickMetrics />
        <FeaturedProjects />
      </motion.div>

      {/* Right: Avatar Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 relative shrink-0"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
        <div className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">

           {/* Image Fallback Logic with CLS optimizations and Fade-in */}
           {!imageError ? (
             <img
               src="/images/profile.jpg"
               alt="Ata Can Avatar"
               className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
               width={384}
               height={384}
               // @ts-ignore - React 19 supports fetchPriority but some TS definitions might lag
               fetchPriority="high"
               onLoad={() => setImageLoaded(true)}
               onError={() => setImageError(true)}
             />
           ) : (
             <div className="flex flex-col items-center justify-center">
               <User size={80} className="text-gray-400 dark:text-gray-700 mb-2" aria-hidden="true" />
               <span className="text-2xl font-bold text-gray-500 dark:text-gray-600">AC</span>
             </div>
           )}

        </div>
      </motion.div>
    </div>
  );
};

export default Home;
