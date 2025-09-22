/* eslint-disable @typescript-eslint/no-explicit-any */
// === FIX 3: Table.tsx - Fix text alignment issues ===
// Replace: src/components/ui/Table.tsx

import React from 'react';
import { cn } from '@utils/classNames';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (item: T) => void;
  selectedRows?: any[];
  onRowSelect?: (items: any[]) => void;
  className?: string;
}

export function Table<T extends { id: number | string }>({
  data,
  columns,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  className,
}: TableProps<T>) {
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onRowSelect?.([]);
    } else {
      onRowSelect?.(data.map(item => item.id));
    }
  };

  const handleRowSelect = (id: string | number) => {
    if (selectedRows.includes(id)) {
      onRowSelect?.(selectedRows.filter(rowId => rowId !== id));
    } else {
      onRowSelect?.([...selectedRows, id]);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="loading-skeleton h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="loading-skeleton h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {onRowSelect && (
                <th className="w-4 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && onSort?.(column.key as string)}
                >
                  <div className={cn(
                    'flex items-center space-x-1',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="flex flex-col">
                        <ChevronUpIcon
                          className={cn(
                            'h-3 w-3',
                            sortKey === column.key && sortDirection === 'asc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          )}
                        />
                        <ChevronDownIcon
                          className={cn(
                            'h-3 w-3',
                            sortKey === column.key && sortDirection === 'desc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          )}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {data.map((item) => ( // rowIndex not used
              <tr
                key={item.id}
                className={cn(
                  'transition-colors hover:bg-gray-50 dark:hover:bg-gray-700',
                  onRowClick && 'cursor-pointer',
                  selectedRows.includes(item.id) && 'bg-primary-50 dark:bg-primary-900/20'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {onRowSelect && (
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(item.id);
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = typeof column.key === 'string' && column.key.includes(".")
                    ? column.key
                        .split(".")
                        .reduce((obj, key) => obj?.[key], item as any)
                    : (item as any)[column.key];

                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "table-cell",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right"
                      )}
                    >
                      {column.render ? column.render(value, item) : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="bg-white py-12 text-center dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}