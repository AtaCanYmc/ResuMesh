import React, { useState, useEffect } from 'react';
import { Experience } from '../types';
import axios from 'axios';
import { Loader2, Briefcase } from 'lucide-react';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSettings } from '../hooks/useHomeData';
import { useEnv } from '../hooks/useEnv';

import { TimelineSkeleton } from '../components/ui/Skeletons';

export default function Experiences() {
  const { API_URL } = useEnv();
  const { data: settings } = useAppSettings();
  const { t } = useTranslation();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get<Experience[]>(`${API_URL}/api/v1/experiences/`);
        setExperiences(res.data);
      } catch (error) {
        console.error('Failed to fetch experiences', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (settings && settings.show_experiences === false) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <TimelineSkeleton />;
  }

  return (
    <>
    <SEO
      title={`${t('experiences.title')} | ResuMesh`}
      description={t('experiences.subtitle')}
    />
    <div className="py-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">{t('experiences.title')}</h1>
        <p className="text-gray-400">{t('experiences.subtitle')}</p>
      </div>

      <div className="relative border-l border-gray-800 ml-3 md:ml-6 space-y-12">
        {experiences.length === 0 && (
          <div className="text-gray-500 pl-8">{t('experiences.emptyDesc')}</div>
        )}
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute -left-3.5 top-1.5 w-7 h-7 bg-gray-900 border-2 border-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Briefcase size={12} className="text-blue-500 group-hover:text-white" />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-100">{exp.title}</h3>
                  <h4 className="text-md text-blue-400 font-medium">{exp.company_name}</h4>
                </div>
                <div className="text-sm font-mono text-gray-500 mt-2 md:mt-0 bg-black px-3 py-1 rounded-full border border-gray-800 inline-block">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                {exp.description}
              </p>

              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-md border border-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
