// C:\laragon\www\Semsary\src\components\admin\properties\PropertiesPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Pagination } from '@components/ui/Pagination';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { PropertyFilter } from '@components/admin/properties/PropertyFilter';
import { PropertiesTable } from '@components/admin/properties/PropertiesTable';
import { PropertyDetailsModal } from '@components/admin/properties/PropertyDetailsModal';
import { 
  useProperties, 
  usePropertiesStatistics, 
  useCSAgents,
  usePropertyMutations 
} from '@hooks/usePropertiesQueries';
import { formatNumber } from '@utils/formatters';
import { toast } from 'react-toastify';
import { 
  HomeIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { AgentAssignmentModal } from '@components/admin/modals/AgentAssignmentModal';
import Swal from 'sweetalert2';

// FIX 1: Updated ExtendedPropertyFilters interface
interface ExtendedPropertyFilters {
  search?: string;
  status?: string;  // Keep as string
  type?: string;    // Keep as string
  bedrooms?: number;
  bathrooms?: number;
  size_min?: number;
  size_max?: number;
  assigned_cs_agent?: number;
  assignment_status?: 'assigned' | 'unassigned';
  has_images?: boolean;
  has_reviews?: boolean;
  has_bookings?: boolean;
  featured_only?: boolean;
  requires_attention?: boolean;
  location?: string;
  date_range?: {
    start: string;
    end: string;
  };
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const PropertiesPage: React.FC = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [filters, setFilters] = useState<ExtendedPropertyFilters>({
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPropertyForAssign, setSelectedPropertyForAssign] = useState<{id: number; title: string} | null>(null);
  // Remove the static agents data - agents will be fetched from API via useCSAgents hook
  // const [agents] = useState([
  //   {
  //     id: 1,
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     email: 'john.doe@semsary.com',
  //     current_property_count: 5,
  //     max_property_capacity: 10,
  //     status: 'active' as const,
  //   },
  //   {
  //     id: 2,
  //     first_name: 'Jane',
  //     last_name: 'Smith',
  //     email: 'jane.smith@semsary.com',
  //     current_property_count: 8,
  //     max_property_capacity: 10,
  //     status: 'active' as const,
  //   },
  //   {
  //     id: 3,
  //     first_name: 'Mike',
  //     last_name: 'Johnson',
  //     email: 'mike.johnson@semsary.com',
  //     current_property_count: 3,
  //     max_property_capacity: 12,
  //     status: 'active' as const,
  //   },
  //   {
  //     id: 4,
  //     first_name: 'Sarah',
  //     last_name: 'Wilson',
  //     email: 'sarah.wilson@semsary.com',
  //     current_property_count: 10,
  //     max_property_capacity: 10,
  //     status: 'busy' as const,
  //   },
  //   {
  //     id: 5,
  //     first_name: 'David',
  //     last_name: 'Brown',
  //     email: 'david.brown@semsary.com',
  //     current_property_count: 7,
  //     max_property_capacity: 15,
  //     status: 'active' as const,
  //   },
  // ]); // Sample agents data

  // FIX 1: Added conversion function that's actually used
  const convertToAPIFilters = (filters: ExtendedPropertyFilters) => {
    const apiFilters: any = { ...filters };
    
    // Convert string values to arrays for API
    if (filters.status) apiFilters.property_state = [filters.status];
    if (filters.type) apiFilters.type = [filters.type];
    
    // Remove assignment_status from API filters since backend doesn't support it
    delete apiFilters.assignment_status;
    
    return apiFilters;
  };

  // API hooks
  const { data: rawPropertiesData, isLoading: propertiesLoading, error: propertiesError } = useProperties(
    currentPage,
    pageSize,
    convertToAPIFilters(filters)
  );

  // Client-side filtering for assignment status
  const propertiesData = useMemo(() => {
    if (!rawPropertiesData) return rawPropertiesData;

    // If no assignment_status filter is applied, return original data
    if (!filters.assignment_status) {
      return rawPropertiesData;
    }

    // Filter properties based on assignment status
    const filteredProperties = rawPropertiesData.data.filter(property => {
      const hasAssignedAgent = property.assignment?.is_assigned === true;
      
      if (filters.assignment_status === 'assigned') {
        return hasAssignedAgent;
      } else if (filters.assignment_status === 'unassigned') {
        return !hasAssignedAgent;
      }
      
      return true;
    });

    return {
      ...rawPropertiesData,
      data: filteredProperties,
      total: filteredProperties.length,
      to: Math.min(rawPropertiesData.from + filteredProperties.length - 1, filteredProperties.length),
    };
  }, [rawPropertiesData, filters.assignment_status]);

  const { data: statistics, isLoading: statsLoading, error: statsError } = usePropertiesStatistics();
  const { data: csAgents } = useCSAgents();
  const propertyMutations = usePropertyMutations();

  // Handle statistics errors
  useEffect(() => {
    if (statsError) {
      console.error('Statistics error:', statsError);
      setStatisticsError('Failed to load statistics');
    } else {
      setStatisticsError(null);
    }
  }, [statsError]);

  // Debug logging for statistics
  useEffect(() => {
    console.log('Statistics data:', statistics);
    console.log('Statistics loading:', statsLoading);
    console.log('Statistics error:', statsError);
  }, [statistics, statsLoading, statsError]);

  // Debug logging for properties
  useEffect(() => {
    console.log('Properties data:', propertiesData);
    console.log('Properties loading:', propertiesLoading);
    console.log('Properties error:', propertiesError);
  }, [propertiesData, propertiesLoading, propertiesError]);

  // Filter handling - FIXED VERSION
  const handleFilterChange = (newFilters: ExtendedPropertyFilters) => {
    console.log('PropertiesPage received filters:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    console.log('PropertiesPage clearing filters');
    setFilters({});
    setCurrentPage(1);
  };

  // Statistics cards data with error handling - FIXED VERSION
  const statisticsCards = useMemo(() => {
    // Debug logging
    console.log('Raw statistics in component:', statistics);
    console.log('Stats loading:', statsLoading);
    console.log('Stats error:', statisticsError);
    
    // Provide default statistics if loading or error
    const defaultStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    // Map the statistics properly based on your API response structure
    let stats = defaultStats;
    
    if (statistics) {
      stats = {
        total: statistics.total || 0,
        pending: statistics.pending || 0, 
        approved: statistics.approved || 0,
        rejected: statistics.rejected || 0
      };
    }
    
    console.log('Mapped stats for cards:', stats);
   
    return [
      {
        title: 'Total Properties',
        value: formatNumber(stats.total),
        icon: HomeIcon,
        variant: 'default' as const,
        loading: statsLoading,
        error: statisticsError,
      },
      {
        title: 'Pending Review',
        value: formatNumber(stats.pending),
        icon: ClockIcon,
        variant: 'warning' as const,
        loading: statsLoading,
        error: statisticsError,
        change: stats.pending > 0 ? {
          value: stats.pending,
          type: 'increase' as const,
          period: 'requiring attention'
        } : undefined,
      },
      {
        title: 'Approved',
        value: formatNumber(stats.approved),
        icon: CheckCircleIcon,
        variant: 'success' as const,
        loading: statsLoading,
        error: statisticsError,
      },
      {
        title: 'Rejected',
        value: formatNumber(stats.rejected),
        icon: XCircleIcon,
        variant: 'danger' as const,
        loading: statsLoading,
        error: statisticsError,
      },
    ];
  }, [statistics, statsLoading, statisticsError]);

  // Handle property selection
  const handlePropertySelect = (property: any) => {
    setSelectedPropertyId(property.id);
    setIsDetailsModalOpen(true);
  };

  // Handle view property
  const handleViewProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setIsDetailsModalOpen(true);
  };

  // Handle approve property
  const handleApproveProperty = async (propertyId: number) => {
    try {
      await propertyMutations.updateStatus.mutateAsync({
        id: propertyId,
        status: 'Valid',
        data: {
          reason: 'Property meets all requirements and has been verified',
          notify_owner: true,
          internal_notes: 'Approved via admin dashboard',
        },
      });
    } catch (error) {
      console.error('Failed to approve property:', error);
    }
  };

  // Handle reject property with SweetAlert2
  const handleRejectProperty = async (propertyId: number) => {
    const result = await Swal.fire({
      title: 'Reject Property?',
      input: 'textarea',
      inputLabel: 'Please provide a reason for rejection:',
      inputPlaceholder: 'Enter rejection reason...',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason for rejection!'
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Reject Property',
      confirmButtonColor: '#EF4444',
      cancelButtonText: 'Cancel',
      icon: 'warning'
    });

    if (result.isConfirmed && result.value) {
      try {
        await propertyMutations.updateStatus.mutateAsync({
          id: propertyId,
          status: 'Invalid',
          data: {
            reason: result.value,
            notify_owner: true,
            internal_notes: 'Rejected via admin dashboard',
          },
        });
        
        await Swal.fire({
          title: 'Property Rejected',
          text: 'The property has been rejected successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error('Failed to reject property:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to reject property. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  // Handle assign CS agent
  const handleAssignCS = (propertyId: number) => {
    const property = propertiesData?.data?.find(p => p.id === propertyId);
    if (property) {
      // Check if property has active assignment
      if (property.assignment?.is_assigned) {
        Swal.fire({
          title: 'Property Already Assigned',
          text: 'This property already has an active assignment.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        return;
      }
      
      setSelectedPropertyForAssign({
        id: propertyId,
        title: property.title
      });
      setAssignModalOpen(true); // This opens the new modal
    }
  };

  // Handle agent assignment from modal
  const handleAgentAssignment = async (agentId: number, propertyId: number, assignmentData: any): Promise<boolean> => {
    try {
      const response = await propertyMutations.assignToCS.mutateAsync({
        propertyId,
        data: {
          cs_agent_id: agentId,
          ...assignmentData
        }
      });

      if (response.success) {
        setAssignModalOpen(false);
        setSelectedPropertyForAssign(null);
        return true;
      } else {
        console.error('Assignment failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Assignment error:', error);
      return false;
    }
  };

  // Handle bulk operations
  const handleBulkApprove = async () => {
    if (selectedProperties.length === 0) {
      toast.warning('Please select properties to approve');
      return;
    }

    try {
      await propertyMutations.bulkApprove.mutateAsync({
        property_ids: selectedProperties,
        reason: 'Bulk approval via admin dashboard',
      });
      setSelectedProperties([]);
    } catch (error) {
      console.error('Failed to bulk approve properties:', error);
    }
  };

  const handleBulkReject = async () => {
    if (selectedProperties.length === 0) {
      toast.warning('Please select properties to reject');
      return;
    }

    const result = await Swal.fire({
      title: `Reject ${selectedProperties.length} Properties?`,
      input: 'textarea',
      inputLabel: 'Please provide a reason for bulk rejection:',
      inputPlaceholder: 'Enter rejection reason...',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason for rejection!'
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Reject All Selected',
      confirmButtonColor: '#EF4444',
      cancelButtonText: 'Cancel',
      icon: 'warning'
    });

    if (result.isConfirmed && result.value) {
      try {
        await propertyMutations.bulkReject.mutateAsync({
          property_ids: selectedProperties,
          reason: result.value,
        });
        setSelectedProperties([]);
        
        await Swal.fire({
          title: 'Properties Rejected',
          text: `${selectedProperties.length} properties have been rejected successfully.`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error('Failed to bulk reject properties:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to reject properties. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  // FIX 1: Fixed handleSort signature
  const handleSort = (field: string, direction: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_order: (direction === 'asc' || direction === 'desc') ? direction : 'asc'
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Handle export (placeholder)
  const handleExport = () => {
    toast.info('Export functionality will be implemented');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600 mt-1">
            Manage property listings, approvals, and assignments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>{isFilterVisible ? 'Hide' : 'Show'} Filters</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6">
              {stat.loading ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="sm" />
                </div>
              ) : stat.error ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-red-600">Failed to load</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center mt-2">
                        <Badge variant={stat.variant} size="sm">
                          {stat.change.value} {stat.change.period}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.variant === 'warning' ? 'bg-yellow-100' :
                    stat.variant === 'success' ? 'bg-green-100' :
                    stat.variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      stat.variant === 'warning' ? 'text-yellow-600' :
                      stat.variant === 'success' ? 'text-green-600' :
                      stat.variant === 'danger' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Statistics Error Alert */}
      {statisticsError && (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Statistics Loading Issue</h3>
                <p className="text-sm text-red-700 mt-1">
                  {statisticsError}. The statistics may not reflect current data. Please refresh the page or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      {isFilterVisible && (
        <PropertyFilter
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
          csAgents={csAgents}
        />
      )}

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedProperties.length} properties selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={handleBulkApprove}
                disabled={propertyMutations.bulkApprove.isPending}
              >
                {propertyMutations.bulkApprove.isPending ? 'Approving...' : 'Approve Selected'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkReject}
                disabled={propertyMutations.bulkReject.isPending}
              >
                {propertyMutations.bulkReject.isPending ? 'Rejecting...' : 'Reject Selected'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProperties([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Properties Loading Error */}
      {propertiesError && (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Failed to Load Properties</h3>
                <p className="text-sm text-red-700 mt-1">
                  There was an error loading the properties list. Please check your network connection and try again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Properties Table */}
      <Card>
        <PropertiesTable
          data={propertiesData?.data || []}
          loading={propertiesLoading}
          onPropertySelect={handlePropertySelect}
          onApprove={handleApproveProperty}
          onReject={handleRejectProperty}
          onAssignCS={handleAssignCS}
          onView={handleViewProperty}
          selectedProperties={selectedProperties}
          onSelectionChange={setSelectedProperties}
          sortBy={filters.sort_by}
          sortOrder={filters.sort_order}
          onSort={handleSort}
        />
      </Card>

      {/* Pagination */}
      {propertiesData && propertiesData.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Showing {propertiesData.from} to {propertiesData.to} of {propertiesData.total} properties
            </span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="rounded border-gray-300 text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={propertiesData.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Property Details Modal - Optional fallback */}
      {isDetailsModalOpen && selectedPropertyId && (
        <PropertyDetailsModal
          propertyId={selectedPropertyId}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPropertyId(null);
          }}
          onApprove={handleApproveProperty}
          onReject={handleRejectProperty}
          onAssignCS={handleAssignCS}
        />
      )}

      {/* Agent Assignment Modal */}
      <AgentAssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAgentAssignment}
        propertyId={selectedPropertyForAssign?.id || 0}
        propertyTitle={selectedPropertyForAssign?.title || ''}
        agents={csAgents || []}
        loading={false}
        hasActiveAssignment={false} // This is handled in the component logic
      />
    </div>
  );
};