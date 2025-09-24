import React from 'react';
import { Card } from '@components/ui/Card';
import { Link } from 'react-router-dom';
import {
  ChartPieIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@utils/classNames';

interface PropertyTaskOverviewProps {
  overview: {
    pending: number;
    in_progress: number;
    completed: number;
    rejected: number;
    urgent: number;
    overdue: number;
  };
}

export const PropertyTaskOverview: React.FC<PropertyTaskOverviewProps> = ({ overview }) => {
  const tasks = [
    {
      label: 'Pending',
      value: overview.pending || 0,
      icon: ClipboardDocumentListIcon,
      color: 'amber',
      href: '/cs-agent/properties?status=pending',
    },
    {
      label: 'In Progress',
      value: overview.in_progress || 0,
      icon: ClockIcon,
      color: 'blue',
      href: '/cs-agent/properties?status=in_progress',
    },
    {
      label: 'Completed',
      value: overview.completed || 0,
      icon: CheckCircleIcon,
      color: 'green',
      href: '/cs-agent/properties?status=completed',
    },
    {
      label: 'Rejected',
      value: overview.rejected || 0,
      icon: XCircleIcon,
      color: 'red',
      href: '/cs-agent/properties?status=rejected',
    },
  ];

  const total = tasks.reduce((sum, task) => sum + task.value, 0);

  const getColorClasses = (color: string) => {
    const colors = {
      amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getProgressColor = (color: string) => {
    const colors = {
      amber: 'bg-amber-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card className="h-full">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <ChartPieIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Task Overview
          </h3>
        </div>
      </div>

      <div className="p-6">
        {/* Urgent/Overdue Alerts */}
        {(overview.urgent > 0 || overview.overdue > 0) && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <div className="flex items-start space-x-2">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="text-sm">
                {overview.urgent > 0 && (
                  <p className="text-red-700 dark:text-red-300">
                    <span className="font-semibold">{overview.urgent}</span> urgent tasks need attention
                  </p>
                )}
                {overview.overdue > 0 && (
                  <p className="text-red-700 dark:text-red-300">
                    <span className="font-semibold">{overview.overdue}</span> tasks are overdue
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => {
            const Icon = task.icon;
            const percentage = total > 0 ? (task.value / total) * 100 : 0;
            
            return (
              <Link
                key={task.label}
                to={task.href}
                className="block rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('rounded-lg p-2', getColorClasses(task.color))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(0)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {task.value}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={cn('h-full transition-all duration-300', getProgressColor(task.color))}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="mt-4 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 p-3 text-center dark:from-teal-900/20 dark:to-emerald-900/20">
          <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">
            {total}
          </p>
          <p className="text-xs text-teal-600 dark:text-teal-400">
            Total Assignments
          </p>
        </div>
      </div>
    </Card>
  );
};
