export interface Project {
  id: string;
  title: string;
  description?: string;
  github_url?: string;
  languages: string[];
  tags: string[];
  stars: number;
  forks: number;
  created_at?: string;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  platform: 'MEDIUM' | 'DEV_TO';
  summary?: string;
  published_at?: string;
  reading_time_minutes?: number;
}

export interface Experience {
  id: string;
  title: string;
  company_name: string;
  start_date: string;
  end_date?: string;
  description?: string;
  skills: string[];
}

export interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  credential_url?: string;
  credential_id?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
  description?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  tags?: string[];
  date?: string;
}

export interface GlobalSearchResponse {
  query: string;
  projects: SearchResultItem[];
  articles: SearchResultItem[];
  experiences: SearchResultItem[];
  certificates: SearchResultItem[];
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  module: string;
  message: string;
  user_id?: string;
  request_id?: string;
  ip_address?: string;
  endpoint?: string;
  details?: Record<string, any>;
  created_at: string;
}
