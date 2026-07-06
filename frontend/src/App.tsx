import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';

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

// Create browser router with error boundaries
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: (
      <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white items-center justify-center p-8">
        <ErrorBoundary />
      </div>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/experiences', element: <Experiences /> },
      { path: '/projects', element: <Projects /> },
      { path: '/articles', element: <Articles /> },
      { path: '/certificates', element: <Certificates /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white border dark:border-gray-700',
              style: {
                background: 'var(--toast-bg, #333)',
                color: 'var(--toast-color, #fff)',
              },
            }}
          />
          {/* Suspense is moved to MainLayout so layout stays intact during page loads */}
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
