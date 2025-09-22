import React from "react";
import { KPICard } from "@components/dashboard/KPICard";
import {
  UsersIcon,
  HomeIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { DashboardStats } from "@app-types/admin/admin";
import { formatCurrency } from "@utils/formatters";

interface StatsGridProps {
  stats?: DashboardStats;
  loading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  loading = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Users"
        value={stats?.totalUsers || 0}
        icon={<UsersIcon className="h-6 w-6" />}
        variant="primary"
        loading={loading}
        format="number"
      />
      <KPICard
        title="Total Properties"
        value={stats?.totalProperties || 0}
        icon={<HomeIcon className="h-6 w-6" />}
        variant="success"
        loading={loading}
        format="number"
      />
      <KPICard
        title="Total Transactions"
        value={stats?.totalTransactions || 0}
        icon={<CreditCardIcon className="h-6 w-6" />}
        variant="warning"
        loading={loading}
        format="number"
      />
      <KPICard
        title="Total Revenue"
        value={
          stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : "$0.00"
        }
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        variant="danger"
        loading={loading}
        format="currency"
      />
    </div>
  );
};
