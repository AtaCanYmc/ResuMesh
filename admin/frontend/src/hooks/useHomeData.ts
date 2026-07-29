import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface ContentConfig {
  hero: {
    name: string;
    title: string;
    description: string;
    resumeLink: string;
  };
  socials: SocialLinkItem[];
  metrics: {
    id: number;
    icon: string;
    value: string;
    label: string;
    color: string;
  }[];
  marquee: string[];
  footer: {
    email: string;
    aboutTitle: string;
    aboutText: string;
  };
}

import contentData from '../config/content.json';
import publicSettings from '../config/publicSettings.json';

export const useAppSettings = () => {
  return {
    data: publicSettings as Record<string, any>,
    isLoading: false,
    isSuccess: true,
  };
};

export const useContentConfig = (lang: string = 'tr') => {
  const shortLang = lang.split('-')[0].toLowerCase();
  const langData =
    (contentData as any)[shortLang] ||
    (contentData as any)[lang] ||
    (contentData as any)['en'];

  const data: ContentConfig = {
    ...langData,
    socials: (contentData as any).socials || [],
    footer: (contentData as any).footer || {},
    marquee: (contentData as any).marquee || [],
  };

  return {
    data,
    isLoading: false,
    isSuccess: true,
  };
};

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/experiences/`);
      return response.data;
    },
  });
};
