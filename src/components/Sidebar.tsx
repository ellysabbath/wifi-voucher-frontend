import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Printer, User } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Generate Vouchers', icon: PlusCircle },
  { to: '/vouchers', label: 'Voucher List', icon: List },
  { to: '/print', label: 'Print Vouchers', icon: Printer },
  { to: '/portal', label: 'Customer Portal', icon: User },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-secondary text-white min-h-screen p-4 no-print">
      <h1 className="text-2xl font-bold mb-8 text-primary">WiFi Vouchers</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-primary text-white' : 'hover:bg-slate-700'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}