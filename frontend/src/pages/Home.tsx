import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import QuickMetrics from '../components/home/QuickMetrics';
import FeaturedProjects from '../components/home/FeaturedProjects';
import CareerTimeline from '../components/home/CareerTimeline';
import RecentArticles from '../components/home/RecentArticles';
import SEO from '../components/SEO';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';

const TECH_STACK = [
  'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
  'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS',
  'Node.js', 'Next.js', 'GraphQL'
];

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
  return (
    <>
      <SEO
        title="Ata Can | AI & FinTech Developer"
        description="Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum."
      />
      <motion.div
        className="flex flex-col gap-12 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />

        <div className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-black/20 backdrop-blur-sm -mx-4 sm:-mx-8 px-4 sm:px-8 overflow-hidden">
          <InfiniteMarquee
            items={TECH_STACK.map(tech => (
              <span className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                {tech}
              </span>
            ))}
            speed="normal"
          />
        </div>

        <QuickMetrics />
        <CareerTimeline />
        <FeaturedProjects />
        <RecentArticles />
      </motion.div>
    </>
  );
};

export default Home;
