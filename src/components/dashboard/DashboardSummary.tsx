import React from 'react';
import { Card, CardHeader, CardBody } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { DashboardStats } from '@app-types/admin/admin';

interface DashboardSummaryProps {
  stats?: DashboardStats;
  loading?: boolean;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ 
  stats, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="loading-skeleton h-6 w-32" />
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="loading-skeleton h-4 w-20" />
                    <div className="loading-skeleton h-6 w-12" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users by Role */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Users by Role
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {stats?.usersByRole && Object.entries(stats.usersByRole).map(([role, count]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {role}
                </span>
                <Badge variant="secondary">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Properties by Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Properties by Status
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {stats?.propertiesByStatus && Object.entries(stats.propertiesByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {status}
                </span>
                <Badge status={status}>
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Transactions by Type */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transactions by Type
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {stats?.transactionsByType && Object.entries(stats.transactionsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {type}
                </span>
                <Badge variant="primary">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};