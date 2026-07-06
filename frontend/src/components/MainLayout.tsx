import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { User, Briefcase, FolderGit, BookOpen, Award, Settings, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from './SearchBar';

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Hakkımda', icon: <User size={20} aria-hidden="true" /> },
    { path: '/experiences', label: 'Deneyimler', icon: <Briefcase size={20} aria-hidden="true" /> },
    { path: '/projects', label: 'Projeler', icon: <FolderGit size={20} aria-hidden="true" /> },
    { path: '/articles', label: 'Makaleler', icon: <BookOpen size={20} aria-hidden="true" /> },
    { path: '/certificates', label: 'Sertifikalar', icon: <Award size={20} aria-hidden="true" /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">
          ResuMesh
        </h1>
        {/* Mobile close button inside drawer */}
        <button
          onClick={closeMobileMenu}
          className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1"
          aria-label="Menüyü Kapat"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-600/30'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white overflow-hidden transition-colors duration-300">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center flex-1 min-w-0">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md p-1"
              aria-label="Menüyü Aç"
            >
              <Menu size={24} aria-hidden="true" />
            </button>

            {/* Search Bar Container */}
            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>
          </div>

          <div className="ml-4 flex items-center flex-shrink-0">
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors text-sm font-medium px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Admin Girişi"
              title="Admin Girişi"
            >
              <Settings size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content with Animations */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <div className="max-w-6xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
