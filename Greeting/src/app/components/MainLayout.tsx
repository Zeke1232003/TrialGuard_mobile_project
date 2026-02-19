// Refactored MainLayout - Mobile-first with FAB
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, Settings, Plus } from 'lucide-react';

export function MainLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const navItems = [
    { path: '/app', icon: Home, label: 'Dashboard' },
    { path: '/app/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/app/add')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-600 rounded-full shadow-lg flex items-center justify-center z-40 transition-transform hover:scale-110"
        aria-label="Add Subscription"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                  active ? 'text-teal-500' : 'text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'stroke-2' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
