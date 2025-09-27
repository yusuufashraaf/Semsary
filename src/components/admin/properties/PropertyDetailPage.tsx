// src/components/admin/properties/ImprovedPropertyDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { AgentAssignmentModal } from '@components/admin/modals/AgentAssignmentModal';
import { useProperty, usePropertyMutations, useCSAgents } from '@hooks/usePropertiesQueries';
import { formatCurrency, formatNumber, formatDate } from '@utils/formatters';
import { getStatusVariant } from '@utils/statusHelpers';
import Swal from 'sweetalert2';
import {
  ArrowLeftIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
  PhotoIcon,
  DocumentTextIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ShareIcon,
  PrinterIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { propertiesApi } from '@api/endpoints/properties';
import { Carousel } from 'react-bootstrap';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = id ? parseInt(id) : 0;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'documents' | 'amenities' | 'history' | 'verification'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { data: property, isLoading, error } = useProperty(propertyId, propertyId > 0);
  const { data: csAgents } = useCSAgents();
  const propertyMutations = usePropertyMutations();

  // Check if property has active assignment
  const hasActiveAssignment = property?.assignment?.is_assigned === true;

  // Handle approve property with SweetAlert2
  const handleApproveProperty = async () => {
    if (!property) return;
    
    const result = await Swal.fire({
      title: 'Approve Property?',
      text: 'This property will be marked as approved and made visible to users.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await propertyMutations.updateStatus.mutateAsync({
          id: property.id,
          status: 'Valid',
          data: {
            reason: 'Property meets all requirements and has been verified',
            notify_owner: true,
            internal_notes: 'Approved via admin dashboard',
          },
        });
        
        await Swal.fire({
          title: 'Approved!',
          text: 'The property has been approved successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error('Failed to approve property:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to approve property. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  // Handle reject property with SweetAlert2
  const handleRejectProperty = async () => {
    if (!property) return;
    
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
          id: property.id,
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

  // Handle assign CS agent - opens modal instead of alert
  const handleAssignCS = () => {
    setAssignModalOpen(true);
  };

  // Handle agent assignment from modal
  const handleAgentAssignment = async (
    agentId: number, 
    propertyId: number, 
    assignmentData: {
      priority: 'low' | 'medium' | 'high';
      due_date: string;
      assignment_type: 'verification' | 'inspection' | 'follow_up';
      notes?: string;
    }
  ): Promise<boolean> => {
    try {
      const response = await propertiesApi.assignToCSAgent(propertyId, {
        cs_agent_id: agentId,
        ...assignmentData
      });

      if (response.success) {
        // Invalidate queries to refresh data
        await propertyMutations.assignToCS.mutateAsync({
          propertyId,
          data: { cs_agent_id: agentId, ...assignmentData }
        });
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'photos', label: 'Photos', icon: PhotoIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'amenities', label: 'Amenities', icon: SparklesIcon },
    { id: 'verification', label: 'Verification', icon: ExclamationTriangleIcon },
    { id: 'history', label: 'History', icon: CalendarIcon },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <XCircleIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for could not be loaded.</p>
          <Button variant="outline" onClick={() => navigate('/admin/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const statusVariant = getStatusVariant(property.status);
  const riskVariant = property.admin_info?.requires_attention ? 'danger' : 'success';

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Property Image */}
      <div className="lg:col-span-2">
<Card className="p-0 overflow-hidden">
  {property.images && property.images.length > 0 ? (
    <Carousel 
      indicators={property.images.length > 1}
      controls={property.images.length > 1}
      interval={null} // Remove auto-sliding
      className="property-carousel"
    >
      {property.images.map((image, index) => (
        <Carousel.Item key={image.id || index}>
          <img
            src={image.url}
            alt={`${property.title} - Image ${index + 1}`}
            className="w-full h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          {property.images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              {index + 1} / {property.images.length}
            </div>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <div className="h-96 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No images available</p>
      </div>
    </div>
  )}
</Card>

        {/* Property Description */}
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="text-gray-700">
              {property.description ? (
                <div>
                  <p className={`whitespace-pre-wrap ${!showFullDescription && property.description.length > 300 ? 'line-clamp-4' : ''}`}>
                    {showFullDescription ? property.description : 
                     property.description.length > 300 ? 
                     property.description.substring(0, 300) + '...' : 
                     property.description}
                  </p>
                  {property.description.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
                    >
                      {showFullDescription ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No description provided.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Property Details Sidebar */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Property ID</span>
                <span className="text-sm font-medium">#{property.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium">{property.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Price</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {property.property_details?.formatted_price || `${formatCurrency(property.property_details?.price || 0)}`}
                  </div>
                  <div className="text-xs text-gray-500">{property.property_details?.price_type || 'monthly'}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Size</span>
                <span className="text-sm font-medium">{formatNumber(property.property_details?.size || 0)} {property.property_details?.size_unit || 'sqft'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bedrooms</span>
                <span className="text-sm font-medium">{property.property_details?.bedrooms || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bathrooms</span>
                <span className="text-sm font-medium">{property.property_details?.bathrooms || 0}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Status</span>
                <Badge variant={statusVariant} size="sm">
                  {property.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fraud Risk</span>
                <Badge variant={riskVariant} size="sm">
                  {property.admin_info?.requires_attention ? 'High Risk' : 'Low Risk'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Submitted</span>
                <span className="text-sm font-medium">{formatDate(property.activity?.created_at || property.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">{formatDate(property.activity?.updated_at || property.updated_at)}</span>
              </div>
              {hasActiveAssignment && property.assignment && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assignment Status</span>
                    <Badge variant="primary" size="sm">
                      Assigned
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assigned Agent</span>
                    <span className="text-sm font-medium">{property.assignment.agent?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assigned Date</span>
                    <span className="text-sm font-medium">{property.assignment.assigned_at}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assignment Status</span>
                    <Badge variant={property.assignment.status === 'completed' ? 'success' : 'warning'} size="sm">
                      {property.assignment.status}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Owner Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
            <div className="flex items-center space-x-3 mb-4">
              {property.owner?.id_image_url ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={property.owner.id_image_url}
                  alt={`${property.owner.first_name} ${property.owner.last_name}`}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {property.owner?.first_name} {property.owner?.last_name}
                </h4>
                <p className="text-sm text-gray-600">{property.owner?.email}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {property.location?.full_address || property.location?.address}
                </p>
                <p className="text-sm text-gray-600">
                  {property.location?.city}{property.location?.state ? `, ${property.location.state}` : ''}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/properties')}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Properties</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-sm text-gray-600">
                  {property.type} • {property.location?.city}{property.location?.state ? `, ${property.location.state}` : ''}
                </p>
              </div>
            </div>
            
            {/* <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <PrinterIcon className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </div> */}
          </div>

          {/* Action Bar */}
          {['Pending', 'pending'].includes(property.status?.toLowerCase() || '') && (
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">This property is pending approval</span>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="success"
                  onClick={handleApproveProperty}
                  disabled={propertyMutations.updateStatus.isPending}
                >
                  {propertyMutations.updateStatus.isPending ? 'Approving...' : 'Approve Property'}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRejectProperty}
                  disabled={propertyMutations.updateStatus.isPending}
                >
                  {propertyMutations.updateStatus.isPending ? 'Rejecting...' : 'Reject Property'}
                </Button>
                {/* Only show assign button if no active assignment */}
                {!hasActiveAssignment && (
                  <Button
                    variant="outline"
                    onClick={handleAssignCS}
                    disabled={propertyMutations.assignToCS.isPending}
                  >
                    {propertyMutations.assignToCS.isPending ? 'Assigning...' : 'Assign CS Agent'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          {/* <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div> */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Agent Assignment Modal - Updated to use new filtering logic */}
      <AgentAssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAgentAssignment}
        propertyId={propertyId}
        propertyTitle={property?.title || ''}
        agents={csAgents || []}
        loading={false}
        hasActiveAssignment={hasActiveAssignment}
      />
    </div>
  );
};
