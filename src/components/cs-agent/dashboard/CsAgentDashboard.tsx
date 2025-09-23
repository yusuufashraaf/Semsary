import React from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { csAgentApi } from "@api/endpoints/csAgent";
// import { DashboardStatsCards } from "./DashboardStatsCards";
// import { PerformanceMetrics } from "./PerformanceMetrics";
// import { PropertyTaskOverview } from "./PropertyTaskOverview";
import { DashboardStats } from "./DashboardStats";
import { Alert } from "@components/ui/Alert";
import { Card } from "@components/ui/Card";
import { cn } from "@utils/classNames";

interface CsAgentDashboardProps {
  className?: string;
}

export const CsAgentDashboard: React.FC<CsAgentDashboardProps> = ({
  className,
}) => {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cs-agent", "dashboard"],
    queryFn: csAgentApi.getDashboard,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    return (
      <div className={cn("space-y-6", className)}>
        <Alert type="error" title="Failed to load dashboard">
          <div>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
            <button
              onClick={() => refetch()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Click here to retry
            </button>
          </div>
        </Alert>
      </div>
    );
  }

  if (isLoading || !dashboardData) {
    return (
      <div className={cn("space-y-6", className)}>
        <DashboardSkeleton />
      </div>
    );
  }

  const { data: dashboard } = dashboardData;

  if (!dashboard) {
    return (
      <div className={cn("space-y-6", className)}>
        <DashboardSkeleton />
      </div>
    );
  }

  // Handle both old and new API response structures
  const { assignments, recent_assignments } = dashboard;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {dashboard.agent?.name || "Agent"}!
        </h1>
        <p className="text-teal-100 text-sm">
          Here's your property verification dashboard overview
        </p>
      </div>

      {/* Key Metrics - Based on the provided API response, these are now part of DashboardStats */}
      {/* DashboardStatsCards component might need to be refactored or removed if metrics are not returned separately */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Stats Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assignment Overview
              </h3>
            </div>
            <DashboardStats
              stats={{
                active: assignments?.active || 0,
                completed: assignments?.completed || 0,
                pending: 0, // Not available in the provided API response
                average_completion_time:
                  assignments?.average_completion_time?.toString() || "0",
                completion_rate: 0, // Not available in the provided API response
                active_change: 0,
                completed_change: 0,
              }}
            />
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Overview
              </h3>
            </div>
            {/* Based on the provided API response, agent performance is not directly available here */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Performance metrics not available in this dashboard API response.
            </div>
          </Card>
        </div>

        {/* Right Column - Activity and Actions */}
        <div className="space-y-6">
          {/* Property Task Overview */}
          {/* PropertyTaskOverview component relies on assignments_overview which is not in the provided API response */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Assignments
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {assignments?.active || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Assignments
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {assignments?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Completion Time
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {assignments?.average_completion_time || "N/A"}
                </span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recent_assignments && recent_assignments.length > 0 ? (
                recent_assignments.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.property?.title || `Assignment #${item.id}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.notes ||
                          `Status: ${item.formatted_status || item.status}`}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(item.assigned_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent activity
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Info */}
      {/* The provided API response (2.2) does not include 'generated_at' */}
      {/* {dashboard.generated_at && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(dashboard.generated_at).toLocaleString()}
        </div>
      )} */}
    </div>
  );
};

// Loading skeleton component
const DashboardSkeleton: React.FC = () => (
  <>
    {/* Header skeleton */}
    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-24 animate-pulse" />

    {/* Stats cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 animate-pulse"
        />
      ))}
    </div>

    {/* Main content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse" />
      </div>
      <div className="space-y-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
      </div>
    </div>
  </>
);
