import React from 'react';
import { Mail, Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContentConfig } from '../hooks/useHomeData';
import { getIcon } from '../utils/iconResolver';

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: config } = useContentConfig(i18n.language);

  if (!config) return null;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40 pt-16 pb-8 mt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                ResuMesh
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              <strong className="block mb-2 text-gray-800 dark:text-gray-200">{config.footer.aboutTitle}</strong>
              {config.footer.aboutText}
            </p>
          </div>

          {/* Connect Section */}
          <div className="md:text-right">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Connect
            </h3>
            <div className="flex flex-col md:items-end gap-4">
              <a
                href={`mailto:${config.footer.email}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit"
              >
                <Mail size={18} />
                <span>{config.footer.email}</span>
              </a>

              <div className="flex items-center gap-4 mt-2">
                {config.socials.map((social) => {
                  const Icon = getIcon(social.icon || social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} {config.hero.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 mt-2 md:mt-0">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> by {config.hero.name}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
