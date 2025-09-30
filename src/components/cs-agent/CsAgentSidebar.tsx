import React from "react";
import { href, NavLink, useLocation } from "react-router-dom";
import { useCsAgentUIStore } from "@store/cs-agent/csAgentStore";
import { cn } from "@utils/classNames";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "@store/hook";

const navigation = [
  { name: "Property Validation", href: "/cs-agent/dashboard", icon: HomeIcon },
  // { name: "Properties", href: "/cs-agent/properties", icon: ClipboardDocumentListIcon },
  // { name: "Verifications", href: "/cs-agent/verifications", icon: DocumentCheckIcon },
  // { name: "Performance", href: "/cs-agent/performance", icon: ChartBarIcon },
  { name: "Rent Chats", href: "/cs-agent/profile", icon: UserCircleIcon },
  {name:"Rent Checkout" , href:"/cs-agent/decision" , icon:DocumentCheckIcon}
];

export const CsAgentSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, setActivePage } = useCsAgentUIStore();
  const {user}= useAppSelector(state=>state.Authslice);
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
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        {sidebarCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
            <span className="text-xl font-bold text-white">CS</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
              <span className="text-xl font-bold text-white">CS</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Agent Portal
            </span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 pt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          (item.href === "/cs-agent/dashboard" && location.pathname === "/cs-agent");

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 dark:from-teal-900/50 dark:to-emerald-900/50 dark:text-teal-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                sidebarCollapsed ? "justify-center" : "justify-start"
              )}
              onClick={() => setActivePage(item.name.toLowerCase())}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400",
                  sidebarCollapsed ? "mx-auto" : "mr-3"
                )} 
              />
              {!sidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
              {!sidebarCollapsed && isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info Section - Only show when expanded */}
      {!sidebarCollapsed && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
               {user ? `${user.first_name || ''} ${user.last_name || ''}` : ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                CS Agent
              </p>
            </div>
          </div>
        </div>
      )}

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
