import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ContentConfig {
  hero: {
    name: string;
    title: string;
    description: string;
    resumeLink: string;
  };
  socials: {
    id: string;
    platform: string;
    url: string;
    label: string;
    icon?: string;
  }[];
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

export const useContentConfig = (lang: string = 'tr') => {
  return useQuery<ContentConfig>({
    queryKey: ['contentConfig', lang],
    queryFn: async () => {
      const response = await axios.get('/content.json');
      const shortLang = lang.split('-')[0].toLowerCase();
      const langData = response.data[shortLang] || response.data[lang] || response.data['en'];
      return {
        ...langData,
        socials: response.data.socials || [],
        footer: response.data.footer || {}
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
      return response.data;
    },
  });
};

export const useProjects = (limit?: number) => {
  return useQuery({
    queryKey: ['projects', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/projects/`, {
        params: limit ? { limit } : undefined
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
        params: limit ? { limit } : undefined
      });
      const data = Array.isArray(response.data) ? response.data : [];
      return limit ? data.slice(0, limit) : data;
    },
  });
};
