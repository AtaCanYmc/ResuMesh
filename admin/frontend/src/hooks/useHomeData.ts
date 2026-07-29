import { useQuery, keepPreviousData } from '@tanstack/react-query';
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

export const useAppSettings = () => {
  return useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/settings/`);
        return response.data;
      } catch (err) {
        console.warn('Failed to fetch settings from API', err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useContentConfig = (lang: string = 'tr') => {
  const { data: apiSettings } = useAppSettings();

  return useQuery<ContentConfig>({
    queryKey: ['contentConfig', lang, apiSettings],
    queryFn: async () => {
      const response = await axios.get('/content.json');
      const shortLang = lang.split('-')[0].toLowerCase();
      const langData =
        response.data[shortLang] || response.data[lang] || response.data['en'];
      const defaultSocials = response.data.socials || [];

      const socials =
        apiSettings?.socials &&
        Array.isArray(apiSettings.socials) &&
        apiSettings.socials.length > 0
          ? apiSettings.socials
          : defaultSocials;

      return {
        ...langData,
        socials,
        footer: apiSettings?.footer || response.data.footer || {},
        marquee: apiSettings?.marquee || response.data.marquee || [],
      };
    },
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
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
