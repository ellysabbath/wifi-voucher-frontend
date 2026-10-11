import { Menu, Bell, LogOut, User, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Topbar({ onMenuClick, title = 'Dashboard' }: TopbarProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Fungua menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <img
                src="https://i.pravatar.cc/150?u=admin"
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-primary"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-sm">Msimamizi</p>
                  <p className="text-xs text-gray-500">admin@bahisda.org</p>
                </div>

                <button
                  onClick={() => handleNavigate('/profile')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition"
                >
                  <User size={16} className="text-gray-500" />
                  Wasifu Wangu
                </button>

                <button
                  onClick={() => handleNavigate('/settings')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition"
                >
                  <Settings size={16} className="text-gray-500" />
                  Mipangilio
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={() => handleNavigate('/login')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-left text-red-600 transition"
                >
                  <LogOut size={16} />
                  Toka
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}