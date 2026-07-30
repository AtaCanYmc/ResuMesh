export interface Project {
  id: string;
  name: string;
  title?: string;
  description?: string;
  url?: string;
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
  platform: string;
  summary?: string;
  published_at?: string;
  reading_time_minutes?: number;
}

export interface Experience {
  id: string;
  title: string;
  company_name: string;
  location?: string;
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

export interface Log {
  id: string;
  level: string;
  message: string;
  module?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name?: string;
  created_at: string;
  updated_at: string;
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

export interface Package {
  id: string;
  title: string;
  description?: string;
  platform: string;
  url?: string;
  docs_url?: string;
  tags?: string;
  version?: string;
  last_month_downloads?: number;
}

export interface Post {
  id: string;
  title: string;
  description?: string;
  platform: string;
  url?: string;
  thumbnail?: string;
  profile?: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  platform: string;
  url: string;
  thumbnail?: string;
  profile: string;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface HeroItem {
    name: string;
    title: string;
    description: string;
    resumeLink: string;
}

export interface MetricItem {
    id: number;
    icon: string;
    value: string;
    label: string;
    color: string;
}

export interface ContentConfig {
  hero: HeroItem;
  socials: SocialLinkItem[];
  metrics: MetricItem[];
  marquee: string[];
  footer: {
    email: string;
    aboutTitle: string;
    aboutText: string;
  };
}
