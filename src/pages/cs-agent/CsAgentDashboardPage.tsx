import React from "react";
import CsAgentDashboard from "@components/cs-agent/dashboard/CsAgentDashboard";
import { useCsAgentUIStore } from "@store/cs-agent/csAgentStore";
import { useAppSelector } from "@store/hook";

export const CsAgentDashboardPage: React.FC = () => {
  const { setActivePage } = useCsAgentUIStore();
  const { jwt } = useAppSelector((state) => state.Authslice); // ✅ inside component

  React.useEffect(() => {
    setActivePage("dashboard");
    document.title = "CS Agent Dashboard - Semsary";
  }, [setActivePage]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor your property verification tasks and performance metrics
        </p>
      </div>

      {/* Dashboard Content */}
      <CsAgentDashboard jwt={jwt} /> {/* ✅ pass jwt as prop */}
    </div>
  );
};
