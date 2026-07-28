import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Eye, Globe, Share2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
}

interface HeroConfig {
  name: string;
  fullName: string;
  avatarSubtitle: string;
  avatarImage: string;
  title: string;
  description: string;
  resumeLink: string;
}

interface MetricItem {
  id: number;
  icon: string;
  value: string;
  label: string;
  color: string;
}

interface LanguageContent {
  hero: HeroConfig;
  metrics: MetricItem[];
}

interface AppSettings {
  show_projects: boolean;
  show_certificates: boolean;
  show_videos: boolean;
  show_experiences: boolean;
  socials: SocialLink[];
  footer: { email: string };
  marquee: string[];
  en: LanguageContent;
  tr: LanguageContent;
}

const ToggleSwitch = ({ label, description, isChecked, onChange }: { label: string; description: string; isChecked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
    <div className="space-y-1">
      <span className="text-sm font-semibold text-gray-900 dark:text-white block">{label}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 block">{description}</span>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`${
        isChecked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0`}
    >
      <span
        className={`${
          isChecked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  </div>
);

export default function AdminAppSettings() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8001';

  const [activeTab, setActiveTab] = useState<'visibility' | 'socials' | 'content_en' | 'content_tr'>('visibility');
  const [formData, setFormData] = useState<AppSettings | null>(null);

  const { data: settings, isLoading } = useQuery<AppSettings>({
    queryKey: ['admin-app-settings'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/v1/settings/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings))); // deep copy
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: AppSettings) => {
      const res = await axios.patch(`${API_URL}/api/v1/settings/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-app-settings'], data);
      toast.success('Settings updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update settings.');
    }
  });

  if (isLoading || !formData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-300 dark:bg-gray-800 rounded"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const updateVisibility = (key: keyof AppSettings) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const updateSocialUrl = (index: number, url: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newSocials = [...prev.socials];
      newSocials[index].url = url;
      return { ...prev, socials: newSocials };
    });
  };

  const handleHeroChange = (lang: 'en' | 'tr', field: keyof HeroConfig, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const langContent = { ...prev[lang] };
      langContent.hero = { ...langContent.hero, [field]: value };
      return { ...prev, [lang]: langContent };
    });
  };

  const handleMetricChange = (lang: 'en' | 'tr', index: number, field: keyof MetricItem, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const langContent = { ...prev[lang] };
      const newMetrics = [...langContent.metrics];
      newMetrics[index] = { ...newMetrics[index], [field]: value };
      langContent.metrics = newMetrics;
      return { ...prev, [lang]: langContent };
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminPageHeader
          title="App Settings"
          description="Configure your portfolio visibility, text configs, and social links."
        />
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-colors duration-200 disabled:opacity-50 shrink-0 self-start sm:self-center"
        >
          <Check size={16} />
          {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('visibility')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
            activeTab === 'visibility'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>General & Visibility</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('socials')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
            activeTab === 'socials'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Share2 size={16} />
            <span>Social Links</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('content_en')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
            activeTab === 'content_en'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>English Content</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('content_tr')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
            activeTab === 'content_tr'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>Turkish Content</span>
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden p-6">

        {/* Tab 1: Visibility & General */}
        {activeTab === 'visibility' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Module Visibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleSwitch
                  label="Projects Section"
                  description="Show or hide your projects page on the public site."
                  isChecked={formData.show_projects}
                  onChange={() => updateVisibility('show_projects')}
                />
                <ToggleSwitch
                  label="Certificates Section"
                  description="Show or hide your certificates page on the public site."
                  isChecked={formData.show_certificates}
                  onChange={() => updateVisibility('show_certificates')}
                />
                <ToggleSwitch
                  label="Videos Section"
                  description="Show or hide your videos page on the public site."
                  isChecked={formData.show_videos}
                  onChange={() => updateVisibility('show_videos')}
                />
                <ToggleSwitch
                  label="Experiences Section"
                  description="Show or hide your experiences page on the public site."
                  isChecked={formData.show_experiences}
                  onChange={() => updateVisibility('show_experiences')}
                />
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Global Footer</h3>
              <div className="max-w-xl">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.footer?.email || ''}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, footer: { email: e.target.value } } : null)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Marquee Skills</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Skills List (comma separated)</label>
                <textarea
                  value={formData.marquee?.join(', ') || ''}
                  onChange={(e) => setFormData((prev) => prev ? { ...prev, marquee: e.target.value.split(',').map((s) => s.trim()) } : null)}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Links */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Social Media Accounts</h3>
            <div className="space-y-4 max-w-2xl">
              {formData.socials?.map((social, index) => (
                <div key={social.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white block">{social.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">Configure URL link for {social.platform}.</span>
                  </div>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocialUrl(index, e.target.value)}
                    placeholder="https://..."
                    className="w-full sm:w-2/3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3 & 4: Localized Hero Content */}
        {(activeTab === 'content_en' || activeTab === 'content_tr') && (() => {
          const lang = activeTab === 'content_en' ? 'en' : 'tr';
          const content = formData[lang];
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Hero Information ({lang.toUpperCase()})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                    <input
                      type="text"
                      value={content.hero.name}
                      onChange={(e) => handleHeroChange(lang, 'name', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={content.hero.fullName}
                      onChange={(e) => handleHeroChange(lang, 'fullName', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Avatar Subtitle</label>
                    <input
                      type="text"
                      value={content.hero.avatarSubtitle}
                      onChange={(e) => handleHeroChange(lang, 'avatarSubtitle', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Avatar Image Path</label>
                    <input
                      type="text"
                      value={content.hero.avatarImage}
                      onChange={(e) => handleHeroChange(lang, 'avatarImage', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Resume Download Link</label>
                    <input
                      type="text"
                      value={content.hero.resumeLink}
                      onChange={(e) => handleHeroChange(lang, 'resumeLink', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Title / Catchphrase</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => handleHeroChange(lang, 'title', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Description Biography</label>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => handleHeroChange(lang, 'description', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-800" />

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Metrics Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {content.metrics.map((metric, index) => (
                    <div key={metric.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Metric #{metric.id}</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Value (e.g. 25+)</label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => handleMetricChange(lang, index, 'value', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Label Description</label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => handleMetricChange(lang, index, 'label', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
