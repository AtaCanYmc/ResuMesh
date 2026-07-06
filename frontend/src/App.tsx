import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PageLoader from './components/PageLoader';

// Lazy loading pages for Code Splitting
const Home = React.lazy(() => import('./pages/Home'));
const Experiences = React.lazy(() => import('./pages/Experiences'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Articles = React.lazy(() => import('./pages/Articles'));
const Certificates = React.lazy(() => import('./pages/Certificates'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
