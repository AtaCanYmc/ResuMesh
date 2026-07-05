export interface Project {
  id: string;
  title: string;
  description?: string;
  github_url?: string;
  languages: string[];
  tags: string[];
  stars: number;
  forks: number;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  platform: 'medium' | 'devto';
  summary?: string;
  published_at?: string;
  read_time_minutes?: number;
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
