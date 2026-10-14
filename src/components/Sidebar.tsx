// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Image,
  BookOpen,
  MessageCircle,
  Crown,
  Newspaper,
  Calendar,
  Church,
  X,
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/sms', label: 'Bulk SMS', icon: MessageSquare },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/books', label: 'Books', icon: BookOpen },
  // { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/leadership', label: 'Leadership', icon: Crown },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/ministries', label: 'Ministries', icon: Church },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-secondary text-white
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header — fixed */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-primary">Bahi SDA</h1>
            <p className="text-xs text-gray-400">Church System</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-700 rounded"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation — scrolls */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-slate-700'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — fixed */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            © 2026 Bahi SDA Church
          </p>
        </div>
      </aside>
    </>
  );
}