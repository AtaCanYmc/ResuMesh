import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEnv } from './useEnv';
import contentData from '../config/content.json';
import publicSettings from '../config/publicSettings.json';
import { ContentConfig } from '../types';

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
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/experiences/`);
      return response.data;
    },
  });
};

export const useEducations = () => {
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/educations/`);
      return response.data;
    },
  });
};

export const useSkills = () => {
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/skills/`);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

export const useProjects = (limit?: number) => {
  const { API_URL } = useEnv();
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
  const { API_URL } = useEnv();
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

export const usePackages = () => {
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/packages/`);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

export const useVideos = () => {
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/videos/`);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

export const usePosts = () => {
  const { API_URL } = useEnv();
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/posts/`);
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};


