import { Code, BookOpen, Star } from 'lucide-react';
import React from 'react';

export const HERO_DATA = {
  name: "Ata Can",
  title: "I bridge the gap between AI Workflows and Financial Technologies.",
  description: "Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği geçmişimle, ölçeklenebilir backend mimarileri ve otomasyon süreçleri üzerine çalışıyorum. Modern web teknolojileriyle karmaşık verileri anlamlı içgörülere dönüştürüyorum.",
  resumeLink: "/resume.pdf",
};

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
