import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/home/HeroSection';
import SEO from '../components/SEO';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';
import { useContentConfig, useAppSettings } from '../hooks/useHomeData';

const QuickMetrics = lazy(() => import('../components/home/QuickMetrics'));
const FeaturedProjects = lazy(() => import('../components/home/FeaturedProjects'));
const Timeline = lazy(() => import('../components/home/Timeline'));
const RecentArticles = lazy(() => import('../components/home/RecentArticles'));
const SkillsMarquee = lazy(() => import('../components/home/SkillsMarquee'));
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
  const { data: settings } = useAppSettings();

  return (
    <>
      <SEO
        title={config?.hero.name ? `${config.hero.name} | Portfolio` : "Portfolio"}
        description={config?.hero.description || "Portfolio"}
      />
      <motion.div
        className="flex flex-col gap-24 md:gap-32 pb-24"
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

        <Suspense fallback={<div className="h-40 flex items-center justify-center opacity-50">Yükleniyor...</div>}>
          <QuickMetrics />
          {settings?.show_experiences !== false && <Timeline />}
          <SkillsMarquee />
          {settings?.show_projects !== false && <FeaturedProjects />}
          <RecentArticles />
        </Suspense>
      </motion.div>
    </>
  );
};

export default Home;
