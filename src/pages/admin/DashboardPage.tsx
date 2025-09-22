import React from "react";
import {
  useDashboardStats,
  useRevenueChart,
  useUsersChart,
  usePropertiesChart,
} from "@hooks/useAdminQueries";
import { StatsGrid } from "@components/dashboard/StatsGrid";
import { SalesChart } from "@components/dashboard/SalesChart";
import { UserStatsChart } from "@components/dashboard/UserStatsChart";
import { PropertiesChart } from "@components/dashboard/PropertiesChart";
import { RecentTransactions } from "@components/dashboard/RecentTransactions";
import { DashboardSummary } from "@components/dashboard/DashboardSummary";
import { useModalStore } from "@store/admin/adminStore";
import { Transaction } from "@app-types/admin/admin";
import { getChartColors } from "@utils/chartHelpers"; // transformToChartData not used

export const DashboardPage: React.FC = () => {
  const { openModal } = useModalStore();

  // Fetch dashboard data
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { isLoading: revenueLoading } = useRevenueChart();
  const { isLoading: usersLoading } = useUsersChart();
  const { isLoading: propertiesLoading } = usePropertiesChart();

  // Transform chart data
  const revenueChartData = React.useMemo(() => {
    if (!dashboardStats?.monthlyRevenue) return undefined;

    const labels = Object.keys(dashboardStats.monthlyRevenue).map((month) => {
      const date = new Date(month + "-01");
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    });

    const data = Object.values(dashboardStats.monthlyRevenue).map((value) =>
      parseFloat(value)
    );

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    };
  }, [dashboardStats?.monthlyRevenue]);

  const usersChartData = React.useMemo(() => {
    if (!dashboardStats?.usersByRole) return undefined;

    const labels = Object.keys(dashboardStats.usersByRole).map(
      (role) => role.charAt(0).toUpperCase() + role.slice(1)
    );
    const data = Object.values(dashboardStats.usersByRole);
    const colors = getChartColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: "Users",
          data,
          backgroundColor: colors,
        },
      ],
    };
  }, [dashboardStats?.usersByRole]);

  const propertiesChartData = React.useMemo(() => {
    if (!dashboardStats?.propertiesByStatus) return undefined;

    const labels = Object.keys(dashboardStats.propertiesByStatus);
    const data = Object.values(dashboardStats.propertiesByStatus);
    const colors = getChartColors(labels.length);

    return {
      labels,
      datasets: [
        {
          label: "Properties",
          data,
          backgroundColor: colors,
        },
      ],
    };
  }, [dashboardStats?.propertiesByStatus]);

  const handleTransactionClick = (transaction: Transaction) => {
    openModal("transactionDetails", { transactionId: transaction.id });
  };

  // Handle error state
  if (statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Unable to load dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an error loading the dashboard data. Please try refreshing
            the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your real estate management platform
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <StatsGrid stats={dashboardStats} loading={statsLoading} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart
          data={revenueChartData}
          loading={revenueLoading}
          title="Monthly Revenue"
          height={350}
        />
        <UserStatsChart
          data={usersChartData}
          loading={usersLoading}
          title="Users by Role"
          height={350}
        />
      </div>

      {/* Properties Chart and Summary Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Properties Chart - Takes 2 columns on XL screens */}
        <div className="xl:col-span-2">
          <PropertiesChart
            data={propertiesChartData}
            loading={propertiesLoading}
            title="Properties by Status"
            height={300}
          />
        </div>
        
        {/* Quick Stats Summary - Takes 1 column on XL screens */}
        <div className="xl:col-span-1">
          <DashboardSummary stats={dashboardStats} loading={statsLoading} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={dashboardStats?.recentTransactions || []}
        loading={statsLoading}
        onTransactionClick={handleTransactionClick}
      />
    </div>
  );
};
