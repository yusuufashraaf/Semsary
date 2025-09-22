// src/components/admin/properties/PropertyFilter.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ExtendedPropertyFilters {
  status?: string;
  type?: string;
  price_min?: number;
  price_max?: number;
  location?: string;
  date_from?: string;
  date_to?: string;
  bedrooms?: number;
  bathrooms?: number;
  size_min?: number;
  size_max?: number;
  assigned_cs_agent?: number;
  assignment_status?: 'assigned' | 'unassigned';
  search?: string;
  has_images?: boolean;
  has_reviews?: boolean;
  has_bookings?: boolean;
  featured_only?: boolean;
  requires_attention?: boolean;
}

interface PropertyFilterProps {
  onFilterChange: (filters: ExtendedPropertyFilters) => void;
  onClearFilters: () => void;
  initialFilters?: ExtendedPropertyFilters;
  csAgents?: Array<{ id: number; first_name: string; last_name: string; }>;
  loading?: boolean;
}

// Skeleton loader component for filter inputs
const FilterSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  onFilterChange,
  onClearFilters,
  initialFilters = {},
  csAgents = [],
  loading = false,
}) => {
  const [filters, setFilters] = useState<ExtendedPropertyFilters>(initialFilters || {});
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setFilters(initialFilters || {});
  }, [initialFilters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof ExtendedPropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Clean empty values to prevent 422 errors, but keep assignment_status even if empty
    const cleanFilters = Object.entries(newFilters).reduce((acc, [k, v]) => {
      if (k === 'assignment_status' || (v !== undefined && v !== null && v !== '' && v !== false)) {
        acc[k] = v;
      }
      return acc;
    }, {} as any);
    
    onFilterChange(cleanFilters);
  };

  // Handle price range changes
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value && value !== '' ? parseFloat(value) : undefined;
    handleFilterChange(type === 'min' ? 'price_min' : 'price_max', numValue);
  };

  // Handle size range changes
  const handleSizeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value && value !== '' ? parseFloat(value) : undefined;
    handleFilterChange(type === 'min' ? 'size_min' : 'size_max', numValue);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onClearFilters();
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== '' && value !== false
    ).length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 font-medium">Applying filters...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeFilterCount}
            </Badge>
          )}
          {loading && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-600"
              disabled={loading}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={loading}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            // Skeleton loaders for basic filters
            <>
              <FilterSkeleton />
              <FilterSkeleton />
              <FilterSkeleton />
              <FilterSkeleton />
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  type="text"
                  placeholder="Search by title or description"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={loading}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Valid">Approved</option>
                  <option value="Invalid">Rejected</option>
                  <option value="Rented">Rented</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={loading}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Villa">Villa</option>
                  <option value="Roof">Roof</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City or area"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Advanced Filters - Collapsible */}
        {isExpanded && (
          <>
            {loading ? (
              // Skeleton loaders for advanced filters
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterSkeleton />
                    <FilterSkeleton />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FilterSkeleton />
                  <FilterSkeleton />
                  <FilterSkeleton />
                </div>
              </div>
            ) : (
              <>
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={filters.price_min?.toString() || ''}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={filters.price_max?.toString() || ''}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms?.toString() || ''}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Any Bedrooms</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4 Bedrooms</option>
                      <option value="5">5+ Bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <select
                      value={filters.bathrooms?.toString() || ''}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Any Bathrooms</option>
                      <option value="1">1 Bathroom</option>
                      <option value="2">2 Bathrooms</option>
                      <option value="3">3 Bathrooms</option>
                      <option value="4">4+ Bathrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment Status
                      <span className="text-xs text-gray-500 ml-1">(Client-side filter)</span>
                    </label>
                    <select
                      value={filters.assignment_status || ''}
                      onChange={(e) => handleFilterChange('assignment_status', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All Properties</option>
                      <option value="assigned">Assigned to Agent</option>
                      <option value="unassigned">Not Assigned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned CS Agent
                    </label>
                    <select
                      value={filters.assigned_cs_agent?.toString() || ''}
                      onChange={(e) => handleFilterChange('assigned_cs_agent', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All Agents</option>
                      {csAgents.map(agent => (
                        <option key={agent.id} value={agent.id.toString()}>
                          {agent.first_name} {agent.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Size Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Range (sqft)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min size"
                      value={filters.size_min?.toString() || ''}
                      onChange={(e) => handleSizeChange('min', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max size"
                      value={filters.size_max?.toString() || ''}
                      onChange={(e) => handleSizeChange('max', e.target.value)}
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    />
                    <Input
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    />
                  </div>
                </div>

                {/* Boolean Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_images || false}
                        onChange={(e) => handleFilterChange('has_images', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has Images</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_reviews || false}
                        onChange={(e) => handleFilterChange('has_reviews', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has Reviews</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.has_bookings || false}
                        onChange={(e) => handleFilterChange('has_bookings', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Has Bookings</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.featured_only || false}
                        onChange={(e) => handleFilterChange('featured_only', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.requires_attention || false}
                        onChange={(e) => handleFilterChange('requires_attention', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Requires Attention</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
