import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Shield, LayoutDashboard, Users, FileText, Image, BarChart3, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const SuperAdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('superToken');
    const superAdmin = localStorage.getItem('superAdmin');
    
    if (!token || !superAdmin) {
      navigate('/superadmin/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('superToken');
    localStorage.removeItem('superAdmin');
    toast.success('Logged out successfully');
    navigate('/superadmin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { path: '/superadmin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/superadmin/admins', icon: Users, label: 'Manage Admins' },
    { path: '/superadmin/logs', icon: FileText, label: 'Activity Logs' },
    { path: '/superadmin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/superadmin/cloudinary', icon: Image, label: 'Cloudinary Manager' },
    { path: '/superadmin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-army-dark transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-gold" />
            <div>
              <span className="text-white font-bold text-sm">Super Admin</span>
              <p className="text-gold text-xs">Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-gold text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-army">Super Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Super Admin</span>
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                SA
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default SuperAdminLayout;