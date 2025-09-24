import React from 'react';
import { cn } from '@utils/classNames';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  children,
  className,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    }
  };

  return (
    <div className={cn('rounded-lg border p-4', getStyles(), className)}>
      <div className="flex">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {children && <div className="mt-2 text-sm">{children}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto -mr-1 -mt-1 flex h-6 w-6 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            <span className="sr-only">Close</span>
            <XCircleIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
