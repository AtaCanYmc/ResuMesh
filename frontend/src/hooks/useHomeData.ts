import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ENV } from '../config/env';
import contentData from '../config/content.json';
import publicSettings from '../config/publicSettings.json';

const API_URL = ENV.API_URL;

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

export const useSocialLinks = () => {
  return useQuery<SocialLinkItem[]>({
    queryKey: ['social-links'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/social-links/`, {
          params: { active_only: true },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          return response.data;
        }
      } catch (err) {
        console.warn('Failed to fetch social links from API, using default content', err);
      }
      return (contentData as any).socials || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useContentConfig = (lang: string = 'tr') => {
  const { data: dynamicSocials, isLoading: isSocialsLoading } = useSocialLinks();
  const shortLang = lang.split('-')[0].toLowerCase();
  const langData =
    (contentData as any)[shortLang] ||
    (contentData as any)[lang] ||
    (contentData as any)['en'];

  const data: ContentConfig = {
    ...langData,
    socials:
      dynamicSocials && dynamicSocials.length > 0
        ? dynamicSocials
        : (contentData as any).socials || [],
    footer: (contentData as any).footer || {},
    marquee: (contentData as any).marquee || [],
  };

  return {
    data,
    isLoading: isSocialsLoading,
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

export const useEducations = () => {
  return useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/educations/`);
      return response.data;
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/skills/`);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

export const useProjects = (limit?: number) => {
  return useQuery({
    queryKey: ['projects', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/projects/`, {
        params: limit ? { limit } : undefined,
      });
      const data = Array.isArray(response.data) ? response.data : [];
      return limit ? data.slice(0, limit) : data;
    },
  });
};

export const useArticles = (limit?: number) => {
  return useQuery({
    queryKey: ['articles', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/articles/`, {
        params: limit ? { limit } : undefined,
      });
      const data = Array.isArray(response.data) ? response.data : [];
      return limit ? data.slice(0, limit) : data;
    },
  });
};

export interface AppSettings {
  show_projects: boolean;
  show_certificates: boolean;
  show_videos: boolean;
  show_experiences: boolean;
}

export const useAppSettings = () => {
  return {
    data: publicSettings as AppSettings,
    isLoading: false,
    isSuccess: true,
  };
};
