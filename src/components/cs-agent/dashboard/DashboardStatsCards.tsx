import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { DashboardMetrics } from '@app-types/cs-agent/cs-agent';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { cn } from '@utils/classNames';

interface DashboardStatsCardsProps {
  metrics: DashboardMetrics;
  className?: string;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ 
  metrics, 
  className 
}) => {
  if (!metrics) {
    return null;
  }

  const statsConfig = [
    {
      title: 'Active Assignments',
      value: (metrics.pending_assignments?.value || 0) + (metrics.in_progress_assignments?.value || 0),
      description: `${metrics.pending_assignments?.value || 0} pending, ${metrics.in_progress_assignments?.value || 0} in progress`,
      icon: PlayIcon,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      urgentCount: metrics.pending_assignments?.urgent_count,
      overdueCount: metrics.pending_assignments?.overdue_count,
    },
    {
      title: 'Completed Today',
      value: metrics.completed_assignments?.today || 0,
      description: `${metrics.completed_assignments?.this_week || 0} this week`,
      icon: CheckCircleIcon,
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      trend: {
        value: (metrics.completion_rate?.value || 0) - (metrics.completion_rate?.target || 0),
        isPositive: (metrics.completion_rate?.value || 0) >= (metrics.completion_rate?.target || 80),
      }
    },
    {
      title: 'Completion Rate',
      value: `${metrics.completion_rate?.value || 0}%`,
      description: `Target: ${metrics.completion_rate?.target || 80}%`,
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
      isTargetMet: (metrics.completion_rate?.value || 0) >= (metrics.completion_rate?.target || 80),
    },
    {
      title: 'Avg. Completion Time',
      value: `${metrics.avg_completion_time?.value || 0}`,
      description: `${metrics.avg_completion_time?.unit || 'days'} (Target: ${metrics.avg_completion_time?.target || 2}${metrics.avg_completion_time?.unit || 'days'})`,
      icon: ClockIcon,
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-800',
      isTargetMet: (metrics.avg_completion_time?.value || 0) <= (metrics.avg_completion_time?.target || 2),
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {statsConfig.map((stat, index) => (
        <Card 
          key={index}
          className={cn(
            "relative overflow-hidden border transition-all duration-200 hover:shadow-md hover:-translate-y-1",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="p-6">
            {/* Header with icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                stat.iconColor.includes('blue') && 'bg-blue-100 dark:bg-blue-900/30',
                stat.iconColor.includes('emerald') && 'bg-emerald-100 dark:bg-emerald-900/30',
                stat.iconColor.includes('purple') && 'bg-purple-100 dark:bg-purple-900/30',
                stat.iconColor.includes('amber') && 'bg-amber-100 dark:bg-amber-900/30'
              )}>
                <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
              </div>

              {/* Badges for urgent/overdue items */}
              {stat.urgentCount && stat.urgentCount > 0 && (
                <Badge variant="danger" size="sm">
                  {stat.urgentCount} urgent
                </Badge>
              )}
              
              {stat.overdueCount && stat.overdueCount > 0 && (
                <Badge variant="warning" size="sm">
                  {stat.overdueCount} overdue
                </Badge>
              )}

              {/* Performance indicators */}
              {stat.trend && (
                <div className="flex items-center">
                  {stat.trend.isPositive ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                </div>
              )}

              {stat.isTargetMet !== undefined && (
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  stat.isTargetMet ? "bg-green-500" : "bg-red-500"
                )} />
              )}
            </div>

            {/* Value */}
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>

            {/* Title and description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {stat.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>

            {/* Trend indicator for completion rate */}
            {stat.trend && (
              <div className="mt-3 flex items-center text-xs">
                <span className={cn(
                  "font-medium",
                  stat.trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {stat.trend.isPositive ? '+' : ''}{stat.trend.value.toFixed(1)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  vs target
                </span>
              </div>
            )}
          </div>

          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-black/10 pointer-events-none" />
        </Card>
      ))}
    </div>
  );
};

// Individual stat card component for reusability
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badges?: Array<{
    text: string;
    variant: 'danger' | 'warning' | 'success';
  }>;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  badges = [],
  className
}) => {
  return (
    <Card className={cn("p-6 transition-all duration-200 hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant} size="sm">
              {badge.text}
            </Badge>
          ))}
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </div>

      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {trend && (
        <div className="mt-3 flex items-center text-xs">
          {trend.isPositive ? (
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={cn(
            "font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </span>
        </div>
      )}
    </Card>
  );
};
