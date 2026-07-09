import { Code, BookOpen, Star, Github, Linkedin, Twitter } from 'lucide-react';
import React from 'react';

export const HERO_DATA = {
  name: "Ata Can",
  title: "I bridge the gap between AI Workflows and Financial Technologies.",
  description: "Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum. Modern web teknolojileriyle karmaşık verileri anlamlı içgörülere dönüştürüyorum.",
  resumeLink: "/resume.pdf",
};

export const SOCIAL_LINKS = [
  { id: 'github', icon: Github, url: 'https://github.com/atacan', label: 'GitHub' },
  { id: 'linkedin', icon: Linkedin, url: 'https://linkedin.com/in/atacanyucel', label: 'LinkedIn' },
  { id: 'twitter', icon: Twitter, url: 'https://twitter.com/atacanyucel', label: 'Twitter' },
];

export const METRICS_DATA = [
  {
    id: 1,
    icon: Code,
    value: "15+",
    label: "Active Projects",
    color: "blue",
  },
  {
    id: 2,
    icon: BookOpen,
    value: "12+",
    label: "Technical Articles",
    color: "indigo",
  },
  {
    id: 3,
    icon: Star,
    value: "5+",
    label: "Years Experience",
    color: "purple",
  },
];

export const FEATURED_PROJECTS = [
  {
    id: 'lumina',
    title: "Lumina",
    description: "Açık kaynak ekosistemi için geliştirilmiş modüler veri analizi aracı.",
    url: "https://github.com/atacan/lumina",
    color: "blue",
  },
  {
    id: 'cukurvar',
    title: "ÇukurVar",
    description: "Sivil teknoloji alanında kentsel sorunları raporlama platformu.",
    url: "https://github.com/atacan/cukurvar",
    color: "indigo",
  },
  {
    id: 'sentinelcell',
    title: "SentinelCell",
    description: "Gelişmiş yapay zeka entegrasyonları için middleware (ara katman).",
    url: "https://github.com/atacan/sentinelcell",
    color: "purple",
  },
];

export const EXPERIENCES_DATA = [
  {
    id: 1,
    company: "TechNova Solutions",
    role: "Senior Software Engineer",
    date: "2023 - Present",
    description: "Leading the AI integration team, architecting scalable backend solutions using Python and FastAPI, and mentoring junior developers.",
    color: "blue"
  },
  {
    id: 2,
    company: "FinTech Dynamics",
    role: "Backend Developer",
    date: "2021 - 2023",
    description: "Developed high-performance trading APIs, managed PostgreSQL databases, and optimized microservices in a cloud-native environment.",
    color: "indigo"
  },
  {
    id: 3,
    company: "WebCraft Agency",
    role: "Full Stack Developer",
    date: "2019 - 2021",
    description: "Built responsive React frontend applications and Node.js backends for various e-commerce clients.",
    color: "purple"
  }
];

export const ARTICLES_DATA = [
  {
    id: 1,
    title: "Mastering React 19 and Framer Motion",
    description: "A deep dive into creating fluid user experiences with the latest features of React 19 and Framer Motion's physics engine.",
    url: "#",
    platform: "Medium",
    date: "Oct 12, 2023",
    color: "blue"
  },
  {
    id: 2,
    title: "Building Scalable Microservices with FastAPI",
    description: "Learn how to architect and deploy highly scalable microservices using Python's fastest web framework.",
    url: "#",
    platform: "Dev.to",
    date: "Aug 05, 2023",
    color: "indigo"
  },
  {
    id: 3,
    title: "AI Workflows in FinTech",
    description: "Exploring the intersection of artificial intelligence and financial technologies: challenges and opportunities.",
    url: "#",
    platform: "Medium",
    date: "Jun 22, 2023",
    color: "purple"
  }
];
