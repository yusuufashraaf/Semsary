import React from 'react';
import { Card } from '@components/ui/Card';
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@utils/classNames';

interface DashboardStatsProps {
  stats: {
    active: number;
    completed: number;
    pending: number;
    average_completion_time: string;
    completion_rate?: number;
    active_change?: number;
    completed_change?: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      id: 1,
      name: 'Active Assignments',
      value: stats.active,
      change: stats.active_change || 0,
      changeType: stats.active_change && stats.active_change > 0 ? 'increase' : 'decrease',
      icon: ClipboardDocumentCheckIcon,
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
    },
    {
      id: 2,
      name: 'Completed This Month',
      value: stats.completed,
      change: stats.completed_change || 0,
      changeType: stats.completed_change && stats.completed_change > 0 ? 'increase' : 'decrease',
      icon: CheckCircleIcon,
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      darkBg: 'dark:bg-green-900/20',
    },
    {
      id: 3,
      name: 'Pending Verification',
      value: stats.pending,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      darkBg: 'dark:bg-amber-900/20',
    },
    {
      id: 4,
      name: 'Avg. Completion Time',
      value: stats.average_completion_time,
      icon: ClockIcon,
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-900/20',
      isTime: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.id} className="relative overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'rounded-lg p-3',
                    stat.lightBg,
                    stat.darkBg
                  )}
                >
                  <Icon className={cn('h-6 w-6', stat.bgColor.replace('bg-', 'text-'))} />
                </div>
                {stat.change !== undefined && stat.change !== 0 && (
                  <div
                    className={cn(
                      'flex items-center text-sm',
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.isTime ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              {/* Decorative gradient bar */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 h-1 w-full',
                  stat.bgColor
                )}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
