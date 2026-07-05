import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { User, Briefcase, FolderGit, BookOpen, Award, Settings } from 'lucide-react';
import SearchBar from './SearchBar';

const MainLayout: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Hakkımda', icon: <User size={20} /> },
    { path: '/experiences', label: 'Deneyimler', icon: <Briefcase size={20} /> },
    { path: '/projects', label: 'Projeler', icon: <FolderGit size={20} /> },
    { path: '/articles', label: 'Makaleler', icon: <BookOpen size={20} /> },
    { path: '/certificates', label: 'Sertifikalar', icon: <Award size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            ResuMesh
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-black/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
          <div className="ml-4 flex items-center">
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-800"
              title="Admin Girişi"
            >
              <Settings size={18} />
              <span>Admin</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
