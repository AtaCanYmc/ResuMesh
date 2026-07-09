import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/home/HeroSection';
import QuickMetrics from '../components/home/QuickMetrics';
import FeaturedProjects from '../components/home/FeaturedProjects';
import CareerTimeline from '../components/home/CareerTimeline';
import RecentArticles from '../components/home/RecentArticles';
import SEO from '../components/SEO';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';
import { useContentConfig } from '../hooks/useHomeData';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: config } = useContentConfig(i18n.language);

  return (
    <>
      <SEO
        title={config?.hero.name ? `${config.hero.name} | Portfolio` : "Portfolio"}
        description={config?.hero.description || "Portfolio"}
      />
      <motion.div
        className="flex flex-col gap-12 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />

        {config && (
          <div className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-black/20 backdrop-blur-sm -mx-4 sm:-mx-8 px-4 sm:px-8 overflow-hidden">
            <InfiniteMarquee
              items={config.marquee.map((tech: string) => (
                <span key={tech} className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                  {tech}
                </span>
              ))}
              speed="normal"
            />
          </div>
        )}

        <QuickMetrics />
        <CareerTimeline />
        <FeaturedProjects />
        <RecentArticles />
      </motion.div>
    </>
  );
};

export default Home;
