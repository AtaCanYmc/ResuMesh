import { useState } from 'react';
import posthog from 'posthog-js';
import { ENV } from '../config/env';

export const useDownloadResume = (fallbackLink?: string) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);

    const filename = ENV.CV_FILENAME;

    try {
      const apiUrl = ENV.API_URL;
      const downloadUrl = `${apiUrl}/api/v1/cv/${filename}`;

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      if (ENV.POSTHOG_API_KEY && ENV.MODE !== 'development') {
        posthog.capture('cv_download_clicked', {
          filename,
          fallback_used: false,
        });
      }
    } catch (error) {
      console.error('Supabase download failed, falling back to local file', error);
      // Fallback: download local PDF
      const a = document.createElement('a');
      a.href = `/resumes/${filename}` || fallbackLink || '#';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (ENV.POSTHOG_API_KEY && ENV.MODE !== 'development') {
        posthog.capture('cv_download_clicked', {
          filename,
          fallback_used: true,
          error: String(error),
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload };
};

export default useDownloadResume;
