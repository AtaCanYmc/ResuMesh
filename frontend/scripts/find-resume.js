import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumesDir = path.join(__dirname, '../public/resumes');
const configDir = path.join(__dirname, '../src/config');
const configFile = path.join(configDir, 'resume.json');

// Ensure config dir exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

let resumePath = '';

if (fs.existsSync(resumesDir)) {
  const files = fs.readdirSync(resumesDir);
  const pdfFile = files.find(file => file.endsWith('.pdf'));
  if (pdfFile) {
    resumePath = `/resumes/${pdfFile}`;
  }
}

const configData = {
  path: resumePath
};

fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
console.log(`[Resume Linker] Found resume at: ${resumePath || 'None (fallback to database link)'}`);
