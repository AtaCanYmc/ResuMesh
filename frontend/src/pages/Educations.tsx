import React, { useState, useEffect } from 'react';
import { Education } from '../types';
import axios from 'axios';
import { Loader2, GraduationCap } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { ENV } from '../config/env';

import { TimelineSkeleton } from '../components/ui/Skeletons';

export default function Educations() {
  const { t } = useTranslation();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const res = await axios.get<Education[]>(`${ENV.API_URL}/api/v1/educations/`);
        setEducations(res.data);
      } catch (error) {
        console.error('Failed to fetch educations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  if (loading) {
    return <TimelineSkeleton />;
  }

  return (
    <>
    <SEO
      title={`${t('educations.title')} | ResuMesh`}
      description={t('educations.subtitle')}
    />
    <div className="py-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">{t('educations.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('educations.subtitle')}</p>
      </div>

      <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 md:ml-6 space-y-12">
        {educations.length === 0 && (
          <div className="text-gray-500 pl-8">{t('educations.emptyDesc')}</div>
        )}
        {educations.map((edu) => (
          <div key={edu.id} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <GraduationCap size={12} className="text-blue-500 group-hover:text-white" />
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{edu.school}</h3>
                  <h4 className="text-md text-blue-600 dark:text-blue-400 font-medium">{edu.degree} - {edu.field_of_study}</h4>
                </div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-500 mt-2 md:mt-0 bg-gray-100 dark:bg-black px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 inline-block">
                  {edu.start_date} - {edu.end_date || 'Present'}
                </div>
              </div>

              {edu.grade && (
                <div className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="opacity-70">Grade/GPA: </span> {edu.grade}
                </div>
              )}

              {edu.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
