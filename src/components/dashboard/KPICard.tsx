import React from "react";
import { cn } from "@utils/classNames";
import { formatNumber, formatCurrency } from "@utils/formatters";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
// import { LoadingSpinner } from "@components/ui/LoadingSpinner";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period: string;
  };
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  loading?: boolean;
  format?: "number" | "currency" | "percentage";
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  variant = "default",
  loading = false,
  format = "number",
  className,
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val;

    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "percentage":
        return `${val}%`;
      case "number":
      default:
        return formatNumber(val);
    }
  };

  const variantClasses = {
    default: "border-gray-200 dark:border-gray-700",
    success:
      "border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20",
    warning:
      "border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20",
    danger:
      "border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/20",
    primary:
      "border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20",
  };

  if (loading) {
    return (
      <div className={cn("card", variantClasses[variant], className)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="loading-skeleton h-4 w-24 mb-2" />
            <div className="loading-skeleton h-8 w-32 mb-2" />
            <div className="loading-skeleton h-3 w-20" />
          </div>
          <div className="loading-skeleton h-12 w-12 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card", variantClasses[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {formatValue(value)}
          </p>
          {change && (
            <div className="flex items-center text-sm">
              {change.type === "increase" && (
                <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
              )}
              {change.type === "decrease" && (
                <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
              )}
              <span
                className={cn(
                  "font-medium",
                  change.type === "increase" && "text-success-600",
                  change.type === "decrease" && "text-danger-600",
                  change.type === "neutral" && "text-gray-600"
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                {change.period}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="h-6 w-6 text-gray-600 dark:text-gray-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
