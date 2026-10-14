// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Image,
  BookOpen,
  Crown,
  Newspaper,
  Calendar,
  Church,
  X,
  Home,
  User as UserIcon,
  Settings,
  Feather,
  Images,
} from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { isStaffRole, isAtLeast, type UserRole } from "../lib/roles";

// =========================================================
// Navigation definitions
// =========================================================
type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Minimum role required to see this link. Omit = visible to all. */
  minRole?: UserRole;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "My Space",
    items: [
      { to: "/user/dashboard", label: "My Dashboard", icon: Home },
      { to: "/user/news", label: "My News", icon: Newspaper },
      { to: "/user/gallery", label: "Church Images", icon: Images },
      { to: "/user/writings", label: "Writings", icon: Feather },
      { to: "/user/calendar", label: "My Calendar", icon: Calendar },
      { to: "/user/ministries", label: "My Ministries", icon: Church },
      { to: "/user/profile", label: "My Profile", icon: UserIcon },
      { to: "/user/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        minRole: "elder",
      },
      {
        to: "/admin/members",
        label: "Members",
        icon: Users,
        minRole: "elder",
      },
      {
        to: "/admin/sms",
        label: "Bulk SMS",
        icon: MessageSquare,
        minRole: "elder",
      },
      {
        to: "/admin/gallery",
        label: "Gallery",
        icon: Image,
        minRole: "elder",
      },
      {
        to: "/admin/books",
        label: "Books",
        icon: BookOpen,
        minRole: "elder",
      },
      {
        to: "/admin/leadership",
        label: "Leadership",
        icon: Crown,
        minRole: "elder",
      },
      {
        to: "/admin/news",
        label: "News",
        icon: Newspaper,
        minRole: "elder",
      },
      {
        to: "/admin/calendar",
        label: "Calendar",
        icon: Calendar,
        minRole: "elder",
      },
      {
        to: "/admin/ministries",
        label: "Ministries",
        icon: Church,
        minRole: "elder",
      },
    ],
  },
];

// =========================================================
// Sidebar
// =========================================================
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, loading } = useCurrentUser();
  const role = user?.role;

  const canSeeAdmin = isStaffRole(role);

  // Filter sections by role
  const visibleSections = sections
    .map((section) => {
      if (section.title === "Administration" && !canSeeAdmin) {
        return { ...section, items: [] };
      }

      const visibleItems = section.items.filter((item) => {
        if (!item.minRole) return true;
        if (!role) return false;
        return isAtLeast(role, item.minRole);
      });

      return { ...section, items: visibleItems };
    })
    .filter((section) => section.items.length > 0);

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
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 bg-slate-700 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            visibleSections.map((section) => (
              <div key={section.title}>
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-slate-700"
                        }`
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            © 2026 Bahi SDA Church
          </p>
        </div>
      </aside>
    </>
  );
}