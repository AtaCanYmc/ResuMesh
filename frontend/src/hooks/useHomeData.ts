import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {ENV} from '../config/env';
import contentData from '../config/content.json';
import publicSettings from '../config/publicSettings.json';
import {ContentConfig} from "../types";

const API_URL = ENV.API_URL;

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
