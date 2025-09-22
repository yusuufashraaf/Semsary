// src/components/admin/users/UserFilter.tsx - Fixed to prevent event object serialization
import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { cn } from '@utils/classNames';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import type { UserFilters } from '@app-types/admin/admin';

interface UserFilterProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
  loading?: boolean;
  className?: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
  className,
}) => {
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  // Safe filter change handler that ensures only primitive values are passed
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    // Ensure we only pass primitive values, not event objects or DOM elements
    let safeValue: string | number | undefined;
    
    if (typeof value === 'string' || typeof value === 'number') {
      safeValue = value || undefined;
    } else if (value && typeof value === 'object' && 'target' in value) {
      // Handle event objects
      safeValue = value.target.value || undefined;
    } else {
      safeValue = value ? String(value) : undefined;
    }
    
    const newFilters: UserFilters = {
      ...localFilters,
      [key]: safeValue,
    };
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  };

  const handleSelectChange = (key: keyof UserFilters) => (value: string) => {
    handleFilterChange(key, value);
  };

  const handleClearAll = () => {
    setLocalFilters({});
    onClearFilters();
  };

  // Role options - matching backend API
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'owner', label: 'Owner' },
    { value: 'agent', label: 'Agent' },
    { value: 'admin', label: 'Admin' },
  ];

  // Status options - matching backend API (active, pending, suspended)
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  // Sort options - matching backend API
  const sortByOptions = [
    { value: 'created_at', label: 'Registration Date' },
    { value: 'first_name', label: 'First Name' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
    { value: 'role', label: 'Role' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {/* Search Bar - Always Visible */}
      <div className="p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={localFilters.search || ''}
            onChange={handleSearchChange}
            className="pl-10 pr-4"
            disabled={loading}
          />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Advanced Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-primary-600"></span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={loading}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <Select
                value={localFilters.role || ''}
                onChange={(e) => handleSelectChange('role')(e.target.value)}
                options={roleOptions}
                disabled={loading}
                placeholder="Select role"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={localFilters.status || ''}
                onChange={(e) => handleSelectChange('status')(e.target.value)}
                options={statusOptions}
                disabled={loading}
                placeholder="Select status"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={localFilters.sort_by || 'created_at'}
                onChange={(e) => handleSelectChange('sort_by')(e.target.value)}
                options={sortByOptions}
                disabled={loading}
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <Select
                value={localFilters.sort_order || 'desc'}
                onChange={(e) => handleSelectChange('sort_order')(e.target.value)}
                options={sortOrderOptions}
                disabled={loading}
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered From
              </label>
              <Input
                type="date"
                value={localFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered To
              </label>
              <Input
                type="date"
                value={localFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Results Per Page */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Per Page
              </label>
              <Select
                value={localFilters.per_page?.toString() || '15'}
                onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value) || 15)}
                options={[
                  { value: '10', label: '10 per page' },
                  { value: '15', label: '15 per page' },
                  { value: '25', label: '25 per page' },
                  { value: '50', label: '50 per page' },
                  { value: '100', label: '100 per page' },
                ]}
                disabled={loading}
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {localFilters.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Role: {localFilters.role}
                    <button
                      onClick={() => handleFilterChange('role', undefined)}
                      className="ml-1 hover:text-blue-600"
                      type="button"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {localFilters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {localFilters.status}
                    <button
                      onClick={() => handleFilterChange('status', undefined)}
                      className="ml-1 hover:text-green-600"
                      type="button"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {localFilters.search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Search: "{localFilters.search}"
                    <button
                      onClick={() => handleFilterChange('search', undefined)}
                      className="ml-1 hover:text-purple-600"
                      type="button"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {localFilters.date_from && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    From: {localFilters.date_from}
                    <button
                      onClick={() => handleFilterChange('date_from', undefined)}
                      className="ml-1 hover:text-orange-600"
                      type="button"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {localFilters.date_to && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    To: {localFilters.date_to}
                    <button
                      onClick={() => handleFilterChange('date_to', undefined)}
                      className="ml-1 hover:text-orange-600"
                      type="button"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};