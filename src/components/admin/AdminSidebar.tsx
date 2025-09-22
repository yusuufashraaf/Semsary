// === FIX 1: AdminSidebar.tsx - Fix collapsed icons and dark mode ===
// Replace: src/components/admin/AdminSidebar.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useUIStore } from "@store/admin/adminStore";
import { cn } from "@utils/classNames";
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Properties", href: "/admin/properties", icon: BuildingOfficeIcon },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCardIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export const AdminSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, setActivePage } = useUIStore();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Remove Logo Section - Start navigation directly */}
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 pt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                sidebarCollapsed ? "justify-center" : "justify-start"
              )}
              onClick={() => setActivePage(item.name.toLowerCase())}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  sidebarCollapsed ? "mx-auto" : "mr-3"
                )} 
              />
              {!sidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Toggle */}
      <div className="border-t border-gray-200 p-2 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex w-full items-center rounded-lg p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
            sidebarCollapsed ? "justify-center" : "justify-start"
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeftIcon className="h-5 w-5 mr-3" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};