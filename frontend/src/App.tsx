import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy loading pages for Code Splitting
const Home = React.lazy(() => import('./pages/Home'));
const Experiences = React.lazy(() => import('./pages/Experiences'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Articles = React.lazy(() => import('./pages/Articles'));
const Certificates = React.lazy(() => import('./pages/Certificates'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
              <Routes>
                {/* Public Routes with Shared Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/experiences" element={<Experiences />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/certificates" element={<Certificates />} />
                </Route>

                {/* Isolated Auth Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
