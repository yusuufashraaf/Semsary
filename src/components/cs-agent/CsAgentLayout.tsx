import React from "react";
import { Outlet } from "react-router-dom";
import { CsAgentSidebar } from "./CsAgentSidebar";
import { CsAgentHeader } from "./CsAgentHeader";
import { NotificationToast } from "@components/ui/NotificationToast";
import { useCsAgentUIStore } from "@store/cs-agent/csAgentStore";
import { cn } from "@utils/classNames";

// Import CS Agent-specific Tailwind CSS
import "@styles/cs-agent-tailwind.css";

export const CsAgentLayout: React.FC = () => {
  const { sidebarCollapsed, darkMode } = useCsAgentUIStore();

  React.useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={cn(
        "cs-agent-layout min-h-screen bg-gray-50 dark:bg-gray-900",
        darkMode && "dark"
      )}
    >
      {/* Sidebar */}
      <CsAgentSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Header */}
        <CsAgentHeader />

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
