import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/members': 'Wanachama',
  '/sms': 'Tuma SMS',
  '/gallery': 'Picha',
  '/books': 'Vitabu',
  '/chat': 'Mazungumzo',
  '/leadership': 'Uongozi',
  '/news': 'Habari',
  '/calendar': 'Kalenda',
  '/ministries': 'Huduma',
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setIsSidebarOpen(true)}
          title={title}
        />

        {/* Page content - inascroll yenyewe */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}