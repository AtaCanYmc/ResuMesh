import { useQuery } from '@tanstack/react-query';
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
}

export const useContentConfig = (lang: string = 'tr') => {
  return useQuery<ContentConfig>({
    queryKey: ['contentConfig', lang],
    queryFn: async () => {
      const response = await axios.get('/content.json');
      return response.data[lang] || response.data['en'];
    },
    staleTime: Infinity,
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

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/projects/`);
      return response.data;
    },
  });
};

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/articles/`);
      return response.data;
    },
  });
};
