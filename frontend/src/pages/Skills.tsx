import React, { useState, useEffect } from 'react';
import { Skill } from '../types';
import axios from 'axios';
import { Loader2, Wand2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useEnv } from '../hooks/useEnv';

import { ListSkeleton } from '../components/ui/Skeletons';

export default function Skills() {
  const { API_URL } = useEnv();
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get<Skill[]>(`${API_URL}/api/v1/skills/`);
        setSkills(res.data);
      } catch (error) {
        console.error('Failed to fetch skills', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return <ListSkeleton />;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <>
    <SEO
      title={`${t('skills.title')} | ResuMesh`}
      description={t('skills.subtitle')}
    />
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">{t('skills.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('skills.subtitle')}</p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>{t('skills.emptyDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, catSkills]) => (
            <div key={category} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Wand2 size={16} />
                </span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {catSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 font-medium text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
