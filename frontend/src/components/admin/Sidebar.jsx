import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  FileText,
  Calendar,
  Bell,
  Mail,
  Info,
  Home,
  Mic,
  Shield,
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/hero', icon: Home, label: 'Hero Banner' },
    { path: '/admin/leadership', icon: Users, label: 'Leadership' },
    { path: '/admin/central-committee', icon: Shield, label: 'Central Committee' },
    { path: '/admin/gallery', icon: Image, label: 'Gallery' },
    { path: '/admin/news', icon: FileText, label: 'News' },
    { path: '/admin/events', icon: Calendar, label: 'Events' },
    { path: '/admin/notices', icon: Bell, label: 'Notices' },
    { path: '/admin/interviews', icon: Mic, label: 'Interviews' },
    { path: '/admin/contact', icon: Mail, label: 'Contact' },
    { path: '/admin/introduction', icon: Info, label: 'Introduction' },
    { path: '/admin/logos', icon: Image, label: 'Logos' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="p-4 space-y-1 overflow-y-auto">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gold text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`
          }
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;