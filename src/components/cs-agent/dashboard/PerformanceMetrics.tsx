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
import UserMessagesOrigin from '@components/Profile/UserMessagesOrigin';

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
      <UserMessagesOrigin />
  );
};
