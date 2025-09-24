import React from 'react';
import { Card } from '@components/ui/Card';
import { ProgressBar } from '@components/ui/ProgressBar';
import {
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@utils/classNames';

interface PerformanceMetricsProps {
  completionRate: number;
  avgCompletionTime: string;
  totalCompleted: number;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  completionRate,
  avgCompletionTime,
  totalCompleted,
}) => {
  const performanceLevel = completionRate >= 90 ? 'excellent' : completionRate >= 70 ? 'good' : 'needs improvement';
  const performanceColor = performanceLevel === 'excellent' ? 'green' : performanceLevel === 'good' ? 'blue' : 'amber';

  return (
    <Card>
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Metrics
          </h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Completion Rate */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500">
              <span className="text-2xl font-bold text-white">
                {completionRate}%
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
              Completion Rate
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This Month
            </p>
          </div>

          {/* Average Completion Time */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-200 dark:border-blue-800">
              <ClockIcon className="h-10 w-10 text-blue-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
              {avgCompletionTime}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Avg. Completion
            </p>
          </div>

          {/* Total Completed */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
              <CheckBadgeIcon className="h-10 w-10 text-white" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
              {totalCompleted}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Total Completed
            </p>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrophyIcon className={cn(
                'h-5 w-5',
                performanceColor === 'green' ? 'text-green-500' :
                performanceColor === 'blue' ? 'text-blue-500' :
                'text-amber-500'
              )} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Performance Level
              </span>
            </div>
            <span className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              performanceColor === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
              performanceColor === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
            )}>
              {performanceLevel}
            </span>
          </div>
          
          <div className="mt-3">
            <ProgressBar 
              value={completionRate} 
              max={100}
              color={performanceColor}
              size="lg"
            />
          </div>
          
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            {performanceLevel === 'excellent' 
              ? 'Outstanding work! Keep up the excellent performance.'
              : performanceLevel === 'good'
              ? 'Good job! You\'re performing well.'
              : 'There\'s room for improvement. Focus on completing assignments faster.'}
          </p>
        </div>
      </div>
    </Card>
  );
};
