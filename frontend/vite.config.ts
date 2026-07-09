import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/sitemap.xml': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: () => '/api/v1/seo/sitemap.xml'
      },
      '/robots.txt': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: () => '/api/v1/seo/robots.txt'
      }
    }
  }
})
