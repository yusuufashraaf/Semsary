// src/components/admin/properties/PropertiesTable.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminProperty } from '@api/endpoints/properties';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { EmptyState } from '@components/ui/EmptyState';
import { formatNumber, formatCurrency, formatDate } from '@utils/formatters';
import { 
  UserIcon,
  CursorArrowRaysIcon 
} from '@heroicons/react/24/outline';

interface PropertiesTableProps {
  data: AdminProperty[];
  loading?: boolean;
  onPropertySelect?: (property: AdminProperty) => void;
  onApprove?: (propertyId: number) => void;
  onReject?: (propertyId: number) => void;
  onAssignCS?: (propertyId: number) => void;
  onView?: (propertyId: number) => void;
  selectedProperties?: number[];
  onSelectionChange?: (propertyIds: number[]) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string, direction: string) => void;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  data,
  loading = false,
  onApprove,
  onReject,
  onAssignCS,
  onView,
  selectedProperties = [],
  onSelectionChange,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const navigate = useNavigate();

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(p => p.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (propertyId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedProperties, propertyId]);
    } else {
      onSelectionChange?.(selectedProperties.filter(id => id !== propertyId));
    }
  };

  // Handle row click to navigate to property details
  const handleRowClick = (property: AdminProperty, event: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons or checkboxes
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' || 
      target.tagName === 'INPUT' ||
      target.closest('button') || 
      target.closest('.action-button')
    ) {
      return;
    }
    navigate(`/admin/properties/${property.id}`);
  };

  const isAllSelected = useMemo(() => {
    return data.length > 0 && data.every(property => selectedProperties.includes(property.id));
  }, [data, selectedProperties]);

  const isPartiallySelected = useMemo(() => {
    return selectedProperties.length > 0 && !isAllSelected;
  }, [selectedProperties, isAllSelected]);

  const handleSort = (column: string) => {
    if (onSort) {
      const newDirection = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(column, newDirection);
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string, fraudRisk: string) => {
    const statusMapping = {
      'Invalid': 'danger',
      'Valid': 'success',
      'Pending': 'warning', 
      'Rented': 'primary',
      'Sold': 'secondary',
      'Approved': 'success',
      'Rejected': 'danger'
    } as const;
    
    const statusVariant = statusMapping[status as keyof typeof statusMapping] || 'warning';
    const riskVariant = fraudRisk === 'High Risk' ? 'danger' as const : 
                       fraudRisk === 'Medium Risk' ? 'warning' as const : 'success' as const;
    
    return { statusVariant, riskVariant };
  };

  // Handle action button clicks
  const handleActionClick = (event: React.MouseEvent, action: () => void) => {
    event.stopPropagation(); // Prevent row click
    action();
  };


  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Loading properties...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Properties Found"
        description="No properties match your current filters. Try adjusting your search criteria."
        action={
          <Button variant="primary" onClick={() => window.location.reload()}>
            Refresh Properties
          </Button>
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-48"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  {sortBy === 'title' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-40"
                onClick={() => handleSort('owner')}
              >
                <div className="flex items-center space-x-1">
                  <span>Owner</span>
                  {sortBy === 'owner' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Location
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-40"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {sortBy === 'price' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-40"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortBy === 'status' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Fraud Detection
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Assignment Status
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-40"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1">
                  <span>Submitted Date</span>
                  {sortBy === 'created_at' && (
                    <span className="text-blue-500">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((property) => {
              const { statusVariant, riskVariant } = getStatusBadge(
                property.property_state, 
                property.fraud_risk_score
              );
              
              return (
                <tr 
                  key={property.id}
                  onClick={(e) => handleRowClick(property, e)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                    selectedProperties.includes(property.id) ? 'bg-blue-50' : ''
                  }`}
                  title="Click to view property details"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(property.id, e.target.checked);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  
                  
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate flex items-center">
                        {property.title}
                        <CursorArrowRaysIcon className="h-4 w-4 text-gray-400 ml-2" />
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.type} • {property.bedrooms}BR / {property.bathrooms}BA
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(property.size)} sqft
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {property.owner?.id_image_url ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={property.owner.id_image_url}
                            alt={`${property.owner.first_name} ${property.owner.last_name}`}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {property.owner?.first_name} {property.owner?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.owner?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {property.location?.city}, {property.location?.state}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {property.location?.address}
                    </div>
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(parseFloat(property.price) || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.price_type}
                    </div>
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Badge variant={statusVariant} size="sm">
                      {property.property_state}
                    </Badge>
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Badge variant={riskVariant} size="sm">
                      {property.fraud_risk_score}
                    </Badge>
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap">
                    {property.assignment?.is_assigned ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{property.assignment.agent?.name}</div>
                        <div className="text-gray-500">{property.assignment.status}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(property.submitted_date)}
                  </td>
                  
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* View Button - Text with same color styling */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleActionClick(e, () => onView?.(property.id))}
                        className="action-button text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                        title="View Details"
                      >
                        View
                      </Button>
                      
                      {/* Conditional Approve/Reject Buttons for Pending Properties */}
                      {['Pending', 'pending'].includes(property.property_state.toLowerCase()) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleActionClick(e, () => onApprove?.(property.id))}
                            className="action-button text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200"
                            title="Approve Property"
                          >
                            Approve
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleActionClick(e, () => onReject?.(property.id))}
                            className="action-button text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200"
                            title="Reject Property"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {/* Assign Agent Button - Only show if no active assignment */}
                      {!property.assignment?.is_assigned && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleActionClick(e, () => onAssignCS?.(property.id))}
                          className="action-button text-purple-600 hover:text-purple-800 hover:bg-purple-50 border-purple-200"
                          title="Assign CS Agent"
                        >
                          Assign Agent
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedProperties.length} properties selected
            </span>
            <div className="flex space-x-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                }}
              >
                Approve Selected
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                }}
              >
                Reject Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
