import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_PATH = path.resolve(__dirname, '../src/config/publicSettings.json');
const CONTENT_PATH = path.resolve(__dirname, '../src/config/content.json');
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';

async function fetchSettings() {
  console.log(`[ResuMesh Build] Fetching settings from ${API_URL}/api/v1/settings/ ...`);
  try {
    const response = await fetch(`${API_URL}/api/v1/settings/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // 1. Save Visibility Settings
    const settings = {
      show_projects: data.show_projects !== false,
      show_certificates: data.show_certificates !== false,
      show_videos: data.show_videos !== false,
      show_experiences: data.show_experiences !== false
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    console.log('[ResuMesh Build] Successfully injected settings to publicSettings.json');

    // 2. Save Content Settings
    if (data.socials && data.footer && data.marquee && data.en && data.tr) {
      const content = {
        socials: data.socials,
        footer: data.footer,
        marquee: data.marquee,
        en: data.en,
        tr: data.tr
      };
      fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2));
      console.log('[ResuMesh Build] Successfully injected content config to content.json');
    } else {
      console.log('[ResuMesh Build] Content data was missing or incomplete in database, keeping existing content.json');
    }
  } catch (error) {
    console.warn('[ResuMesh Build] Warning: Failed to fetch settings/content from API, using defaults.', error.message);

    // Ensure both files exist
    if (!fs.existsSync(SETTINGS_PATH)) {
      const defaultSettings = {
        show_projects: true,
        show_certificates: true,
        show_videos: true,
        show_experiences: true
      };
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2));
    }

    if (!fs.existsSync(CONTENT_PATH)) {
      console.warn('[ResuMesh Build] Warning: content.json is missing, please ensure frontend/src/config/content.json is present.');
    }
  }
}

fetchSettings();
