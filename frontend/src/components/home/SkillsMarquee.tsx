import React from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteMarquee from '../ui/InfiniteMarquee';
import { useSkills } from '../../hooks/useHomeData';
import { Skill } from '../../types';

export default function SkillsMarquee() {
  const { t } = useTranslation();
  const { data: skills, isLoading } = useSkills();

  if (isLoading || !skills || skills.length === 0) {
    return null;
  }

  // Split skills into two rows for the dual-directional marquee
  const midPoint = Math.ceil(skills.length / 2);
  const topRowSkills = skills.slice(0, midPoint);
  const bottomRowSkills = skills.slice(midPoint);

  const renderSkillBadge = (skill: Skill) => (
    <div
      key={skill.id}
      className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-default group"
    >
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
        {skill.category}
      </span>
      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
      <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
        {skill.name}
      </span>
    </div>
  );

  return (
    <div className="py-12 -mx-4 sm:-mx-8 overflow-hidden relative">
      <div className="mb-8 px-4 sm:px-8 flex justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('home.skills')}
        </h2>
      </div>

      <div className="relative flex flex-col gap-6">
        {/* Left and Right Gradients for smooth fade out */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none" />

        {/* Top Row - Scrolls Left */}
        {topRowSkills.length > 0 && (
          <InfiniteMarquee
            items={topRowSkills.map(renderSkillBadge)}
            speed="slow"
            direction="left"
            className="py-2"
          />
        )}

        {/* Bottom Row - Scrolls Right */}
        {bottomRowSkills.length > 0 && (
          <InfiniteMarquee
            items={bottomRowSkills.map(renderSkillBadge)}
            speed="slow"
            direction="right"
            className="py-2"
          />
        )}
      </div>
    </div>
  );
}
