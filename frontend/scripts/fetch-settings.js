import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_PATH = path.resolve(__dirname, '../src/config/publicSettings.json');
const CONTENT_PATH = path.resolve(__dirname, '../src/config/content.json');
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';

async function fetchSettings() {
  console.log(`[ResuMesh Build] Syncing settings from ${API_URL}/api/v1/settings/ ...`);
  try {
    const response = await fetch(`${API_URL}/api/v1/settings/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // 1. Save Visibility Settings & Sections Map
    const sectionsMap =
      typeof data.sections === 'object' && data.sections !== null
        ? data.sections
        : {};
    const settings = {
      show_projects: sectionsMap.projects !== false,
      show_certificates: sectionsMap.certificates !== false,
      show_videos: sectionsMap.videos !== false,
      show_experiences: sectionsMap.experiences !== false,
      show_educations: sectionsMap.educations !== false,
      show_articles: sectionsMap.articles !== false,
      show_skills: sectionsMap.skills !== false,
      show_posts: sectionsMap.posts !== false,
      sections: sectionsMap,
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    console.log(
      '[ResuMesh Build] Successfully synced sections to publicSettings.json'
    );

    // 2. Save Content & Social Links Settings
    if (data.socials || data.footer || data.marquee || data.en || data.tr) {
      let existingContent = {};
      if (fs.existsSync(CONTENT_PATH)) {
        try {
          existingContent = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
        } catch (e) {}
      }

      const content = {
        ...existingContent,
        socials: data.socials || existingContent.socials || [],
        sections: sectionsMap,
        footer: data.footer || existingContent.footer || {},
        marquee: data.marquee || existingContent.marquee || [],
        en: data.en || existingContent.en || {},
        tr: data.tr || existingContent.tr || {},
      };
      fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2));
      console.log(
        '[ResuMesh Build] Successfully synced social_links & content to content.json'
      );
    }
  } catch (error) {
    console.warn(
      '[ResuMesh Build] Warning: Failed to fetch settings from API during build, keeping existing static JSON configs.',
      error.message
    );
  }
}

fetchSettings();
