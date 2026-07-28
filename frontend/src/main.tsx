import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { ENV } from './config/env'

if (ENV.POSTHOG_API_KEY && ENV.MODE !== 'development') {
  posthog.init(ENV.POSTHOG_API_KEY, {
    api_host: ENV.POSTHOG_HOST,
    autocapture: true,
    capture_pageview: true,
    persistence: 'localStorage',
    sanitize_properties: (properties) => {
      return properties;
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
