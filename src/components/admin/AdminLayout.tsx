import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { NotificationToast } from '@components/ui/NotificationToast';
import { useUIStore } from '@store/admin/adminStore';
import { cn } from '@utils/classNames';

// Import admin-specific Tailwind CSS
import '@styles/admin-tailwind.css';

export const AdminLayout: React.FC = () => {
  const { sidebarCollapsed, darkMode } = useUIStore();

  React.useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={cn('admin-layout min-h-screen bg-gray-50 dark:bg-gray-900', darkMode && 'dark')}>
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Header */}
        <AdminHeader />
        
        {/* Page Content - Add padding top for sticky header */}
        <main className="p-4 sm:p-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Notifications */}
      <NotificationToast />
    </div>
  );
};